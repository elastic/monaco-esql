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
