import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // Configuration de base fournie par Next.js
  ...compat.extends("next/core-web-vitals"),

  // --- CONFIGURATION PERSONNALISÉE POUR TYPESCRIPT ---
  {
    // Cible les fichiers TypeScript et TSX
    files: ["**/*.ts", "**/*.tsx"],

    // Langage et parser
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        project: "./tsconfig.json", // Important pour certaines règles avancées
      },
    },

    // Plugins
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },

    // C'EST ICI QUE VOUS AJOUTEZ VOS RÈGLES
    rules: {
      // Hériter des règles recommandées par le plugin TypeScript
      ...typescriptPlugin.configs["eslint-recommended"].rules,
      ...typescriptPlugin.configs["recommended"].rules,

      // --- CORRECTION POUR LES VARIABLES INUTILISÉES ---
      // Désactive la règle de base ESLint et active celle de TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", // Mettre "warn" pendant le développement, "error" pour la CI/build
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],

      // --- CORRECTION POUR 'any' ---
      "@typescript-eslint/no-explicit-any": "warn", // Mettre en avertissement plutôt qu'en erreur
    },
  },
];

export default eslintConfig;