import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import perfPlugin from "eslint-plugin-react-perf";

// Импортируем jsx-a11y используя ESM синтаксис
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // Базовые настройки игнорирования
  {
    ignores: ["dist", "build", "node_modules", "*.config.js", "vite.config.js"]
  },

  // Основные правила для JavaScript и React файлов
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
          experimentalObjectRestSpread: true
        },
        sourceType: "module",
      },
    },

    // Настройки для плагинов
    settings: {
      react: {
        version: "18.3",
        runtime: "automatic"
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"]
        }
      }
    },

    // Подключаем все необходимые плагины
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "import": importPlugin,
      "react-perf": perfPlugin,
    },

    // Правила
    rules: {
      // Включаем все рекомендованные правила из плагинов
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...jsxA11y.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Правила для оптимизации производительности
      "react-perf/jsx-no-new-object-as-prop": "error",
      "react-perf/jsx-no-new-array-as-prop": "error",
      "react-perf/jsx-no-new-function-as-prop": "error",

      // Правила для импортов
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }],

      // Правила для хуков
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Отключаем некоторые правила, которые могут мешать разработке
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off", // Если вы не используете PropTypes

      // Правила для React Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],

      // Дополнительные правила для улучшения производительности
      "react/jsx-no-bind": ["warn", {
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false
      }],
      "react/jsx-no-constructed-context-values": "error",
    }
  }
];