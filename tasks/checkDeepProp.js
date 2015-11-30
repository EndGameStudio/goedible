var debug = require('debug')('deepProp');
var checkDeepProperty = function (haystack, needle) {
    debug(needle);
    var resp = [];
    if (haystack[needle]) {
        resp.push(haystack);
    } else {
        for (var i in haystack) {
            if (haystack.hasOwnProperty(i)) {
                if (haystack[i].needle) {
                    resp.push(haystack[i]);
                }
                if (haystack[i].length && typeof haystack[i] !== 'string') {
                    for (var j = 0; j < haystack[i].length; j++) {
                        var check = checkDeepProperty(haystack[i][j], needle);
                        if (check.length && check.length > 0) {
                            resp = resp.concat(check);
                        }
                    }
                }
            }
        }
    }
    debug(resp);
    return resp;
};
module.exports = checkDeepProperty;
