import { tokenize } from './src/tokenizer.js';
import { parse } from './src/parser.js';

export function pmath(strings, ...keys) {
    const input = strings[0] + keys.map((key, i) => key + strings[i + 1]).join('');

    return function (scope = {}) {
        const tokens = [...tokenize(input)];
        return parse(tokens, scope);
    }
}
