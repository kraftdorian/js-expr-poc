# JavaScript expression matching PoC
## Intro
I wanted to test if I can simulate beautiful Erlang's expression matching mechanism in JavaScript.

## How to use
1. Check if two values are equal
```js
const val1 = 1;
const val2 = 2;
const result = match_val(val1, val2);

console.log(result); // [false, []]
```

```js
const val1 = 1;
const val2 = 1;
const result = match_val(val1, val2);

console.log(result); // [true, []]
```

2. Check if values are equal and find some unknown values
```js
const response = {
  status: false,
  message: "Error",
  some_dynamic_key: null
};
const template = {
  status: _m(),
  message: _m(),
  [_m()]: _m()
};
const result = match_val(response, template);

console.log(result); // [true, [false, 'Error', 'some_dynamic_key', null]]
```

```js
// This will also work
const response = {
  status: false,
  message: "Error",
  some_dynamic_key: null
};
const template = {
  status: "<<expr@Status>>",
  message: "<<expr@Message>>",
  ["<<expr@DynamicKey>>"]: "<<expr@DynamicKeyValue>>"
};
const result = match_val(response, template);

console.log(result); // [true, [false, 'Error', 'some_dynamic_key', null]]
```

## License
See license in [LICENSE](./LICENSE) file.