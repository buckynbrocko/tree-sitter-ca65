const pseudo_functions = {
    nominal: [
        ".addrsize",
        ".bank",
        ".concat",
        ".const",
        ".def", ".defined",
        ".definedmacro",
        ".hiword",
        ".ismnem", ".ismnemonic",
        ".left",
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
        ".hibyte",
        ".lobyte",
        ".bankbyte",
        ".ident",
    ],
}

pseudo_functions.all = [
    ...pseudo_functions.nominal,
    ...pseudo_functions.exceptional,
];

module.exports = pseudo_functions;
