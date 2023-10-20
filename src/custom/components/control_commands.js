const control_commands = {
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
        ".set",
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

control_commands.exceptional = [
    ...control_commands.exceptional,
    ...control_commands.ifKeywords,
    ...control_commands.storageAllocators,
]

control_commands.nominal = [
    ...control_commands.nominal,
    ...control_commands.storageAllocators,
]

module.exports = control_commands;
