function delimited(rule, delimiter) {
    return seq(rule, repeat(seq(delimiter, rule)));
}


function _toCaseInsensitive(a) {
    var ca = a.charCodeAt(0);
    if (ca >= 97 && ca <= 122) return `[${a}${a.toUpperCase()}]`;
    if (ca >= 65 && ca <= 90) return `[${a.toLowerCase()}${a}]`;
    return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


function caseless(rule) {
    if (Array.isArray(rule)) {
        return choice(...rule.map(caseless));
    } else if (typeof rule === "string") {
        return new RegExp(rule.split("").map(_toCaseInsensitive).join(""));
    }
    throw new Error("Casefolding failed");
}

function rep(...rule) {
    switch (rule.length) {
        case 0: throw new Error("Need a rule for an argument");
        case 1:
            if (Array.isArray(rule[0])) {
                return repeat(seq(...rule[0]));
            }
            else { return repeat(rule[0]) }
        default: return repeat(seq(...rule));
    }
}

function rep1(...rule) {
    switch (rule.length) {
        case 0: throw new Error("Need a rule for an argument");
        case 1:
            if (Array.isArray(rule[0])) {
                return repeat1(seq(...rule[0]));
            }
            else { return repeat1(rule[0]) }
        default: return repeat1(seq(...rule));
    }
}

function opt(...rule) {
    switch (rule.length) {
        case 0: throw new Error("Need a rule for an argument");
        case 1:
            if (Array.isArray(rule[0])) {
                return optional(seq(...rule[0]));
            }
            else { return optional(rule[0]) }
        default: return optional(seq(...rule));
    }
}

function immediate(...rule) {
    switch (rule.length) {
        case 0: throw new Error("Need a rule for an argument");
        case 1:
            if (Array.isArray(rule[0])) {
                return token.immediate(seq(...rule));
            }
            else { return token.immediate(rule) }
        default: return token.immediate(seq(...rule));
    }
}

function pick(...rule) {
    if (rule.length < 1) {
        throw new Error("Need a rule for an argument");
    }
    return choice(...rule.map((r) => {
        if (Array.isArray(r)) {
            return seq(...r);
        }
        return r;
    }))
}

function caseless_alias(original, alias_) {
    return alias(caseless(original), alias_);
}

function optional_field(name, value) {
    return opt(field(name, value));
}

module.exports.delimited = delimited;
module.exports.toCaseInsensitive = _toCaseInsensitive;
module.exports.caseless = caseless;
module.exports.rep = rep;
module.exports.rep1 = rep1;
module.exports.opt = opt;
module.exports.immediate = immediate;
module.exports.pick = pick;
module.exports.caseless_alias = caseless_alias;
module.exports.optional_field = optional_field;
