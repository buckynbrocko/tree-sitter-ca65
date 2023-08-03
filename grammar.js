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


const pseudo_variables = [
    ".asize",
    ".cpu",
    ".isize",
    ".paramcount",
    ".time",
    ".version"
];


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
]

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
        "rol",
        "ror",
        "rti",
        "rts",
        "sbc",
        "sec",
        "sed",
        "sei",
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



const controlCommands = {
    nominal: [
        ".a16",
        ".a8",
        ".addr",
        ".align",
        ".asciiz",
        ".autoimport",
        ".bankbytes",
        ".bss",
        ".case",
        ".charmap",
        ".code",
        ".constructor",
        ".data",
        ".dbyt",
        ".debuginfo",
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
        ".fileopt", ".fopt",
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
        ".linecont",
        ".list",
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
        ".smart",
        ".tag",
        ".undef", ".undefine",
        ".warning",
        ".word",
        ".zeropage",
    ],
    exceptional: [
        ".assert",
        ".condes",
        ".enum", ".endenum",
        ".feature",
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
        "byt", ".byte",
        ".res",
        ".dbyte",
        ".word",
        ".addr",
        ".faraddr",
        ".dword",
    ],
    features: [
        "at_in_identifiers",
        "bracket_as_indirect",
        "c_comments",
        "dollar_in_identifiers",
        "dollar_is_pc",
        "force_range",
        "labels_without_colons",
        "leading_dot_in_identifiers",
        "long_jsr_jmp_rts",
        "loose_char_term",
        "loose_string_term",
        "missing_char_term",
        "org_per_seg",
        "pc_assignment",
        "string_escapes",
        "ubiquitous_idents",
        "underline_in_numbers",
    ]
};
controlCommands.exceptional = [
    ...controlCommands.exceptional,
    ...controlCommands.ifKeywords,
    ...controlCommands.storageAllocators,
]





module.exports = grammar({
    name: "ca65",
    extras: $ => [
        // $.line_continuation,
        $.comment,
        $._spacing,
    ],
    word: $ => $._word,
    conflicts: $ => [
        [$._nominal_pseudo_function_call, $._ident, $._blank],
        // [$.macro_invocation, $._expression],
        [$.assignment_statement, $._expression],
        [$.unary_operator, $.pseudo_function],
        [$.unary_expression, $.binary_expression],
    ],
    inline: $ => [
        $._parenned_expression,
        $._one_or_more_expressions,
    ],
    precedences: _ => [[
        "unary_ops", // + - ~ < > ^ .bitnot .lobyte .hibyte .banknyte
        "muldiv", /* * / & ^  <<  >> .mod .bitand .bitxor .shl .shr */
        "addsub", // + - | .bitor
        "comparison_ops", // = <> < > <= >=
        "boolean_and_xor", // && .and .xor
        "boolean_or", // || .or
        "boolean_not", /* ! .not */
    ]],
    rules: {
        source_file: $ => repeat($._line),

        comment: $ => /;.*?/,
        _spacing: _ => / |\t/,

        // _code_unit: $ => choice($._statement, $._expression),
        _code_unit: $ => choice($._statement),
        _line: $ => seq(optional($._label), optional($._code_unit), "\n"),
        block: $ => repeat1($._line),

        _statement: $ => choice(
            $.control_command,
            $.instruction,
            $.assignment_statement,
            $.macro_invocation,
            $._expression_block,
        ),

        assignment_statement: $ => seq(field("left", $._symbol), "=", field("right", $._expression)),


        //---------------------------
        // Expressions
        //---------------------------

        _expression: $ => choice(
            // seq("(", $._expression, ")"),
            $._literal,
            $.pseudo_variable,
            $.pseudo_function_call,
            $._symbol,
            $.unary_expression,
            $.binary_expression,
            $.cheap_label,
        ),
        unary_expression: $ => prec(2, choice(
            seq(
                field("operator", $.unary_operator),
                field("operand", $._expression)
            )
        )),
        unary_operator: $ => choice(
            prec("unary_ops", choice("+", "-", "~", "<", ">", "^", caseInsensitive([".bitnot", ".lobyte", ".hibyte", ".bankbyte"]))),
            prec("boolean_not", choice("!", caseInsensitive(".not"))),
        ),
        _parenned_expression: $ => seq("(", $._expression, ")"),
        _one_or_two_expressions: $ => seq($._expression, optional(seq(",", $._expression))),
        _one_or_more_expressions: $ => delimitted($._expression, ","),
        binary_expression: $ => prec.left(seq(
            field("left", $._expression),
            field("operator", $.binary_operator),
            field("right", $._expression),
        )),
        binary_operator: $ => choice(
            prec("muldiv", choice("*", "/", "&", "^", "<<", ">>", caseInsensitive([".mod", ".bitand", ".bitxor", ".shl", ".shr"]))),
            prec("addsub", choice("+", "-", "|", caseInsensitive(".bitor"))),
            prec("comparison_ops", caseInsensitive(["=", "<>", "<", ">", "<=", ">="])),
            prec("boolean_and_xor", choice("&&", caseInsensitive([".and", ".xor"]))),
            prec("boolean_or", caseInsensitive("or")),
        ),
        _expression_block: $ => seq(
            "tree-sitter-expression-block-start", "\n",
            repeat(seq(optional($._expression), "\n")),
            "tree-sitter-expression-block-end",
        ),

        //---------------------------
        // Mnemonics & Instructions
        //---------------------------

        mnemonic: _ => caseInsensitive(mnemonics.common),
        instruction: $ => prec.right(3, seq($.mnemonic, optional($._addressing_mode))),

        //---------------------------
        // Labels
        //---------------------------

        _label: $ => choice($.label_declaration, $.cheap_label_declaration, $.unnamed_label),
        label_assignment: $ => seq($._single_symbol, ":=", $._expression),
        label_declaration: $ => prec.left(2, seq($._single_symbol, ":")),
        cheap_label: $ => seq(choice("@", "?"), $._single_symbol),
        cheap_label_declaration: $ => prec.left(2, seq($.cheap_label, ":")),

        unnamed_label: _ => ":",
        unnamed_label_plus: $ => /:\++/,
        unnamed_label_minus: $ => /:-+/,

        //---------------------------
        // Literals
        //---------------------------

        _literal: $ => choice(
            $._number_literal,
            $.string_literal,
        ),
        hex_literal: _ => choice(
            /\$[a-fA-F0-9]+/,
            /[a-fA-F0-9]+[hH]/
        ),
        decimal_literal: _ => /[0-9_]+/,
        binary_literal: _ => /%[0-1_]+/,
        _number_literal: $ => choice(
            $.hex_literal,
            $.binary_literal,
            $.decimal_literal,
        ),
        string_literal: _ => token.immediate(seq(
            '"',
            repeat(/[^"]/), // TODO: escaping
            '"'
        )),


        //---------------------------
        // Pseudo Functions/Variables
        //---------------------------

        pseudo_variable: _ => caseInsensitive(pseudo_variables),

        pseudo_function: _ => caseInsensitive(pseudo_functions.nominal),
        _nominal_pseudo_function_call: $ => prec.right(seq(
            $.pseudo_function,
            optional(choice(
                $._expression,
                seq("(", $._one_or_more_expressions, ")"),
            ))
        )),
        pseudo_function_call: $ => choice(
            $._ident,
            $._blank,
            $._nominal_pseudo_function_call
        ),

        blank_keyword: $ => caseInsensitive(".blank"),
        _blank: $ => seq(
            alias($.blank_keyword, $.pseudo_function,),
            "(",
            choice(
                $._expression,
                seq("{", $._expression, "}"),
            ),
            ")"
        ),

        ident_keyword: $ => caseInsensitive(".ident"),
        _ident: $ => seq(
            alias($.ident_keyword, $.pseudo_function),
            $._parenned_expression
        ),

        //---------------------------
        // Control Commands
        //---------------------------

        control_command: $ => choice(
            $._nominal_control_command,
            $._exceptional_control_command,
        ),
        _nominal_control_command: $ => prec.right(seq(
            field("command", caseInsensitive(controlCommands.nominal)),
            optional(choice(
                // alias("+", $.plus),
                // alias("-", $.minus),
                "+", "-",
                $._one_or_more_expressions
            )
            )
        )),
        _exceptional_control_command: $ => choice(
            $.assert_command,
            $.feature_command,
            $.repeat_command,
            $.enum_declaration,
            $.macro_declaration,
            $.proc_declaration,
            $.scope_declaration,
            $.condes_statement,
            $.if_statement,
        ),

        assert_command: $ => seq(field("command", ".assert"), $._expression, ",", /warning|error|ldwarning|lderror/, optional(seq(",", $._expression))),

        condes_statement: $ => seq(field("command", ".condes"), $._expression, ",", /constructor|destructor|[0-6]/, optional(seq(',', $._expression))),

        enum_declaration: $ => seq(
            ".enum",
            optional(field("name", $._single_symbol)), "\n",
            repeat(seq(optional(seq($._single_symbol, optional(seq("=", $._expression)))), "\n")),
            // field("body", optional($.block)),
            ".endenum",
        ),

        feature_command: $ => seq(field("command", caseInsensitive(".feature")), $._feature, repeat(seq(",", $._feature))),
        _feature: $ => choice(
            $.enable_feature,
            $.disable_feature,
        ),
        enable_feature: $ => seq(
            field("name", $._feature_name),
            optional(choice(
                "+",
                caseInsensitive("on"),
            ))
        ),
        disable_feature: $ => seq(
            field("name", $._feature_name),
            choice(
                "-",
                caseInsensitive("off"),
            )
        ),
        _feature_name: $ => caseInsensitive(controlCommands.features),


        if_keyword: $ => caseInsensitive(controlCommands.ifKeywords),
        if_statement: $ => seq(
            $.if_keyword,
            optional(field("condition", $._expression)),
            "\n",
            optional($.block),
            repeat($.elseif),
            optional($.else),
            ".endif"
        ),
        else: $ => seq(".else", "\n", optional($.block)),
        elseif: $ => seq(".elseif", $._expression, "\n", optional($.block)),

        macro_parameters: $ => seq($._single_symbol, repeat(seq(",", $._single_symbol))),
        macro_declaration: $ => seq(
            ".macro",
            field("name", $._single_symbol),
            field("parameters", optional($.macro_parameters)), "\n",
            field("body", optional($.block)),
            ".endmacro"),
        macro_argument: $ => prec.right(choice(
            $._expression,
            seq("{", $._expression, "}"),
        )),
        macro_arguments: $ => prec.right(choice(
            $.macro_argument,
            ",",
            seq($.macro_argument, ","),
        )),
        macro_invocation: $ => seq(
            $._symbol,
            $._expression,
            repeat(seq(",", $._expression))
            // repeat($.macro_arguments),
        ),

        proc_declaration: $ => seq(
            ".proc", $._single_symbol, "\n",
            field("body", optional($.block)),
            ".endproc"
        ),

        repeat_command: $ => seq(".repeat", $._one_or_two_expressions, "\n", $.block, ".endrepeat"),

        scope_declaration: $ => seq(
            ".scope", field("name", $._single_symbol), "\n",
            field("body", optional($.block)),
            ".endscope"
        ),

        struct_declaration: $ => seq(
            ".struct", optional($._single_symbol), "\n",
            optional(field("body", $.struct_block)),
            ".endstruct"
        ),
        struct_member: $ => seq(
            seq(
                optional(field("member_name", $._single_symbol)),
                $.storage_allocator,
                optional(field("multiplier", $._number_literal))
            ),
            "\n"
        ),
        _struct_line: $ => seq(optional($._label), optional(choice($._code_unit, $.struct_member)), "\n"),
        struct_block: $ => repeat1($._struct_line),

        storage_allocator: $ => field("size", caseInsensitive(controlCommands.storageAllocators)),



        //---------------------------
        // Addressing
        //---------------------------

        _addressing_mode: $ => choice(
            $.absolute_address,
            $.immediate_mode,
            $.indexed_x,
            $.indexed_y,
            $.indirect_x,
            $.indirect_y,
            $.unnamed_label_plus,
            $.unnamed_label_minus,
        ),
        absolute_address: $ => $._expression,
        immediate_mode: $ => seq("#", $._expression),
        indexed_x: $ => seq($._expression, ",", $.x),
        indexed_y: $ => seq($._expression, ",", $.y),
        indirect_x: $ => seq("(", $._expression, ",", $.x, ")"),
        indirect_y: $ => seq("(", $._expression, ")", ",", $.y),


        // ---------------------------
        // (de)priority Hell / Symbols
        // ---------------------------

        identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,

        _single_symbol: $ => choice(
            $.identifier,
            // $._reserved,
            prec(2, $._ident)
        ),
        _symbol: $ => choice(
            $._single_symbol,
            $.scoped_access,
            $.global_scope_access,
        ),

        scoped_access: $ => seq($._single_symbol, repeat1(seq("::", $._single_symbol))),
        global_scope_access: $ => seq("#::", $._single_symbol, repeat(seq("::", $._single_symbol))),

        _word: _ => /(\.|\$)?[a-zA-Z_][a-zA-Z0-9_]*/,

        _reserved: $ => choice(
            $.a,
            $.f,
            $.sp,
            $.x,
            $.y,
            $.z,
        ),
        a: _ => caseInsensitive("a"),
        f: _ => caseInsensitive("f"),
        sp: _ => choice(caseInsensitive("s"), caseInsensitive("sp")),
        x: _ => caseInsensitive("x"),
        y: _ => caseInsensitive("y"),
        z: _ => caseInsensitive("z"),
    },
})

function delimitted(rule, delimiter) {
    return seq(rule, repeat(seq(delimiter, rule)));
}

function toCaseInsensitive(a) {
    var ca = a.charCodeAt(0);
    if (ca >= 97 && ca <= 122) return `[${a}${a.toUpperCase()}]`;
    if (ca >= 65 && ca <= 90) return `[${a.toLowerCase()}${a}]`;
    return a;
}

function caseInsensitive(rule) {
    switch (typeof rule) {
        case "string":
            return new RegExp(rule.split("").map(toCaseInsensitive).join(""));
        case "object":
            return choice(...rule.map(caseInsensitive));
    }
    console.error("Casefolding failed");
}

