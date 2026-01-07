/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

// biome-ignore lint: React is used in JSX
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Editor from "@monaco-editor/react";
import example from "../../example.esql?raw";
import { language } from "../monarch-shared";

const meta: Meta = {
	title: "Editor",
};

export default meta;

export const Primary: StoryObj<typeof meta> = {
	render: () => (
		<div>
			<Editor
				height="90vh"
				defaultLanguage="esql"
				language="esql"
				defaultValue={example}
				onMount={(_, monaco) => {
					monaco.languages.register({ id: "esql" });
					monaco.languages.setMonarchTokensProvider("esql", language);
				}}
			/>
		</div>
	),
};
