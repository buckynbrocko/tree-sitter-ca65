const operators = {
    unary: [
        "+",
        "-",
        "~", ".bitnot",
        "<", ".lobyte",
        ">", ".hibyte",
        "^", ".bankbyte",
    ],
    binary: [
        "*",
        "/",
        ".mod",
        "&", ".bitand",
        "^", ".bitxor",
        "<<", ".shl",
        ">>", ".shr",
        "+",
        "-",
        "|", ".bitor",
        "=",
        "<>",
        "<",
        ">",
        "<=",
        ">=",
        "&&", ".and",
        ".xor",
        "||", ".or",
        "!", ".not"
    ]
};

const reserved = [ // these were surprisingly hard to find
    "a",
    "f",
    "s",
    "x",
    "y",
    "z",
    "sp",
]

module.exports.operators = operators;
module.exports.reserved = reserved;
