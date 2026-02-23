import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { requireLicenseHeader } from "./local-rules.mjs";

const licenseHeader = `/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */`;

export default [
  {ignores: ["*", "!src/"]},
  {files: ["src/**/*.{ts,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // TODO: Temporary workaround for ESLint 10 + eslint-plugin-react detect crash.
  // Keep React rules scoped to TSX and use explicit React major until detect is fixed upstream.
  {
    files: ["src/**/*.tsx"],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "19.0",
      },
    },
  },
  {
    plugins: {
      "local-rules": {
        rules: {
          "require-license-header": requireLicenseHeader,
        },
      },
    },
    rules: {
      "local-rules/require-license-header": ["error", { license: licenseHeader }],
    },
  },
];
