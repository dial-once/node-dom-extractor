const url = require('url');

class Utils {
  static isValidUrl(uri) {
    if (typeof uri !== 'string') {
      return false;
    }
    const expression = '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?){1}'
    + '([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?';
    const regex = new RegExp(expression);
    if (uri.match(regex)) {
      return true;
    }
    return false;
  }

  // see http://stackoverflow.com/questions/7544550/javascript-regex-to-change-all-relative-urls-to-absolute
  static relToAbs(a, b) {
    if (a === undefined || b === undefined || b.indexOf('//') === 0) {
      return b;
    }
    return url.format(url.resolve(url.parse(a), url.parse(b)));
  }
}

module.exports = Utils;
