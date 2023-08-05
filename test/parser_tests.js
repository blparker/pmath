import { pmath } from '../index.js';


function assertEquals(expected, actual, message) {
    if (expected !== actual) {
        console.error('\x1b[31m%s\x1b[0m', `Expected ${expected}, got ${actual}`);
    } else {
        console.log('\x1b[32m%s\x1b[0m', 'Pass');
    }
}


function assertError(input, scope = {}) {
    try {
        run(input, scope);
        console.error('\x1b[31m%s\x1b[0m', `Expected error to be thrown`);
    } catch (e) {
        console.log('\x1b[32m%s\x1b[0m', 'Pass');
    }
}


function run(input, scope = {}) {
    return pmath`${input}`(scope);
}


assertEquals(2, run('2'));
assertEquals(3, run('1 + 2'));
assertEquals(6, run('1 + 2 + 3'));
assertEquals(7, run('2 * 2 + 3'));
assertEquals(0.5, run('2 / 2 / 2'));
assertEquals(0.5, run('1 / 2'));
assertEquals(0.3, run('0.1 + 0.2'));
assertEquals(2, run('foo', {foo: 2}));
assertEquals(Math.PI, run('PI'));
assertEquals(3, run('sqrt(9)'));
assertEquals(3, run('foo + bar', {foo: 1, bar: 2}));
assertEquals(3, run('foo + bar()', {foo: 1, bar: () => 2}));
assertEquals(3, run('bar(1, 2)', {bar: (a, b) => a + b}));
assertEquals(0.32, run('0.1 + 0.22'));
assertEquals(0.12, run('0.1 + 0.02'));
assertEquals(-13, run('oX - (xLeft + xTickGap * numTicksLeftOrigin)', {
    oX: 1,
    xLeft: 2,
    xTickGap: 3,
    numTicksLeftOrigin: 4
}));

assertError('foo');
assertError('1 + ');
assertError('1 * ');
assertError('1 1');
