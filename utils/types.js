function is_primitive(value) {
  const is_primitive_type = ["string", "number", "bigint", "boolean", "undefined"].includes(typeof value);
  return is_primitive_type || null === value;
}

function is_array(value) {
  return Array.isArray(value);
}

function is_object(value) {
  return "object" === typeof value;
}

exports.is_primitive = is_primitive;
exports.is_array = is_array;
exports.is_object = is_object;
