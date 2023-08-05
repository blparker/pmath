import { TokenType } from './tokenizer.js';
import { pAdd, pSubtract, pDivide, pMultiply } from './math.js';

/*
    Grammar
    expr:    sum
    sum:     product (['+' | '-'] product)*
    product: atom (['*' | '/'] atom)*
    atom:    func | NUMBER | '(' expr ')'
    func:    IDENT '(' expr (',' expr)* ')' | IDENT
*/
export function parse(tokens, scope) {
    Object.getOwnPropertyNames(Math).forEach(f => scope[f] = Math[f]);

    let pos = 0;

    function expect(tokenType) {
        if (pos >= tokens.length) {
            return null;
        }

        if (tokens[pos].type === tokenType) {
            // console.log(`Found ${tokenType} at pos ${pos}`)
            return tokens[pos++];
        } else {
            return null;
        }
    }

    function expr() {
        return sum();
    }

    function sum() {
        let l, o, r;

        if (l = product()) {
            while (((o = expect(TokenType.PLUS)) || (o = expect(TokenType.MINUS))) && (r = product())) {
                if (o.type === TokenType.PLUS) {
                    l = pAdd(l, r);
                } else {
                    l = pSubtract(l, r);
                }
            }

            return l;
        } else {
            return null;
        }
    }

    function funcArgs() {
        const args = [];
        let e;

        while (e = expr()) {
            args.push(e);

            if (!expect(TokenType.COMMA)) {
                break;
            }
        }

        return args;
    }

    function func() {
        let i, e;

        if ((i = expect(TokenType.IDENT))) {
            if (expect(TokenType.LPAREN)) {
                const res = scope[i.value](...funcArgs());
                if (expect(TokenType.RPAREN)) {
                    return res;
                } else {
                    return null;
                }
            } else {
                return scope[i.value];
            }
        } else {
            return null;
        }
    }

    function peekToken() {
        return tokens[pos];
    }

    function isTokenType(tokenType) {
        return peekToken().type === tokenType;
    }

    function product() {
        let l, r, o;

        if (l = atom()) {
            while (((o = expect(TokenType.MULT)) || (o = expect(TokenType.DIV))) && (r = atom())) {
                if (o.type === TokenType.MULT) {
                    l = pMultiply(l, r);
                } else {
                    l = pDivide(l, r);
                }
            }

            return l;
        } else {
            return null;
        }
    }

    function atom() {
        let f, n, e;

        if (f = func()) {
            return f;
        } else if (n = expect(TokenType.NUM)) {
            return n.value;
        } else if (expect(TokenType.LPAREN) && (e = expr()) && expect(TokenType.RPAREN)) {
            return e;
        } else {
            return null;
        }
    }

    const e = expr();
    if (pos !== tokens.length) {
        throw new Error('Failed to parse input. Tokens remaining.');
    }

    return e;
}
