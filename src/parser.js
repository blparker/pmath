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
            return tokens[pos++];
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

    function expr() {
        return sum();
    }

    function sum() {
        let l, o;

        if (l = product()) {
            while (true) {
                if ((o = expect(TokenType.PLUS)) || (o = expect(TokenType.MINUS))) {
                    const r = product();
                    if (! r) {
                        throw new Error('Missing right operand')
                    } else if (o.type === TokenType.PLUS) {
                        l = pAdd(l, r);
                    } else {
                        l = pSubtract(l, r);
                    }
                } else {
                    break;
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
        let i;

        if ((i = expect(TokenType.IDENT))) {
            if (expect(TokenType.LPAREN)) {
                const res = scope[i.value](...funcArgs());
                if (expect(TokenType.RPAREN)) {
                    return res;
                } else {
                    return null;
                }
            } else if (i.value in scope) {
                return scope[i.value];
            } else {
                throw new Error(`Cannot find identifier '${i.value}' in scope`);
            }
        } else {
            return null;
        }
    }

    function product() {
        let l, o;

        if (l = atom()) {
            while (true) {
                if ((o = expect(TokenType.MULT)) || (o = expect(TokenType.DIV))) {
                    const r = atom();
                    if (! r) {
                        throw new Error('Missing right operand')
                    } else if (o.type === TokenType.MULT) {
                        l = pMultiply(l, r);
                    } else {
                        l = pDivide(l, r);
                    }
                } else {
                    break;
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
