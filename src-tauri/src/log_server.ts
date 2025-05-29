// log_server.ts
const clients = new Set<WebSocket>();
const logs: any[] = [];

// Загружаем HTML интерфейс для логов
let html: string;
try {
  const htmlFile = Bun.file("src-tauri/src/log-ui.html");
  html = await htmlFile.text();
  console.log("[LOG SERVER] HTML интерфейс загружен успешно");
} catch (err) {
  console.error("[LOG SERVER] Ошибка загрузки log-ui.html:", err);
  // Fallback к простому интерфейсу
  html = `<!DOCTYPE html>
<html>
<head>
    <title>Crypta - Логи (Fallback)</title>
    <style>
        body { font-family: monospace; margin: 0; padding: 20px; background: #0d1117; color: #f0f6fc; }
        .error { color: #f85149; font-weight: bold; margin-bottom: 20px; }
        .info { color: #58a6ff; }
    </style>
</head>
<body>
    <div class="error">⚠️ Не удалось загрузить основной интерфейс. Используется упрощённая версия.</div>
    <div class="info">Проверьте наличие файла log-ui.html в корневой папке проекта.</div>
    <div class="info">Логи будут отображаться в консоли сервера.</div>
</body>
</html>`;
}

// Максимальное количество логов, которые мы сохраняем в памяти
const MAX_LOGS = 1000;

// Статистика сервера
let serverStats = {
  startTime: new Date(),
  totalConnections: 0,
  totalMessages: 0,
  lastActivity: new Date(),
};

export function startLogServer(port: number = 9999) {
  console.log(`[LOG SERVER] Запуск сервера на порту ${port}...`);

  const server = Bun.serve({
    port,
    fetch(req, server) {
      const url = new URL(req.url);

      if (url.pathname === "/ws") {
        if (req.headers.get("upgrade") !== "websocket") {
          return new Response("Ожидается WebSocket соединение", {
            status: 400,
          });
        }

        const { socket, response } = server.upgrade(req);
        return response;
      }

      if (url.pathname === "/logs") {
        return new Response(JSON.stringify(logs), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      if (url.pathname === "/stats") {
        const stats = {
          ...serverStats,
          currentConnections: clients.size,
          totalLogs: logs.length,
          memoryUsage: process.memoryUsage(),
        };
        return new Response(JSON.stringify(stats, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Основная страничка UI
      if (url.pathname === "/" || url.pathname === "") {
        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      }

      return new Response("Not Found", { status: 404 });
    },
    websocket: {
      open(ws) {
        clients.add(ws);
        serverStats.totalConnections++;
        serverStats.lastActivity = new Date();
        console.log(
          `[LOG SERVER] Новое подключение. Всего подключений: ${clients.size}`,
        );

        // Отправляем статистику подключения
        try {
          ws.send(
            JSON.stringify({
              type: "connection",
              level: "info",
              message: `WebSocket подключен. Активных соединений: ${clients.size}`,
              timestamp: new Date().toISOString(),
            }),
          );
        } catch (err) {
          console.error("[LOG SERVER] Ошибка отправки приветствия:", err);
        }
      },
      message(ws, data) {
        try {
          const log = JSON.parse(data.toString());

          serverStats.totalMessages++;
          serverStats.lastActivity = new Date();

          // Добавляем временную метку, если её нет
          if (!log.timestamp) {
            log.timestamp = new Date().toISOString();
          }

          // Валидация лога
          if (!log.level) {
            log.level = "info";
          }
          if (!log.message) {
            log.message = "Пустое сообщение";
          }

          // Ограничиваем количество хранимых логов
          logs.push(log);
          if (logs.length > MAX_LOGS) {
            logs.shift(); // Удаляем самый старый лог
          }

          // Отсылаем остальным клиентам
          let broadcastCount = 0;
          for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              try {
                client.send(data);
                broadcastCount++;
              } catch (sendErr) {
                console.error("[LOG SERVER] Ошибка отправки клиенту:", sendErr);
                clients.delete(client);
              }
            }
          }

          // Вывод в системную консоль с красивым форматированием
          const timestamp = new Date(log.timestamp).toLocaleTimeString("ru-RU");
          const levelColors = {
            error: "\x1b[31m", // красный
            warn: "\x1b[33m", // жёлтый
            info: "\x1b[36m", // голубой
            debug: "\x1b[35m", // фиолетовый
          };
          const reset = "\x1b[0m";
          const color = levelColors[log.level] || "\x1b[37m"; // белый по умолчанию

          console.log(
            `${color}[${log.level.toUpperCase()}]${reset} ${timestamp} ${log.message}`,
          );

          if (broadcastCount > 0) {
            console.log(
              `[LOG SERVER] Сообщение отправлено ${broadcastCount} клиентам`,
            );
          }
        } catch (err) {
          console.error("[LOG SERVER] Ошибка обработки сообщения:", err);
          console.error("[LOG SERVER] Данные:", data.toString());
        }
      },
      close(ws) {
        clients.delete(ws);
        serverStats.lastActivity = new Date();
        console.log(
          `[LOG SERVER] Подключение закрыто. Осталось подключений: ${clients.size}`,
        );
      },
    },
  });

  console.log(`🚀 Лог-сервер запущен успешно!`);
  console.log(`   📊 Web UI: http://localhost:${server.port}`);
  console.log(`   📡 WebSocket: ws://localhost:${server.port}/ws`);
  console.log(`   📈 API логов: http://localhost:${server.port}/logs`);
  console.log(`   📋 Статистика: http://localhost:${server.port}/stats`);
  console.log(`   💾 Макс. логов в памяти: ${MAX_LOGS}`);

  // Логируем статистику каждые 5 минут
  const statsInterval = setInterval(
    () => {
      const uptime = Date.now() - serverStats.startTime.getTime();
      const uptimeMinutes = Math.floor(uptime / 60000);
      console.log(
        `[LOG SERVER] Статистика: ${uptimeMinutes}мин работы, ${serverStats.totalConnections} подключений, ${serverStats.totalMessages} сообщений, ${logs.length} логов в памяти`,
      );
    },
    5 * 60 * 1000,
  );

  // Очистка интервала при закрытии
  process.on("SIGTERM", () => {
    clearInterval(statsInterval);
    console.log("[LOG SERVER] Сервер остановлен");
  });

  return server;
}
