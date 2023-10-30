function delimited(rule, delimiter) {
    return seq(rule, repeat(seq(delimiter, rule)));
}


function _decase_character(character) {
    var ca = character.charCodeAt(0);
    if (ca >= 97 && ca <= 122) return `[${character}${character.toUpperCase()}]`;
    if (ca >= 65 && ca <= 90) return `[${character.toLowerCase()}${character}]`;
    return character.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function _decase_string(string_) {
    if (typeof string_ !== "string") {
        console.error(string_);
        throw new TypeError("type is " + typeof string_);
    }
    return new RegExp(string_.split("").map(_decase_character).join(""));
}


function caseless(...rules) {
    switch (rules.length) {
        case 0: throw new Error("Need a rule for an argument");
        case 1:
            let rule = rules[0];
            if (typeof rule === "string") {
                return _decase_string(rule);
            } else if (Array.isArray(rule)) {
                return choice(...rule.map(_decase_string));
            }
            throw new Error("Casefolding failed");
        default:
            return caseless(rules);
    }
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
module.exports.toCaseInsensitive = _decase_character;
module.exports.caseless = caseless;
module.exports.rep = rep;
module.exports.rep1 = rep1;
module.exports.opt = opt;
module.exports.immediate = immediate;
module.exports.pick = pick;
module.exports.caseless_alias = caseless_alias;
module.exports.optional_field = optional_field;
