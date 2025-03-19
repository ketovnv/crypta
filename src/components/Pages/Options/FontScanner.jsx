import React, { useState } from "react";
import { logger } from "@stores/logger.js";
import { List } from "@mantine/core";

function FontScanner() {
  const [fonts, setFonts] = useState([]);
  const [status, setStatus] = useState("idle");

  const scanPage = () => {
    setStatus("scanning");
    // Функция для асинхронного сканирования, чтобы не блокировать UI
    setTimeout(() => {
      try {
        // const elements = document.querySelectorAll('button');
        const grid = document.querySelector(".sampleGrid");
        const button = grid.querySelector("button");
        const fontMap = {};
        let uniqueId = 0;

        // elements.forEach(el => {
        // Пропускаем пустые элементы и элементы без текста
        // const fontName =el.querySelector('p')?.textContent || null;
        const fontName = button.querySelector("p")?.textContent || null;
        if (!fontName) {
          logger.warning("Font name not found");
          return;
        }
        // logger.info(fontName)
        // const rusFont =el.querySelector('.rusFont');
        const rusFont = button.querySelector(".rusFont");
        const styles = window.getComputedStyle(rusFont);
        Object.entries(styles).map(([key, style]) => {
            // logger.info(key);
          // logger.info(style);
          const value = styles.getPropertyValue(style);
          if (value) {
            logger.colorLog(style, value,12,"#ffa", "#aaf");
            // logger.logRandomColors(style, value,12);
          }

        });

        // console.log('style',style) // Log the style object to the console.
        // logger.logJSON(fontName,style,12)

        // fontMap.set(fontName, {
        //     id: uniqueId++,
        //     fontFamily: style.fontFamily,
        //     fontSize: style.fontSize,
        //     fontWeight: style.fontWeight,
        //     fontStyle: style.fontStyle,
        //     lineHeight: style.lineHeight,
        //     selector: getCssPath(el),
        //     element: el.tagName.toLowerCase(),
        //     textSample: el.textContent.trim().slice(0, 50)
        // });

        // });
        //
        // logger.logJSON('style',style)
        // const fontArray = Array.from(fontMap.values());
        // setFonts(fontArray);
        setStatus("complete");
      } catch (error) {
        console.error("Ошибка сканирования шрифтов:", error);
        setStatus("error");
      }
    }, 100);
  };

  // Функция для создания CSS-пути до элемента
  const getCssPath = (element) => {
    if (!element || element === document.body) return "";

    let path = element.tagName.toLowerCase();
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className && typeof element.className === "string") {
      path += "." + element.className.trim().replace(/\s+/g, ".");
    }

    return getCssPath(element.parentNode) + " > " + path;
  };

  // Рендеринг строки таблицы для react-window
  const Row = ({ index, style }) => {
    const font = fonts[index];
    return (
      <div
        style={{ ...style, display: "flex", borderBottom: "1px solid #eee" }}
      >
        <div style={{ flex: 2, padding: "8px", fontFamily: font.fontFamily }}>
          {font.fontFamily}
        </div>
        <div style={{ flex: 1, padding: "8px" }}>{font.fontSize}</div>
        <div style={{ flex: 1, padding: "8px" }}>{font.fontWeight}</div>
        <div style={{ flex: 1, padding: "8px" }}>{font.element}</div>
        <div
          style={{
            flex: 3,
            padding: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {font.textSample}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Сканер шрифтов страницы</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={scanPage}
          disabled={status === "scanning"}
          style={{ padding: "8px 16px", marginRight: "10px" }}
        >
          {status === "scanning" ? "Сканирование..." : "Сканировать страницу"}
        </button>
      </div>

      {status === "error" && (
        <div style={{ color: "red" }}>Произошла ошибка при сканировании</div>
      )}

      {status === "complete" && (
        <>
          <div style={{ marginBottom: "10px" }}>
            Найдено {fonts.length} уникальных шрифтов
          </div>

          {/*<div style={{ display: 'flex', fontWeight: 'bold', padding: '8px 0', borderBottom: '2px solid #ddd' }}>*/}
          {/*    <div style={{ flex: 2 }}>Font Family</div>*/}
          {/*    <div style={{ flex: 1 }}>Size</div>*/}
          {/*    <div style={{ flex: 1 }}>Weight</div>*/}
          {/*    <div style={{ flex: 1 }}>Element</div>*/}
          {/*    <div style={{ flex: 3 }}>Sample Text</div>*/}
          {/*</div>*/}

          {/*<List*/}
          {/*    height={500}*/}
          {/*    itemCount={fonts.length}*/}
          {/*    itemSize={35}*/}
          {/*    width="100%"*/}
          {/*>*/}
          {/*    {Row}*/}
          {/*</List>*/}
        </>
      )}
    </div>
  );
}

export default FontScanner;
