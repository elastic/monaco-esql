import { languages } from 'monaco-editor';

const commands = [
  "DISSECT",
  "DROP",
  "ENRICH",
  "EVAL",
  "EXPLAIN",
  "FROM",
  "FULL JOIN",
  "GROK",
  "INFO",
  "INLINESTATS",
  "JOIN",
  "KEEP",
  "LEFT JOIN",
  "LEFT",
  "LIMIT",
  "LOOKUP JOIN",
  "LOOKUP",
  "METRICS",
  "MV_EXPAND",
  "RENAME",
  "RIGHT JOIN",
  "RIGHT",
  "ROW",
  "SHOW INFO",
  "SHOW",
  "SORT",
  "STATS",
  "WHERE",
];

const options = [
  'BY',
  'ON',
  'WITH',
  'METADATA',
  'WHERE',
];

const literals = ['TRUE', 'FALSE', 'NULL'];

const functions = [
  'ABS',
  'ACOS',
  'ASIN',
  'ATAN',
  'ATAN2',
  'AVG',
  'BIT_LENGTH',
  'BUCKET',
  'BYTE_LENGTH',
  'CASE',
  'CATEGORIZE',
  'CBRT',
  'CEIL',
  'CIDR_MATCH',
  'COALESCE',
  'CONCAT',
  'COS',
  'COSH',
  'COUNT_DISTINCT',
  'COUNT',
  'DATE_DIFF',
  'DATE_EXTRACT',
  'DATE_FORMAT',
  'DATE_PARSE',
  'DATE_TRUNC',
  'E',
  'ENDS_WITH',
  'EXP',
  'FLOOR',
  'FROM_BASE64',
  'GREATEST',
  'HASH',
  'HYPOT',
  'IP_PREFIX',
  'LEAST',
  'LEFT',
  'LENGTH',
  'LOCATE',
  'LOG',
  'LOG10',
  'LTRIM',
  'MATCH',
  'MAX',
  'MEDIAN_ABSOLUTE_DEVIATION',
  'MEDIAN',
  'MIN',
  'MV_APPEND',
  'MV_AVG',
  'MV_CONCAT',
  'MV_COUNT',
  'MV_DEDUPE',
  'MV_FIRST',
  'MV_LAST',
  'MV_MAX',
  'MV_MEDIAN_ABSOLUTE_DEVIATION',
  'MV_MEDIAN',
  'MV_MIN',
  'MV_PERCENTILE',
  'MV_PSERIES_WEIGHTED_SUM',
  'MV_SLICE',
  'MV_SORT',
  'MV_SUM',
  'MV_ZIP',
  'NOW',
  'PERCENTILE',
  'PI',
  'POW',
  'QSTR',
  'REPEAT',
  'REPLACE',
  'REVERSE',
  'RIGHT',
  'ROUND',
  'RTRIM',
  'SIGNUM',
  'SIN',
  'SINH',
  'SPACE',
  'SPLIT',
  'SQRT',
  'ST_CENTROID_AGG',
  'ST_CONTAINS',
  'ST_DISJOINT',
  'ST_DISTANCE',
  'ST_ENVELOPE',
  'ST_EXTENT_AGG',
  'ST_INTERSECTS',
  'ST_WITHIN',
  'ST_X',
  'ST_XMAX',
  'ST_XMIN',
  'ST_Y',
  'ST_YMAX',
  'ST_YMIN',
  'STARTS_WITH',
  'STD_DEV',
  'SUBSTRING',
  'SUM',
  'TAN',
  'TANH',
  'TAU',
  'TO_BASE64',
  'TO_BOOLEAN',
  'TO_CARTESIANPOINT',
  'TO_CARTESIANSHAPE',
  'TO_DATE_NANOS',
  'TO_DATEPERIOD',
  'TO_DATETIME',
  'TO_DEGREES',
  'TO_DOUBLE',
  'TO_GEOPOINT',
  'TO_GEOSHAPE',
  'TO_INTEGER',
  'TO_IP',
  'TO_LONG',
  'TO_LOWER',
  'TO_RADIANS',
  'TO_STRING',
  'TO_TIMEDURATION',
  'TO_UNSIGNED_LONG',
  'TO_UPPER',
  'TO_VERSION',
  'TOP',
  'TRIM',
  'VALUES',
  'WEIGHTED_AVG',
];

const delimiters = [
  '/', '.', ',', '=~',
  '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
  '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
  '|', '^', '!', '~', '&&', '||', '?', ':', '=', '+=', '-=',
  '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
  '^=', '@',
];

const binaryNamedOperators = ['AND', 'OR', 'IS', 'IN', 'AS', 'LIKE', 'RLIKE'];
const otherNamedOperators = ['ASC', 'DESC', 'FIRST', 'LAST', 'NULLS', 'NOT'];

export const monarchLanguage: languages.IMonarchLanguage = {
  // Uncomment when developing.
  // defaultToken: "invalid",

  // ES|QL is case-insensitive.
  ignoreCase: true,

  // Lists of known language keywords and built-ins.
  commands,
  options,
  literals,
  functions,
  delimiters,
  namedOperators: [
    ...binaryNamedOperators,
    ...otherNamedOperators,
  ],

  // Pre-defined regular expressions.
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	digits: /\d+(_+\d+)*/,

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
      [/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@commands': { token: 'keyword.command.$0' },
					'@options': { token: 'keyword.option.$0' },
					'@literals': { token: 'keyword.literal.$0' },
					'@functions': { token: 'identifier.function.$0' },
					'@delimiters': { token: 'delimiter' },
					'@namedOperators': { token: 'keyword.operator.$0' },
          '@default' : 'identifier',
				}
			}],

      { include: "@expression" },
      { include: "@processingCommand" },

      [/\[|\(|\)|\]/, '@brackets'],
    ],

    // --------------------------------- Hidden channel: whitespace and comments

    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@doc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    doc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"],
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
    ],

    beforeMnemonicWhitespace: [
      { include: "@whitespace" },
      ["", { token: "", switchTo: "@commandName" }],
    ],

    // Matches *command name*, i.e. the mnemonic.
    commandName: [
      // First tries to match all known command names.
      [
        commands.join("|"),
        { token: "keyword.command.name", switchTo: "@root" },
      ],

      // If command name is not well known, just matches the first word.
      [/\w+\b/, { token: "keyword.command.name", switchTo: "@root" }],
    ],

    // ------------------------------------------------------------- Expressions

    expression: [
      { include: "@whitespace" },
      { include: '@literal' },

      // Inline casts: 1.3::INTEGER
      [/::\w+\b/, 'type'],

			// strings
      [/"""/, 'string.triple', '@string_triple'],
			[/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
			[/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
			[/"/, 'string', '@string'],

      // Escaped column parts: nested.`escaped`.column
			[/`/, 'string', '@column_escape_part'],

      // Source index pattern date-math expression: <logs-{now/d}>
			[/</, 'string', '@datemath_source'],
    ],

    literal: [
			{ include: '@number' },

      // Params
      [/\?{1,9}(([a-zA-Z_][a-zA-Z_0-9]+)|[0-9]+)?/, {
        cases: {
          '\\?{1,9}': 'variable.name.unnamed',
          '\\?{1,9}([a-zA-Z_][a-zA-Z_0-9]+)?': 'variable.name.named',
          '\\?{1,9}([0-9]+)?': 'variable.name.positional',
        },
      }]
    ],

    number: [
			[/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
			[/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
			[/(@digits)/, 'number'],
    ],

    // Single double-quote strings: "str"
		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop']
		],

    // Triple double-quoted strings: """str"""
		string_triple: [
			[/"""/, 'string.triple', '@pop'],
      [/[^"]+/, 'string.triple'],
		],

    // Backtick quoted "strings". ES|QL does not have back-tick "strings"
    // *per se*, but column parts can have backtick-escaped parts.
		column_escape_part: [
			[/[^`]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/`/, 'string', '@pop']
		],

		datemath_source: [
			[/[^>]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/>/, 'string', '@pop']
		],
  },
};
