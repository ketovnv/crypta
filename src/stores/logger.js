import { action, makeAutoObservable, reaction, toJS } from "mobx"; // console.log('%c a spicy log message ?',

// console.log('%c a spicy log message ?',
//     [
//       'background: linear-gradient(#D33106, #571402)'
//       , 'padding: 2px:'
//       , 'color: white'
//       , 'display: block'
//       , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
//       , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
//       , 'line-height: 20px'
//       , 'text-align: center'
//       , 'font-weight: bold'
//     ].join(';'))

// Расширенные стили для разных типов логов
const LOG_STYLES = {
  info: {
    base: "#317FF3",
    light: "#74B5F6",
    dark: "#1036A2",
  },
  success: {
    base: "#31B257;font-style:italic",
    light: "#81FF84; font-style:italic",
    dark: "#115222; font-style:italic",
  },
  warning: {
    base: "#FFC107",
    light: "#FFD54F",
    dark: "#FFA000",
  },
  error: {
    base: "#F44336",
    light: "#E57373",
    dark: "#D32F2F",
  },
  debug: {
    base: "#9C27B0",
    light: "#D868E8",
    dark: "#5B1F72",
  },
  system: {
    base: "#607D8B",
    light: "#90A4AE",
    dark: "#344A54",
  },
};

const GRADIENTS = {
  blue: {
    base: "color: #317FF3; font-weight: bold",
    light: "color: #74B5F6; font-weight: normal",
    dark: "color: #1036A2; font-weight: bold",
  },
  green: {
    base: "color: #31B257; font-weight: bold",
    light: "color: #81FF84; font-weight: normal",
    dark: "color: #115222; font-weight: bold",
  },
  orange: {
    base: "color: #FFC107; font-weight: bold",
    light: "color: #FFD54F; font-weight: normal",
    dark: "color: #FFA000; font-weight: bold",
  },
  red: {
    base: "color: #F44336; font-weight: bold",
    light: "color: #E57373; font-weight: normal",
    dark: "color: #D32F2F; font-weight: bold",
  },
  pink: {
    base: "color: #9C27B0; font-weight: bold",
    light: "color: #D868E8; font-weight: normal",
    dark: "color: #5B1F72; font-weight: bold",
  },
  grey: {
    base: "color: #607D8B; font-weight: bold;",
    light: "color: #90A4AE; font-weight: normal",
    dark: "color: #344A54; font-weight: bold",
  },
};

let S30 = ";font-size:30px";
let S20 = ";font-size:20px";
let BL = ";font-weight: bold";
let IT = ";font-style: italic";

// Форматы для различных типов данных
const FORMAT_STYLES = {
  code: "background: #1E1E1E; color: #D4D4D4; padding: 2px 4px; border-radius: 3px; font-family: monospace",
  variable: "color: #569CD6; font-family: monospace",
  object: "color: #9CDCFE; font-family: monospace",
  function: "color: #DCDCAA; font-family: monospace",
  string: "color: #CE9178; font-family: monospace",
  number: "color: #B5CEA8; font-family: monospace",
  boolean: "color: #569CD6; font-family: monospace",
  null: "color: #569CD6; font-family: monospace",
  undefined: "color: #569CD6; font-family: monospace",
  promise: "color: #C586C0; font-family: monospace",
};

// Утилита для форматирования времени с миллисекундами
const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("ru-RU", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
};

class loggerStore {
  logs = [];
  // groupStack = [];
  storeWatchers = new Map();
  promiseStack = new Map();
  bounds = {};
  rusLetters = "абвгдеёжзиклмнопрстуфхцчшщьъэюя";
  engLetters = "abcdefghijklmnopqrstuvwxyz";
  digits = "0123456789{}[]()<>";

  constructor() {
    makeAutoObservable(this);
  }

  get getBounds() {
    return this.bounds;
  }

  @action
  setBounds = (bounds) => (this.bounds = bounds);
  @action
  setBoundsMouse = (clientX, clientY) => {
    this.bounds.mouseX = Math.round(clientX - this.bounds.left);
    this.bounds.mouseY = Math.round(clientY - this.bounds.top);
  };

  @action
  setBoundsMouseHover = (isHover) => (this.bounds.isMouseHover = isHover);

  // Форматирование значений разных типов
  formatValue = (value, type = null) => {
    const getType = (val) => {
      if (val instanceof Promise) return "promise";
      return type || typeof val;
    };

    const valueType = getType(value);
    const style = FORMAT_STYLES[valueType] || FORMAT_STYLES.variable;

    return {
      value: String(value),
      style,
    };
  };

  // Продвинутое форматирование сообщений
  formatMessage = (template, ...args) => {
    let formattedParts = [];
    let styles = [];

    // Разбираем строку шаблона на части
    const parts = template.split(/(%[codsfbn])/g);
    let argIndex = 0;

    parts.forEach((part) => {
      if (part.startsWith("%")) {
        const value = args[argIndex];
        const type = part[1];
        const formatted = this.formatValue(value, type);

        formattedParts.push(`%c${formatted.value}`);
        styles.push(formatted.style);

        argIndex++;
      } else {
        formattedParts.push(part);
      }
    });

    return {
      message: formattedParts.join(""),
      styles,
    };
  };

  whatIs = (object) => {
    const stringConstructor = "test".constructor;
    const arrayConstructor = [].constructor;
    const objectConstructor = {}.constructor;
    if (object === null) {
      return "null";
    }
    if (object === undefined) {
      return "undefined";
    }
    if (object.constructor === stringConstructor) {
      return "String";
    }
    if (object.constructor === arrayConstructor) {
      return "Array";
    }
    if (object.constructor === objectConstructor) {
      return "Object";
    }
    return "don't know";
  };

  getRandomColor = (brightness = null) => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      let index = Math.floor(Math.random() * (brightness === null ? 16 : 8));

      if (brightness > 8) index += brightness / 2;

      color += letters[index >= 0 ? index : 0];
    }
    // console.log(color);
    return color;
  };

  logArray = (label, data) => {
    data.forEach((item, i) => {
      this.logJSON("🥁" + label + "[" + i + "]", item);
    });

    Object.entries(data).forEach(([key, value]) => {
      console.log(
        "%c" + key + " : %c" + JSON.stringify(value),
        "color:" + this.getRandomColor() + ";font-weight:bold;font-size:25px",
        "color:white;font-weight:bold;font-size:20px",
      );
    });
  };

  logJSON = (label, data, fontSize = 20) => {
    if (!data || !data.length) return;

    this.logWhiteRandom("🥷", "Сейчас будет JSON 🥷");
    this.success("♠️♦️", label + "💘♣️");
    Object.entries(data ?? { key: "null" }).forEach(([key, value]) => {
      console.log(
        "%c" + key + " : %c" + JSON.stringify(value ?? "null"),
        "color:" +
          this.getRandomColor() +
          ";font-weight:bold;font-size:" +
          fontSize +
          "px",
        "color:white;font-weight:bold;font-size:" + fontSize + "px",
      );
    });
  };

  returnJSON = (label, data, fontSize = 20) => {
    // if (!data || !data.length) return;
    let text = "🥷" + "Сейчас будет JSON 🥷";
    text += "♠️♦️" + label + "💘♣️\n";
    return text;
    Object.entries(data ?? { key: "null" }).forEach(([key, value]) => {
      console.log(
        "%c" + key + " : %c" + JSON.stringify(value ?? "null"),
        "color:" +
          this.getRandomColor() +
          ";font-weight:bold;font-size:" +
          fontSize +
          "px",
        "color:white;font-weight:bold;font-size:" + fontSize + "px",
      );
    });
  };

  // Расширенный метод логирования
  log = (
    type,
    message,
    data,
    fontSize = 16,
    messageColor = "white",
    valueColor = "yellow",
  ) => {
    const timestamp = formatTime();
    // const { message, styles } = this.formatMessage(messageTemplate, ...args);

    // const styles = {};
    // const logEntry = {
    //   id: Date.now(),
    //   timestamp,
    //   type,
    //   message,
    //   styles,
    //   rawArgs: args,
    // };
    //
    // runInAction(() => {
    //   this.logs.push(logEntry);
    // });

    const color = this.getRandomColor(16);

    switch (type) {
      case "random":
        messageColor = color;
        valueColor = this.getRandomColor(16);
        break;
      case "whiteRandom":
        valueColor = color;
        break;
      case "sameRandom":
        messageColor = color;
        valueColor = color;
        break;
      case "userColors":
        break;
      default:
        messageColor = LOG_STYLES[type].base;
        valueColor = LOG_STYLES[type].light;
    }

    messageColor = "color : " + messageColor;
    valueColor = "color : " + valueColor;

    // const tone=['light','dark','base'][Math.floor(Math.random() * 3)];
    const rgB = Math.floor(Math.random() * 75);

    const timeColor =
      `background: linear-gradient(#CCFF${rgB + 20}, #7799${rgB} );` +
      "padding: 2px;margin-right: 5px;color: #1122" +
      rgB +
      ";font-size: 8px;display: block" +
      "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset" +
      BL +
      IT;

    // Применяем все стили в консоли
    console.log(
      // "%c" + timestamp +
      ` %c${message} : ` + ` %c${data}`,
      // timeColor,

      messageColor + ";font-size:" + fontSize + "px;",
      valueColor +
        "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);font-size:" +
        fontSize +
        "px;font-weight:bold;",
    );
  };

  // Отслеживание промисов
  trackPromise = (promise, label) => {
    const id = Date.now();
    this.promiseStack.set(id, label);

    this.log("info", `🔄 Начало промиса: %s`, label);

    return promise
      .then((result) => {
        this.log("success", `✅ Промис выполнен: %s`, label);
        this.log("debug", "Результат: %o", result);
        return result;
      })
      .catch((error) => {
        this.log("error", `❌ Ошибка промиса: %s`, label);
        this.log("error", "Ошибка: %o", error);
        throw error;
      })
      .finally(() => {
        this.promiseStack.delete(id);
      });
  };

  // Наблюдение за свойствами других хранилищ
  watchStore = (store, properties, options = {}) => {
    const { name = "Store", debounce = 100, deep = false } = options;

    const watchers = properties.map((prop) => {
      return reaction(
        () => (deep ? toJS(store[prop]) : store[prop]),
        (value, prevValue) => {
          this.group(`📊 Изменение ${name}.${prop}`);
          this.log("info", "Новое значение: %o", value);
          this.log("debug", "Предыдущее значение: %o", prevValue);
          this.groupEnd();
        },
        {
          name: `${name}.${prop}`,
          delay: debounce,
        },
      );
    });

    this.storeWatchers.set(store, watchers);
    this.log("system", `🔍 Начато наблюдение за ${name}`);

    return () => {
      watchers.forEach((dispose) => dispose());
      this.storeWatchers.delete(store);
      this.log("system", `⏹ Остановлено наблюдение за ${name}`);
    };
  };

  getLogMessage = (message) =>
    this.whatIs(message) === "Object" ? Object.keys(message)[0] : message;

  getLogData = (message, data) =>
    this.whatIs(message) === "Object" ? message[Object.keys(message)[0]] : data;

  colorLog = (message, data, fontSize, messageColor, valueColor) =>
    this.log(
      "userColors",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
      messageColor,
      valueColor,
    );

  info = (message, data, fontSize) => this.log("info", message, data, fontSize);

  success = (message, data, fontSize) =>
    this.log(
      "success",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  warning = (message, data, fontSize) =>
    this.log(
      "warning",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  error = (message, data, fontSize) =>
    this.log(
      "error",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  debug = (message, data, fontSize) =>
    this.log(
      "debug",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  logRandomColors = (message, data, fontSize) =>
    this.log(
      "random",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  logWhiteRandom = (message, data, fontSize) =>
    this.log(
      "whiteRandom",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  logSameRandom = (message, data, fontSize) =>
    this.log(
      "sameRandom",
      this.getLogMessage(message),
      this.getLogData(message, data),
      fontSize,
    );

  // Форматированный вывод кода
  logCode = (code, language = "javascript") => {
    this.group("📝 Код");
    this.log("debug", `Язык: %c${language}`, FORMAT_STYLES.string);
    this.log("info", "%c" + code, FORMAT_STYLES.code);
    this.groupEnd();
  };

  // Логирование производительности
  logPerformance = (label, callback) => {
    const start = performance.now();
    const result = callback();
    const duration = performance.now() - start;

    this.group(`⚡ Производительность: ${label}`);
    this.log(
      "info",
      `Время выполнения: %c${duration.toFixed(2)}ms`,
      FORMAT_STYLES.number,
    );
    this.groupEnd();

    return result;
  };

  // Группировка логов
  group = (label) => {
    console.group(`%c${label}`);

    this.log("system", `Начало группы: ${label}`);
  };

  groupEnd = () => {
    // const label = this.groupStack.pop();
    console.groupEnd();

    this.log("system", `Конец группы: ${label}`);
  };

  // Измерение времени выполнения
  time = (label) => {
    console.time(label);
    this.log("system", `Начало замера времени: ${label}`);
  };

  timeEnd = (label) => {
    console.timeEnd(label);
    this.log("system", `Конец замера времени: ${label}`);
  };

  // Остальные методы остаются без изменений...
  // (group, groupEnd, time, timeEnd, clearLogs, setEnabled, setLogLevel, etc.)
}

export const logger = new loggerStore();
