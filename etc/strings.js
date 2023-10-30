const commands = {
    nominal: [
        ".a16",
        ".a8",
        ".addr",
        ".align",
        ".asciiz",
        ".bankbytes",
        ".bss",
        ".charmap",
        ".code",
        ".constructor",
        ".data",
        ".dbyt",
        ".define",
        ".delmac", ".delmacro",
        ".destructor",
        ".dword",
        ".end",
        ".error",
        ".exitmac", ".exitmacro",
        ".export",
        ".exportzp",
        ".faraddr",
        ".fatal",
        ".forceimport",
        ".global",
        ".globalzp",
        ".hibytes",
        ".i16",
        ".i8",
        ".import",
        ".importzp",
        ".incbin",
        ".include",
        ".interruptor",
        ".listbytes",
        ".literal",
        ".lobytes",
        ".local",
        ".localchar",
        ".macpack",
        ".org",
        ".out",
        ".p02",
        ".p4510",
        ".p816",
        ".pagelen", ".pagelength",
        ".pc02",
        ".pdtv",
        ".popcharmap",
        ".popcpu",
        ".popseg",
        ".psc02",
        ".pushcharmap",
        ".pushcpu",
        ".pushseg",
        ".referto", ".refto",
        ".reloc",
        ".res",
        ".rodata",
        ".segment",
        ".setcpu",
        ".tag",
        ".undef", ".undefine",
        ".warning",
        ".word",
        ".zeropage",
    ],
    togglableFeatures: [
        ".autoimport",
        ".case",
        ".debuginfo",
        ".linecont",
        ".list",
        ".smart",
    ],
    exceptional: [
        ".assert",
        ".condes",
        ".enum", ".endenum",
        ".feature",
        ".fileopt", ".fopt",
        ".else",
        ".elseif",
        ".endif",
        ".mac", ".macro", ".endmac", ".endmacro",
        ".proc", ".endproc",
        ".repeat", ".endrep", ".endrepeat",
        ".scope", ".endscope",
        ".set",
        ".struct", ".endstruct",
        ".union", ".endunion",
    ],
    ifKeywords: [
        ".if",
        ".ifblank",
        ".ifconst",
        ".ifdef",
        ".ifnblank",
        ".ifndef",
        ".ifnref",
        ".ifref",
        ".ifp02",
        ".ifp4510",
        ".ifp816",
        ".ifpc02",
        ".ifpdtv",
        ".ifsc02",
    ],
    storageAllocators: [
        ".byt", ".byte",
        ".res",
        ".dbyte",
        ".word",
        ".addr",
        ".faraddr",
        ".dword",
    ],
    compatibilityFeatures: [
        "at_in_identifiers",
        "bracket_as_indirect",
        "c_comments",
        "dollar_in_identifiers",
        "dollar_is_pc",
        "force_range",
        "labels_without_colons",
        "leading_dot_in_identifiers",
        "long_jsr_jmp_rts",
        "loose_char_term", // not-actually supported
        "loose_string_term", // not-actually supported
        "missing_char_term", // not-actually supported
        "org_per_seg",
        "pc_assignment",
        "string_escapes",
        "ubiquitous_idents", // not-actually supported
        "underline_in_numbers",
    ]
};

const mnemonics = {
    common: [
        "adc",
        "and",
        "asl",
        "bbr0",
        "bbr1",
        "bbr2",
        "bbr3",
        "bbr4",
        "bbr5",
        "bbr6",
        "bbr7",
        "bbs0",
        "bbs1",
        "bbs2",
        "bbs3",
        "bbs4",
        "bbs5",
        "bbs6",
        "bbs7",
        "bcc",
        "bcs",
        "beq",
        "bit",
        "bmi",
        "bne",
        "bpl",
        "brk",
        "bvc",
        "bvs",
        "clc",
        "cld",
        "cli",
        "clv",
        "cmp",
        "cpx",
        "cpy",
        "dec",
        "dex",
        "dey",
        "eor",
        "inc",
        "inx",
        "iny",
        "jmp",
        "jsr",
        "lda",
        "ldx",
        "ldy",
        "lsr",
        "nop",
        "ora",
        "pha",
        "php",
        "pla",
        "plp",
        "rmb0",
        "rmb1",
        "rmb2",
        "rmb3",
        "rmb4",
        "rmb5",
        "rmb6",
        "rmb7",
        "rol",
        "ror",
        "rti",
        "rts",
        "sbc",
        "sec",
        "sed",
        "sei",
        "smb0",
        "smb1",
        "smb2",
        "smb3",
        "smb4",
        "smb5",
        "smb6",
        "smb7",
        "sta",
        "stx",
        "sty",
        "tax",
        "tay",
        "tsx",
        "txa",
        "txs",
        "tya",
    ],
    _65816Mode: [
        "cpa",
        "dea",
        "ina",
        "swa",
        "tad",
        "tas",
        "tda",
        "tsa",
        "mvn",
        "mvp",
    ],
    _6502XMode: [
        "alr",
        "anc",
        "arr",
        "axs",
        "dcp",
        "isc",
        "las",
        "lax",
        "rla",
        "rra",
        "sax",
        "slo",
        "sre",
    ],
    _4510Mode: [
        "lbcc",
        "lbcs",
        "lbeq",
        "lbit",
        "lbmi",
        "lbne",
        "lbpl",
        "lbrk",
        "lbvc",
        "lbvs",
    ],
};

mnemonics.all = [
    ...mnemonics.common,
    ...mnemonics._4510Mode,
    ...mnemonics._6502XMode,
    ...mnemonics._65816Mode,
]

commands.exceptional = [
    ...commands.exceptional,
    ...commands.ifKeywords,
    ...commands.storageAllocators,
];

commands.nominal = [
    ...commands.nominal,
    ...commands.storageAllocators,
];

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

const pseudo_variables = [
    ".asize",
    ".cpu",
    ".isize",
    ".paramcount",
    ".time",
    ".version"
];

const reserved = [ // these were surprisingly hard to find
    "a",
    "f",
    "s",
    "x",
    "y",
    "z",
    "sp",
];

module.exports = {
    commands: commands,
    mnemonics: mnemonics,
    operators: operators,
    pseudo_functions: pseudo_functions,
    pseudo_variables: pseudo_variables,
    reserved: reserved,
};