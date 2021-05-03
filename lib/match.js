const { SEPARATOR, flatten } = require("../utils/flatten");
const { recursive_multi_replace } = require("../utils/string");

const EXPRESSIONS_REGISTRY = [];

function _m() {
  const expr_definition = "<<expr@" + EXPRESSIONS_REGISTRY.length + ">>";
  EXPRESSIONS_REGISTRY.push(expr_definition);
  return expr_definition;
}

function is_matching_expr(value) {
  return "string" === typeof value && value.indexOf("<<expr@") > -1;
}

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

function match_entry_values(val, match_val) {
  const is_match_flag = is_matching_expr(match_val);
  const are_values_matching = is_match_flag || val === match_val;
  if (is_match_flag) {
    return [are_values_matching, val];
  }
  return [are_values_matching];
}

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

  return match_flat_val_entries(tail, match_tail, acc1, key_matches);
}

function is_every_entry_matching(match_entries) {
  return match_entries.every(entry => {
    const [key_match_entries, val_match_entries] = entry;
    const [is_key_matching] = key_match_entries;
    const [is_val_matching] = val_match_entries;
    return is_key_matching && is_val_matching;
  });
}

function get_all_entry_matches(match_entries) {
  return match_entries.reduce((partial, acc) => {
    const [key_match_entries, val_match_entries] = acc;
    const [...key_matches] = key_match_entries.slice(1);
    const [...val_matches] = val_match_entries.slice(1);
    return [
      ...partial,
      ...key_matches,
      ...val_matches
    ]
  }, []);
}

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
