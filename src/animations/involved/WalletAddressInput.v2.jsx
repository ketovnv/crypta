import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { TextInput } from "@mantine/core";
import { animations } from "@stores/animations.js";
import { uiStore } from "@stores/ui.js";
import { approveAnimations } from "../unified/presets/ApproveAnimations";
import { animationCore } from "../unified/AnimationCore";

const WalletAddressInput = ({
  value,
  setValue,
  isValid,
  setIsValid,
  inputName = "Название инпута!",
}) => {
  const [focused, setFocused] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const floating = focused || value.length > 0;

  // Анимация для лейбла
  const labelSpring = useSpring({
    y: floating ? -27 : 0,
    scale: floating ? 0.85 : 1,
    color:
      isValid === true
        ? uiStore.theme.accentColor
        : isValid === false
          ? uiStore.getRed
          : `oklch(${uiStore.themeIsDark ? 0.65 : 0.35} 0 0)`,
    config: {
      tension: 200,
      friction: 20,
    },
  });

  // Анимация для иконки валидации
  const validationIconSpring = useSpring({
    opacity: value.length > 0 ? 1 : 0,
    scale: value.length > 0 ? 1 : 0.8,
    config: {
      tension: 300,
      friction: 15,
    },
  });

  // Анимация для подчеркивания
  const underlineSpring = useSpring({
    scaleX: focused ? 2 : 0,
    backgroundColor:
      isValid === true
        ? uiStore.theme.accentColor
        : isValid === false
          ? uiStore.getRed
          : `oklch(${uiStore.themeIsDark ? 0.65 : 0.35} 0 0)`,
    config: {
      tension: 500,
      friction: 25,
    },
  });

  // Анимация для сообщения валидации
  const validationMessageSpring = useSpring({
    opacity: isValid !== null ? 1 : 0,
    y: isValid !== null ? 0 : -10,
    config: {
      tension: 200,
      friction: 20,
    },
  });

  // Анимация для тряски при ошибке
  const errorShakeSpring = useSpring({
    x: animateError ? [0, -4, 4, -4, 4, 0] : 0,
    config: {
      tension: 300,
      friction: 10,
      mass: 0.5,
    },
  });

  // Проверка валидности Ethereum адреса
  const validateEthAddress = (address) => {
    if (!address) return null;

    // Простая проверка: начинается с 0x, затем 40 шестнадцатеричных символов
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  // Проверяем адрес при изменении значения
  useEffect(() => {
    if (value.length > 0) {
      const valid = validateEthAddress(value);
      setIsValid(valid);

      // Запускаем анимацию ошибки, если адрес неверный
      if (valid === false) {
        setAnimateError(true);
        const timer = setTimeout(() => setAnimateError(false), 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsValid(null);
    }
  }, [value, setIsValid]);

  // Интеграция с системой анимаций
  useEffect(() => {
    // Регистрируем анимацию для оптимизации производительности
    const animationId = `input-${Math.random().toString(36).slice(2)}`;

    // Используем предустановленные анимации для инпута
    if (isValid !== undefined) {
      approveAnimations.inputFirst.update(isValid, focused);
    }

    return () => {
      // Удаляем анимацию при размонтировании
      animationCore.optimizeVisibility({ [animationId]: false });
    };
  }, [isValid, focused]);

  // Стили для инпута
  const inputStyles = {
    root: {
      position: "relative",
      marginBottom: 0,
      marginTop: "20px",
    },
    wrapper: {
      position: "relative",
    },
    input: {
      color: uiStore.theme.color,
      fontWeight: focused ? 800 : 300,
      fontFamily: "Chivo Mono",
      height: "25px",
      background: "transparent",
      border: "none",
      fontOpticalSizing: "auto",
      borderBottom: `2px solid ${
        isValid === true
          ? uiStore.theme.accentColor
          : isValid === false
            ? uiStore.getRed
            : `oklch(${uiStore.themeIsDark ? 0.65 : 0.35} 0 0)`
      }`,
      borderRadius: "0",
      paddingLeft: "0",
      paddingRight: "0",
      fontSize: "var(--mantine-font-size-sm)",
      transition: "border-color 0.5s ease",
      "&:focus": {
        boxShadow: "none",
        outline: "none",
      },
      "&::placeholder": {
        color: floating
          ? `oklch(${uiStore.themeIsDark ? 0.65 : 0.35} 0 0)`
          : "transparent",
        transition: "color 0.5s ease",
      },
    },
  };

  return (
    <div style={{ position: "relative", width: "385px", margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        <TextInput
          key={inputName + uiStore.themeIsDark + focused + isValid}
          height={32}
          placeholder={floating && "0x000...000"}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          spellCheck="false"
          styles={inputStyles}
          data-floating={floating}
          rightSection={
            value.length > 0 && (
              <animated.div style={validationIconSpring}>
                {isValid === true && (
                  <animated.div
                    style={{
                      color: `oklch(${uiStore.themeIsDark ? 0.9 : 0.5} 0.166 147)`,
                      fontSize: "16px",
                    }}
                  >
                    ✓
                  </animated.div>
                )}
                {isValid === false && (
                  <animated.div
                    style={{
                      ...errorShakeSpring,
                      cursor: "pointer",
                      fontSize: "16px",
                      color: uiStore.getRed,
                    }}
                    onClick={() => setValue("0x")}
                  >
                    ✗
                  </animated.div>
                )}
              </animated.div>
            )
          }
        />

        <animated.div
          style={{
            ...labelSpring,
            position: "absolute",
            top: "14px",
            left: "0",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <span style={{ fontWeight: floating ? "500" : "400" }}>
            {inputName}
          </span>
          <animated.span
            style={{
              marginLeft: "2px",
              color: uiStore.theme.accentColor,
              opacity: floating ? 1 : 0,
            }}
          >
            *
          </animated.span>
        </animated.div>

        {/* Анимированная линия под инпутом */}
        <animated.div
          style={{
            ...underlineSpring,
            position: "absolute",
            bottom: "0",
            left: "0",
            height: "2px",
            width: "100%",
            transformOrigin: "left",
          }}
        />
      </div>
      {/* Сообщение о валидации */}
      <animated.div
        style={{
          ...validationMessageSpring,
          fontSize: "var(--mantine-font-size-xs)",
          marginTop: "4px",
        }}
      >
        {isValid === false && (
          <span style={{ color: uiStore.getRed }}>
            Пример: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
          </span>
        )}
        {isValid === true && (
          <span
            style={{
              color: `oklch(${uiStore.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`,
            }}
          >
            Формат адреса корректен
          </span>
        )}
      </animated.div>
    </div>
  );
};

export default WalletAddressInput;
