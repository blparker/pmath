const TokenType = {
    NUM: 'number',
    IDENT: 'ident',
    PLUS: 'plus',
    MINUS: 'minus',
    MULT: 'mult',
    DIV: 'div',
    LPAREN: 'lparen',
    RPAREN: 'rparen',
    COMMA: 'comma',
};


export function* tokenize(input) {
    function token(type, pos, value = null) {
        return {
            type,
            pos,
            value,
        }
    }

    function num(pos) {
        const startPos = pos;

        function readInt() {
            const val = [];
            while (pos < input.length && /\d/.test(input[pos])) {
                val.push(input[pos]);
                pos += 1;
            }

            return val.length > 0 ? val.join('') : null;
        }

        function expect(ch) {
            if (input[pos] === ch) {
                pos += 1;
                return true;
            } else {
                return false;
            }
        }

        let intDigits, fracDigits;
        if ((intDigits = readInt()) && expect('.') && (fracDigits = readInt())) {
            return intDigits + '.' + fracDigits;
        }

        pos = startPos;

        if (intDigits = readInt()) {
            return intDigits;
        }

        return null;
    }

    function ident(pos) {
        const val = [];
        const partial = input.substring(pos);

        let matched;
        if (matched = partial.match(/[a-zA-Z_][\w|_]+/)) {
            return matched[0];
        } else {
            return null;
        }
    }

    for (let pos = 0; pos < input.length; pos++) {
        const ch = input[pos];
        let t;

        if (ch === '+') yield token(TokenType.PLUS, pos);
        else if (ch === '-') yield token(TokenType.MINUS, pos);
        else if (ch === '*') yield token(TokenType.MULT, pos);
        else if (ch === '/') yield token(TokenType.DIV, pos);
        else if (ch === '(') yield token(TokenType.LPAREN, pos);
        else if (ch === ')') yield token(TokenType.RPAREN, pos);
        else if (ch === ',') yield token(TokenType.COMMA, pos);
        else if (ch === ' ') {
            while (input[pos] === ' ') pos++;
            --pos;
        }
        else if (t = num(pos)) {
            yield token(TokenType.NUM, pos, parseFloat(t));
            pos += t.length - 1;
        }
        else if (t = ident(pos)) {
            yield token(TokenType.IDENT, pos, t);
            pos += t.length - 1;
        }
        else throw new Error('Unknown token: ' + ch);
    }
}
