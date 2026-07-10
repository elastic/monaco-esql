# ES|QL syntax grammar for Monaco editor

> [!IMPORTANT]
> This repository has moved. Development now happens in the
> [`elastic/esql-js`](https://github.com/elastic/esql-js) monorepo, under
> [`packages/monaco-esql`](https://github.com/elastic/esql-js/tree/main/packages/monaco-esql).
> Please open issues and pull requests there instead of here. This repository
> is kept for historical reference only and is no longer maintained.

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
See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
