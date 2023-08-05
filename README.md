# pmath

`pmath` is a simple JavaScript tagged template literal for computing simple and precise math expressions.


## Why?

JavaScript floating point math is not precise, which is evident in the following:

```javascript
> 0.1 + 0.2
0.30000000000000004
```

We can get around this by using libraries like `decimal.js`:

```javascript
> Decimal.add(0.1, 0.2)
0.3
> new Decimal(0.1).plus(0.2)
0.3
```

These libraries are full-featured and well tested. You should probably use those.

## What is this?

While using libraries like `decimal.js` to perform precise math get the job done, it can create unreadable code. For example, take the following expression based on a couple of defined variables:

```javascript
> oX - (xLeft + xTickGap * numTicksLeftOrigin)
```

Expressing this using `decimal.js`, we get the following:

```javascript
new Decimal(oX).sub(xLeft).sub(new Decimal(xTickGap).mul(numTicksLeftOrigin))
```

Yuck. Seems like quite a bit of readability we're giving up.

## Installation

`npm install pmath-js`

## Usage

Simple usage:

```javascript
> pmath`0.1 + 0.2`();
0.3
```

The tag returns a function that must be invoked so that scope can be provided if necessary:

```javascript
> pmath`0.1 + foo`({ foo: 0.2 });
0.3
```

The above expression in the "What is this?" section can be expressed with a provided scope as:

```javascript
> pmath`oX - (xLeft + xTickGap * numTicksLeftOrigin)`({
    oX: 1,
    xLeft: 2,
    xTickGap: 3,
    numTicksLeftOrigin: 4
})
```

The keys/values in the scope can be either standard numberic values or functions.

Using built in JS Math functions.
```javascript
> 1 + sqrt(9)
4
```

When starting, the library adds all properties and functions from the Math library into the scope, and the functions can be referenced without directly referencing the Math library.

Look at the [`parser_test.js`]('https://github.com/blparker/pmath/blob/master/parser_tests.js') file for more examples.
