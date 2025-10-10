# ES|QL syntax grammar for Monaco editor

This package contains the ES|QL grammar form Monarch (the Monaco editor
grammar engine).

<img width="725" alt="image" src="https://github.com/user-attachments/assets/a725841e-68d6-4765-aa29-54a3062e6a3e" />

## Usage

To highlight ES|QL code in Monaco editor, you need to register ES|QL language
and its Monarch grammar:

```js
import { language as monarchLanguage } from "@elastic/monaco-esql/lib/monarch-shared";

monaco.languages.register({ id: "esql" });
monaco.languages.setMonarchTokensProvider("esql", monarchLanguage);
```

## Releasing

To release a new version add a `publish` label to the PR.
Or you can run the `Release` Github action manually from Github web.

## License

MIT
