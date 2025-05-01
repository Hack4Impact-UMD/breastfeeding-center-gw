# Coverup.js

[![Build Status](https://travis-ci.org/jsonmaur/coverup.svg?branch=master)](https://travis-ci.org/jsonmaur/coverup)
[![Coverage Status](https://coveralls.io/repos/github/jsonmaur/coverup/badge.svg?branch=master)](https://coveralls.io/github/jsonmaur/coverup?branch=master)

Conceals a string by converting characters to asterisks (or any other character). Works well for masking credit card numbers, API keys, or any other sensitive info you don't want to show in its entirety. Works in Node.js and browsers.

> *Note: This library doesn't keep your info secure, it simply prevents users from seeing an entire string when it is displayed. Please make sure you take the correct precautions when dealing with sensitive info in your app.*

## How to Use

```bash
npm install coverup --save
```

```javascript
var coverup = require('coverup')

coverup('4242-4242-4242-4242')
//=> *******************

coverup('4242-4242-4242-4242', { char: '%' })
//=> %%%%%%%%%%%%%%%%%%%

coverup('4242-4242-4242-4242', { keepSymbols: true })
//=> ****-****-****-****

coverup('4242-4242-4242-4242', { keepLeft: 1, keepRight: 1, compactTo: 4 })
//=> 4****2

coverup('4242-4242-4242-4242', { keepLeft: 4 })
//=> 4242***************

coverup('4242-4242-4242-4242', { keepRight: 4 })
//=> ***************4242
```

#### UMD

You can also access the UMD version by using [unpkg](https://unpkg.com). This will create `Coverup` as a global.

```html
<script src="https://unpkg.com/coverup/coverup.min.js"></script>
<script> Coverup('secret') //=> ****** </script>
```

## API

### coverup (value, options)

- **value** - The value you want to coverup. If the value specified is not a string, it will be converted to a string.

  > Type: `any`  

- **options**
  - **keepLeft** - The number of characters to avoid concealing on the left side of the string.

    > Type: `integer`  
    > Default: `0`

  - **keepRight** - The number of characters to avoid concealing on the right side of the string.

    > Type: `integer`  
    > Default: `0`

  - **compactTo** - Compact the concealing character to a defined length. This cannot be used in conjunction with `keepSymbols`, or an error will be thrown.

    > Type: `integer`  
    > Default: `0`

  - **keepSymbols** - Whether you want to ignore symbols when concealing. When set to `true`, only alphanumeric characters will be concealed. This cannot be used in conjunction with `compactTo`, or an error will be thrown.

    > Type: `boolean`  
    > Default: `false`

  - **char** - The character to use when concealing.

    > Type: `string`  
    > Default: `*`

<a name="license"></a>
## License

[MIT](LICENSE) © [Jason Maurer](http://maur.co)
