/**
 * Performs multi replace on a given string.
 *
 * @param haystack String where to search for things to replace.
 * @param needles An array of strings to search for.
 * @param needle_index Index of current needle used in search.
 * @param replacers An array of strings to replace with.
 * @param replacer_index Index of current replacer.
 * @param acc Accumulator where the replaced string will be available.
 * @returns {*}
 */
function recursive_multi_replace(haystack, needles, needle_index, replacers, replacer_index, acc) {
  const index = haystack.indexOf(needles[needle_index]);

  if (-1 === index) {
    return acc + haystack
  }

  const replacer_index1 = Math.max(replacer_index, 0) + 1;
  const needle_index1 = Math.max(needle_index, 0) + 1;
  const acc1 = acc + haystack.substring(0, index) + replacers[replacer_index];

  return recursive_multi_replace(haystack.substring(index + needles[needle_index].length), needles, needle_index1, replacers, replacer_index1, acc1);
}

exports.recursive_multi_replace = recursive_multi_replace;
