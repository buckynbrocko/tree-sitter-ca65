const pseudo_functions = {
    nominal: [
        ".addrsize",
        ".bank",
        ".bankbyte",
        ".concat",
        ".const",
        ".def", ".defined",
        ".definedmacro",
        ".hibyte",
        ".hiword",
        ".ismnem", ".ismnemonic",
        ".left",
        ".lobyte",
        ".loword",
        ".match",
        ".max",
        ".mid",
        ".min",
        ".ref", ".referenced",
        ".right",
        ".sizeof",
        ".sprintf",
        ".strat",
        ".string",
        ".strlen",
        ".tcount",
        ".xmatch",
    ],
    exceptional: [
        ".blank",
        ".ident",
    ],
}

pseudo_functions.all = [
    ...pseudo_functions.nominal,
    ...pseudo_functions.exceptional,
];

module.exports = pseudo_functions;
