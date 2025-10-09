import type { languages } from "monaco-editor";

export type CreateDependencies = Partial<typeof import("./definitions")>;

export const create = (
	deps: CreateDependencies = {},
): languages.IMonarchLanguage => {
	const {
		headerCommands = [],
		sourceCommands = [],
		processingCommands = [],
		options = [],
		literals = [],
		functions = [],
		delimiters = [],
		temporalUnits = [],
	} = deps;

	const timeUnits = withLowercaseVariants(temporalUnits.flat()).sort((a, b) =>
		a > b ? -1 : 1,
	);

	return {
		// Uncomment when developing.
		// defaultToken: "invalid",

		// ES|QL is case-insensitive.
		ignoreCase: false,

		// Lists of known language keywords and built-ins.
		headerCommands: withLowercaseVariants(headerCommands),
		sourceCommands: withLowercaseVariants(sourceCommands),
		processingCommands: withLowercaseVariants(processingCommands),
		processingCommandsOnlyUppercase: processingCommands,
		options: withLowercaseVariants(options),
		literals: withLowercaseVariants(literals),
		functions: withLowercaseVariants(functions),
		delimiters,
		namedOperators: withLowercaseVariants([
			...(deps.operators?.named?.binary ?? []),
			...(deps.operators?.named?.other ?? []),
		]),

		// Pre-defined regular expressions.
		escapes:
			/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
		digits: /\d+(_+\d+)*/,
		symbols: /[=><!~:&|+\-*/^%.,]+/,
		columnIdentifier: /[a-zA-Z0-9_*-]+/,

		brackets: [
			{ open: "[", close: "]", token: "delimiter.square" },
			{ open: "(", close: ")", token: "delimiter.parenthesis" },
			{ open: "{", close: "}", token: "delimiter.curly" },
			{ open: "<", close: ">", token: "delimiter.angle" },
		],

		tokenizer: {
			root: [
				{ include: "@whitespace" },

				// Keywords
				[
					/@?[a-zA-Z_$][\w$]*(?![.\-:a-zA-Z_0-9])/,
					{
						cases: {
							"@headerCommands": { token: "keyword.command.header.$0" },
							"@sourceCommands": { token: "keyword.command.source.$0" },
							"@processingCommandsOnlyUppercase": {
								token: "keyword.command.processing.$0",
							},
							"@options": { token: "keyword.option.$0" },
							"@literals": { token: "keyword.literal.$0" },
							"@functions": { token: "identifier.function.$0" },
							"@namedOperators": { token: "keyword.operator.$0" },
							"\\@{1}timestamp": "identifier.timestamp",
							"@default": "identifier",
						},
					},
				],

				{ include: "@expression" },
				{ include: "@processingCommand" },

				[/\[|\(|\)|\]/, "@brackets"],

				[
					/@symbols/,
					{
						cases: {
							"@delimiters": "delimiter",
							"@default": "",
						},
					},
				],
			],

			// --------------------------------- Hidden channel: whitespace and comments

			whitespace: [
				[/[ \t\r\n]+/, ""],
				[/\/\*\*(?!\/)/, "comment.doc", "@doc"],
				[/\/\*/, "comment", "@comment"],
				[/\/\/.*$/, "comment"],
			],

			comment: [
				[/[^/*]+/, "comment"],
				[/\*\//, "comment", "@pop"],
				[/[/*]/, "comment"],
			],

			doc: [
				[/[^/*]+/, "comment.doc"],
				[/\*\//, "comment.doc", "@pop"],
				[/[/*]/, "comment.doc"],
			],

			// ---------------------------------------------------------------- Commands

			// This code block allows to color commands when they are followed by a pipe
			// character "|", this way all new processing commands are color even if
			// they are not part of the command name list.
			processingCommand: [
				[
					/\|/,
					{ token: "delimiter.pipe", switchTo: "@beforeMnemonicWhitespace" },
				],
				[
					/\(/,
					{
						token: "delimiter.parenthesis",
						switchTo: "@firstCommandNameInSubQuery",
					},
				],
			],

			beforeMnemonicWhitespace: [
				{ include: "@whitespace" },
				["", { token: "", switchTo: "@commandName" }],
			],

			exactCommandName: [
				[
					withLowercaseVariants(headerCommands).join("|"),
					{ token: "keyword.command.header.$0", switchTo: "@root" },
				],
				[
					withLowercaseVariants(sourceCommands).join("|"),
					{ token: "keyword.command.source.$0", switchTo: "@root" },
				],
				[
					withLowercaseVariants(processingCommands).join("|"),
					{ token: "keyword.command.processing.$0", switchTo: "@root" },
				],
			],

			firstCommandNameInSubQuery: [
				{ include: "@whitespace" },

				// Try to match an exact command name
				{ include: "@exactCommandName" },

				// If not matched, go to root
				{ include: "@root" },
			],

			// Matches *command name*, i.e. the mnemonic.
			commandName: [
				// First tries to match all known command names.
				{ include: "@exactCommandName" },

				// If command name is not well known, just matches the first word.
				[
					/\w+\b/,
					{ token: "keyword.command.processing.$0", switchTo: "@root" },
				],
			],

			// ------------------------------------------------------------- Expressions

			expression: [
				{ include: "@whitespace" },
				{ include: "@literal" },

				// Basic ES|QL columns (fields), e.g.: "field", "nested.field", etc.
				[/(@columnIdentifier)(\.(@columnIdentifier))*/, "identifier.column"],

				// Inline casts: 1.3::INTEGER
				[/::\w+\b/, "type"],

				// strings
				[/"""/, "string.triple", "@string_triple"],
				[/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
				[/'([^'\\]|\\.)*$/, "string.invalid"], // non-terminated string
				[/"/, "string", "@string"],

				// Escaped column parts: nested.`escaped`.column
				[/`/, "string", "@column_escape_part"],
			],

			literal: [
				{ include: "@timeInterval" },
				{ include: "@number" },

				// Params
				[
					/\?{1,9}(([a-zA-Z_][a-zA-Z_0-9]+)|[0-9]+)?/,
					{
						cases: {
							"\\?{1,9}": "variable.name.unnamed",
							"\\?{1,9}([a-zA-Z_][a-zA-Z_0-9]+)?": "variable.name.named",
							"\\?{1,9}([0-9]+)?": "variable.name.positional",
						},
					},
				],
			],

			timeInterval: [[`(@digits)\\s*(${timeUnits.join("|")})`, "number.time"]],

			number: [
				[/(@digits)[eE]([-+]?(@digits))?/, "number.float"],
				[/(@digits)?\.(@digits)([eE][-+]?(@digits))?/, "number.float"],
				[/(@digits)/, "number"],
			],

			// Single double-quote strings: "str"
			string: [
				[/[^\\"]+/, "string"],
				[/@escapes/, "string.escape"],
				[/\\./, "string.escape.invalid"],
				[/"/, "string", "@pop"],
			],

			// Triple double-quoted strings: """str"""
			string_triple: [
				[/"""/, "string.triple", "@pop"],
				[/[^"]+/, "string.triple"],
			],

			// Backtick quoted "strings". ES|QL does not have back-tick "strings"
			// *per se*, but column parts can have backtick-escaped parts.
			column_escape_part: [
				[/[^`]+/, "string"],
				[/@escapes/, "string.escape"],
				[/\\./, "string.escape.invalid"],
				[/`/, "string", "@pop"],
			],
		},
	};
};

/**
 * Given a list of strings, returns a new list with both the original and their lowercase versions (no duplicates).
 */
function withLowercaseVariants(list: string[]): string[] {
	const set = new Set<string>(list);
	for (const item of list) {
		set.add(item.toLowerCase());
	}
	return Array.from(set);
}
