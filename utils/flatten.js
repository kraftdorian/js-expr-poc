const { is_primitive, is_array, is_object } = require("./types");

/**
 * A separator that will be used to mark object nested keys.
 * @type {string}
 */
const SEPARATOR = ".";

/**
 * Returns flattened value if available.
 * Passing the primitive value will result in the same value wrapped under "primitive_{number}" key.
 *
 * @param value Value to be flattened.
 * @param key The initial key to be used.
 * @param acc Accumulator where flattened key-value pairs will be stored.
 * @returns {*}
 */
function flatten(value, key, acc) {
  if (is_primitive(value)) {
    if (0 === key.length) {
      acc["primitive_" + Object.keys(acc).length] = value;
    } else {
      acc[key] = value;
    }
  } else if (is_array(value)) {
    value.forEach((child_val, child_index) => {
      flatten(child_val, key + "[" + child_index + "]", acc);
    });
  } else if (is_object(value)) {
    const key1 = key.length > 0 ? key + SEPARATOR : key;
    for (const child_key in value) {
      if (!value.hasOwnProperty(child_key)) continue;
      flatten(value[child_key], key1 + child_key, acc);
    }
  }
  return acc;
}

exports.SEPARATOR = SEPARATOR;
exports.flatten = flatten;
