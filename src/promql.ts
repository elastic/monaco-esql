/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the MIT license (the "License"); you may
 * not use this file except in compliance with the License.
 */
import type { languages } from "monaco-editor";

export const promQLBlock: languages.IMonarchLanguageRule[] = [	
    // Rules to delegate comments to ES|QL	
	[
		/\/\*\*(?!\/)/,
		{
			token: "comment.doc",
			next: "@promqlDocComment",
			nextEmbedded: "@pop",
		},
	],
	[
		/\/\*/,
		{ token: "comment", next: "@promqlComment", nextEmbedded: "@pop" },
	],
	[
		/\/\//,
		{
			token: "comment",
			next: "@promqlLineComment",
			nextEmbedded: "@pop",
		},
	],
	// Exit condition
	[	
		/\|/,
		{
			token: "delimiter.pipe",
			switchTo: "@beforeMnemonicWhitespace",
			nextEmbedded: "@pop",
		},
	],
];

/**
 * Override rules for PromQL embedding.
 * For handling comments, we assign the ES|QL comment tokens and returns to the PromQL embedding after the comment ends. 
 */
export const promQLOverrideRules: { [name: string]: languages.IMonarchLanguageRule[] } = {
    promqlDocComment: [
		[/[^/*]+/, "comment.doc"],
		[
		    /\*\//,
			{ token: "comment.doc", next: "@pop", nextEmbedded: "promql" },
		],
		[/[/*]/, "comment.doc"],
	],

	promqlComment: [
		[/[^/*]+/, "comment"],
		[/\*\//, { token: "comment", next: "@pop", nextEmbedded: "promql" }],
		[/[/*]/, "comment"],
	],

	promqlLineComment: [
		[
			/.*$/,
			{ token: "comment", next: "@pop", nextEmbedded: "promql" },
		],
	],
}