/**
 * Returns whether the given value is a primitive.
 * @param value Value to check.
 * @returns {boolean}
 */
function is_primitive(value) {
  const is_primitive_type = ["string", "number", "bigint", "boolean", "undefined"].includes(typeof value);
  return is_primitive_type || null === value;
}

/**
 * Returns whether the given value is an array.
 * @param value Value to check.
 * @returns {boolean}
 */
function is_array(value) {
  return Array.isArray(value);
}

/**
 * Returns whether the given value is an object.
 * @param value Value to check.
 * @returns {boolean}
 */
function is_object(value) {
  return "object" === typeof value;
}

exports.is_primitive = is_primitive;
exports.is_array = is_array;
exports.is_object = is_object;
