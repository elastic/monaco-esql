# ES|QL syntax grammar for Monaco editor

This package contains the ES|QL grammar form Monarch (the Monaco editor grammar engine).


## Usage

To highlight ES|QL code in Monaco editor, you need to register ES|QL language
and its Monarch grammar:

```js
import { monarchLanguage } from '@elastic/monaco-esql';

monaco.languages.register({id: 'esql'});
monaco.languages.setMonarchTokensProvider('esql', monarchLanguage);
```


## Releasing

Publish with `release-it` tool:

```
npx release-it
```


## License

MIT
