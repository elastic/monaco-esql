import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Editor from "@monaco-editor/react";
import example from "../../example.esql?raw";
import { monarchLanguage } from "..";

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
					monaco.languages.setMonarchTokensProvider("esql", monarchLanguage);
				}}
			/>
		</div>
	),
};
