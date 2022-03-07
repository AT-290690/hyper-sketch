import { printErrors } from '../extentions/composition.js';

const HASH_TRESHOLD = 3;
const ABC =
  'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + 'abcdefghijklmnopqrstuvwxyz';

export const encodeUrl = (
  source,
  DEPENDENCY_LIST,
  callback = () => true,
  limit = 2000
) => {
  const value = source.replace(/;;.+/g, '');
  const wordTokens = value
    .replace(/[^0-9a-zA-Z]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(x => isNaN(+x));

  const words = wordTokens.filter(x => x.length > HASH_TRESHOLD);
  const out = [...new Set(words)]
    .reduce((acc, item, items) => {
      if (item in DEPENDENCY_LIST) {
        acc = acc.split(item + '(').join('!' + DEPENDENCY_LIST[item] + '(');
      }
      return acc;
    }, value.replace(/\s+/g, ''))
    .split(');)')
    .join('))')
    .split('')
    .reduce(
      (acc, item, index, items) => {
        if (item === ')') {
          acc.count++;
        } else {
          if (acc.count === 1) {
            acc.result += ')';
            acc.count = 0;
          } else if (acc.count > 1) {
            acc.result += "'" + acc.count;
            acc.count = 0;
          }
          acc.result += item;
        }

        return acc;
      },
      { result: '', count: 0 }
    );
  if (out.count > 0) {
    out.result += "'" + out.count;
  }
  const ignoreSet = new Set(value.match(/\$[a-zA-Z0-9]+/g));
  const tokenSet = new Set([...wordTokens]);
  const abc = [...ABC].filter(x => !tokenSet.has(x));
  [
    ...new Set(
      words.filter(x => !(x in DEPENDENCY_LIST) && !ignoreSet.has('$' + x))
    )
  ]
    .sort((a, b) => (a.length > b.length ? -1 : 1))
    .slice(0, ABC.length)
    .forEach(x => {
      out.result = out.result.replaceAll(x, abc.pop());
    });

  const encoded =
    location.href +
    '?s=' +
    LZUTF8.compress(out.result.trim(), {
      outputEncoding: 'Base64'
    });
  if (encoded.length > limit) {
    printErrors(
      `Sketch is too large. Expected < (sketch; ${limit}). Reduce your sketch by ${
        limit - encoded.length
      } chararacters.`
    );
  } else {
    callback(encoded);
  }
};

export const decodeUrl = (url, DEPENDENCY_LIST, callback) => {
  const content = url.trim().replace(location.href + '?s=', '');
  const value = LZUTF8.decompress(content, {
    inputEncoding: 'Base64',
    outputEncoding: 'String'
  }).trim();
  const keys = Object.keys(DEPENDENCY_LIST);
  const prefix = [...new Set(value.match(/\!?\d+\(/g))];
  const suffix = [...new Set(value.match(/\'+?\d+/g))];
  const matcher = suffix.reduce(
    (acc, m) => acc.split(m).join(')'.repeat(parseInt(m.substring(1)))),
    prefix.reduce(
      (acc, m) => acc.split(m).join(keys[parseInt(m.substring(1))] + '('),
      value
    )
  );
  callback(matcher);
};

export const updateDepsList = list => {
  console.log(
    JSON.stringify(
      [...new Set(Object.keys(list).map(x => x.replace('.', '')))]
        .filter(x => x.length > HASH_TRESHOLD)
        .sort((a, b) => (a.length > b.length ? 1 : -1))
        .reduce((acc, item, index) => {
          acc[item] = index;
          return acc;
        }, {})
    )
  );
};
