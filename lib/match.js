const { SEPARATOR, flatten } = require("../utils/flatten");
const { recursive_multi_replace } = require("../utils/string");

/**
 * Expression placeholders registry created via "_m" method.
 * @type {string[]}
 */
const EXPRESSIONS_REGISTRY = [];

/**
 * Utility function that returns the generic string placeholder of an expression.
 * @returns {string}
 */
function _m() {
  const expr_definition = "<<expr@" + EXPRESSIONS_REGISTRY.length + ">>";
  EXPRESSIONS_REGISTRY.push(expr_definition);
  return expr_definition;
}

/**
 * Returns whether the given value is an expression placeholder.
 *
 * @param value Value to check.
 * @returns {boolean}
 */
function is_matching_expr(value) {
  return "string" === typeof value && value.indexOf("<<expr@") > -1;
}

/**
 * Performs match entry key check.
 *
 * @param key Known value key.
 * @param match_key Key used to match or compare to with the original key.
 * @param resolved_matches Keys that are already resolved.
 * @returns {*[]}
 */
function match_entry_keys(key, match_key, resolved_matches) {
  const key_parts = key.split(SEPARATOR);
  const match_key_parts = match_key.split(SEPARATOR);
  const match_key_expr_parts = match_key_parts.filter(part => is_matching_expr(part));
  const resolved_match_key = recursive_multi_replace(
    match_key,
    match_key_expr_parts,
    0,
    key_parts,
    match_key_parts.findIndex(single_match_key_part => is_matching_expr(single_match_key_part)),
    ""
  );
  const matches = key_parts.filter((_, single_key_part_index) => {
    return is_matching_expr(match_key_parts[single_key_part_index]) &&
      !resolved_matches.includes(key_parts[single_key_part_index])
  });
  return [
    resolved_match_key === key,
    ...matches
  ];
}

/**
 * Performs match entry value check.
 *
 * @param val Known value.
 * @param match_val A value used to match or compare to with the original value.
 * @returns {*[]}
 */
function match_entry_values(val, match_val) {
  const is_match_flag = is_matching_expr(match_val);
  const are_values_matching = is_match_flag || val === match_val;
  if (is_match_flag) {
    return [are_values_matching, val];
  }
  return [are_values_matching];
}

/**
 * Executes key and value matching algorithms on flattened values, passed as Object key-value entries.
 *
 * @param val_entries Object key-value entries of the known value.
 * @param match_val_entries Object key-value entries to match or compare to with the original ones.
 * @param acc Accumulator where the expression matching results will be available.
 * @param matched_keys_cache The cache of already resolved keys.
 * @returns {*[]}
 */
function match_flat_val_entries(val_entries, match_val_entries, acc, matched_keys_cache) {
  const [head, ...tail] = val_entries;
  const [match_head, ...match_tail] = match_val_entries;

  if (undefined === head || undefined === match_head) return acc;

  const [key, val] = head;
  const [match_key, match_val] = match_head;

  const [are_keys_matching, ...key_matches] = match_entry_keys(key, match_key, matched_keys_cache);

  const acc1 = acc.concat([
    [
      [are_keys_matching, ...key_matches],
      match_entry_values(val, match_val)
    ]
  ]);

  const matched_keys_cache1 = matched_keys_cache.concat(key_matches);

  return match_flat_val_entries(tail, match_tail, acc1, matched_keys_cache1);
}

/**
 * Returns whether all match entries are truthy.
 *
 * @param match_entries Entries to check.
 * @returns {boolean}
 */
function is_every_entry_matching(match_entries) {
  return match_entries.every(entry => {
    const [key_match_entries, val_match_entries] = entry;
    const [is_key_matching] = key_match_entries;
    const [is_val_matching] = val_match_entries;
    return is_key_matching && is_val_matching;
  });
}

/**
 * Returns all truthy match entries.
 *
 * @param match_entries Entries to check and return.
 * @returns {*[]}
 */
function get_all_entry_matches(match_entries) {
  return match_entries.reduce((partial, acc) => {
    const [key_match_entries, val_match_entries] = acc;
    const key_matches = key_match_entries.slice(1);
    const val_matches = val_match_entries.slice(1);
    return [
      ...partial,
      ...key_matches,
      ...val_matches
    ]
  }, []);
}

/**
 * Performs expression match based on the passed values.
 *
 * @param val Known value.
 * @param match_val Value to match or compare to the original one.
 * @returns {*[]}
 */
function match_val(val, match_val) {
  const flat_values = [val, match_val].map(single_val => Object.entries(
    flatten(single_val, "", {})
  ));
  const [flat_val, flat_match_val] = flat_values;
  const match_entries = match_flat_val_entries(flat_val, flat_match_val, [], []);
  const match_result = is_every_entry_matching(match_entries);

  if (true === match_result) {
    return [
      match_result,
      get_all_entry_matches(match_entries)
    ];
  }
  return [match_result, []];
}

exports._m = _m;
exports.match_val = match_val;
