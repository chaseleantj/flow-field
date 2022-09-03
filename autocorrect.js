var mapObj = {
  'X': 'x', 'Y': 'y',
  '<': '', '>': '', '=': '',
  'F\\(x,y\\)': '', 'f\\(x,y\\)': '',
  'arcsin': 'asin', 'arccos': 'acos', 'arctan': 'atan',
  'sin\\^-1': 'asin', 'cos\\^-1': 'acos', 'tan\\^-1': 'atan', 'cosec': 'csc',
  'ln': 'log', 'loge': 'log', 'log_2': 'log2', 'log_e': 'log', 'log_10': 'log10',
  'sgn': 'sign', 'flr': 'floor', 'ceiling': 'ceil', 'int': 'floor',
  'rad': '',
  '\\*\\*': '^'
};

var autocorrect = function (str) {

  str = fixAbs(str);

  for (var key in mapObj) {
    var re = new RegExp(key, 'g');
    str = str.replace(re, mapObj[key]);
  }
  return str;
}

var fixAbs = function (str) {
  const startTag = '{{s%L%}}';
  const endTag = '{{e%L%}}';
  const absRegex = /\{\{s(\d+)\}\}(.*?)\{\{e\1\}\}/g;
  let level = 0;
  str = str
    .replace(/ /g, '')  // remove all spaces
    .replace(/(\|*)?([-\w+])(\|*)?/g, function (m, c1, c2, c3) {
    // .replace(/(\|*)?(\w+)(\|*)?/g, function(m, c1, c2, c3) {
      // regex matches variables with all leading and trailing `|`s
      let s = c2;
      if (c1) {
        // add a start tag to each leading `|`: `{{s0}}`, `{{s1}}`, ...
        // and post-increase level
        s = '';
        for (let i = 0; i < c1.length; i++) {
          s += startTag.replace(/%L%/, level++);
        }
        s += c2;
      }
      if (c3) {
        // decrease level,
        // and add a end tag to each trailing `|`: `{{e2}}`, `{{e1}}`, ...
        for (let i = 0; i < c3.length; i++) {
          s += endTag.replace(/%L%/, --level);
        }
      }
      return s;
    });
  // find matching start and end tag from left to right,
  // repeat for each level
  while (str.match(absRegex)) {
    str = str.replace(absRegex, function (m, c1, c2, c3) {
      return 'abs(' + c2 + ')';
    });
  }
  // clean up tags in case of unbalanced input
  str = str.replace(/\{\{[se]-?\d+\}\}/g, '|');
  return str;
}

var capitalizeE_PI = function (str) {
  str = str.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'E');
  str = str.replace(/(?<![a-zA-Z])pi(?![a-zA-Z])/g, 'PI');
  str = str.replace(/deg/g, '*PI/180');
  return str;
}

