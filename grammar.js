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
    nominal: []
}

const ifKeywords = [
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
]

const storageAllocators = [
    ".byte",
    ".res",
    ".dbyte",
    ".word",
    ".addr",
    ".faraddr",
    ".dword",
]

module.exports = grammar({
    name: "ca65",
    extras: $ => [
        // $.line_continuation,
        $.comment,
        $._spacing,
    ],
    word: $ => $.word_,
    conflicts: $ => [
        [$._nominal_pseudo_function_call, $._ident, $._blank],
    ],
    inline: $ => [
        $._parenned_expression,
        $._one_or_more_expressions,
    ],
    precedences: _ => [[
        "boolean_not", /* ! .not */
        "boolean_or", // || .or
        "boolean_and_xor", // && .and .xor
        "comparison_ops", // = <> < > <= >=
        "addsub", // + - | .bitor
        "muldiv", /* * / & ^  <<  >> .mod .bitand .bitxor .shl .shr */
        "unary_ops", // + - ~ < > ^ .bitnot .lobyte .hibyte .banknyte
    ]],
    rules: {
        // reserved: $ => caseInsensitive(reserved),
        source_file: $ => optional($._lines),
        comment: _ => /;.*?/,
        _spacing: _ => / |\t/,
        _code_unit: $ => choice($._statement, $._expression),
        unnamed_label: _ => ":",
        _line: $ => seq(optional($._label), choice($._code_unit, "\n")),
        // _lines: $ => seq($._line, repeat(seq("\n", $._line))),
        _lines: $ => delimitted($._line, "\n"),
        block: $ => repeat1($._line),
        _single_line_statement: $ => choice(
            $.control_command,
            $.instruction,
        ),
        _statement: $ => choice(
            $._single_line_statement,
            $._block_statement,
        ),
        _block_statement: $ => choice(
            $.macro,
            $.enum,
            $.if_statement,
        ),
        assignment: $ => seq($._symbol, "=", $._expression),
        _label: $ => choice($.label_declaration, $.cheap_label_declaration, $.unnamed_label),
        label_assignment: $ => seq($._symbol, ":=", $._expression),
        label_declaration: $ => prec.left(2, seq($._symbol, ":")),
        cheap_label_declaration: $ => seq("@", $.label_declaration),
        _expression: $ => choice(
            // seq("(", $._expression, ")"),
            $.string_literal,
            $.pseudo_variable,
            $._number,
            $._symbol,
            $.pseudo_function_call,
            $.unnamed_label_plus,
            $.unnamed_label_minus,
            $.scoped_access,
            $.global_scope_access,
            // $._unary_expression
        ),
        scoped_access: $ => seq($._symbol, repeat1(seq("::", $._symbol))),
        global_scope_access: $ => seq("#::", $._symbol, repeat(seq("::", $._symbol))),
        _unary_expression: $ => choice(
            seq(
                field("operator", choice(...operators.unary)),
                field("operand", $._expression))
        ),
        _parenned_expression: $ => seq("(", $._expression, ")"),
        _one_or_two_expressions: $ => seq($._expression, optional(seq(",", $._expression))),
        _one_or_more_expressions: $ => delimitted($._expression, ","),

        // instruction: $ => seq($.mnemonic, optional($._addressing_mode)),
        instruction: $ => prec.right(3, seq($.mnemonic, optional($._addressing_mode))),

        // #########################
        // # Primitives
        // #########################
        hex: _ => choice(
            /\$[a-fA-F0-9]+/,
            /[a-fA-F0-9]+[hH]/
        ),
        decimal: _ => /[0-9_]+/,
        binary: _ => /%[0-1_]+/,
        _number: $ => choice(
            $.hex,
            $.binary,
            $.decimal,
        ),
        string_literal: _ => token.immediate(seq(
            '"',
            repeat(/[^"]/), // TODO: escaping
            '"'
        )),

        pseudo_variable: _ => caseInsensitive(pseudo_variables),

        // #########################
        // # Pseudo Functions
        // #########################
        // _pseudo_function: $ => choice($.ident, $.blank, $.pseudo_function_call),
        pseudo_function: _ => caseInsensitive(pseudo_functions.nominal),
        _nominal_pseudo_function_call: $ => prec.right(seq(
            $.pseudo_function,
            optional(choice(
                $._expression,
                // $._parenned_expression,
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
            // $.blank_keyword,
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
            // $.ident_keyword,
            $._parenned_expression
        ),

        // #########################
        // # Control Commands
        // #########################
        control_command_2: $ => seq(
            caseInsensitive(controlCommands.nominal),
            optional(choice(
                "+", "-",
                toCaseInsensitive("on"),
                toCaseInsensitive("off"),
                $._one_or_more_expressions
            )
            )
        ),
        control_command: $ => choice(
            field("command", choice(".a16", ".a8",
                ".bankbytes", // TODO much later
                ".bss", ".code", ".data",
                $.define,
                // ".else", ".elseif",
                ".end",
                ".endrep",
                // ".enum", ".endenum", ".error",
                ".exitmac", //
                ".exitmacro", //
                ".export", // TODO
                ".exportzp", // TODO
                // ".faraddr", ".fatal", ".feature", ".fileopt", ".fopt", ".forceimport", ".global", ".globalzp", ".hibytes",
                ".i16", // as is
                ".i8", // as is
                // ".if", ".ifblank", ".ifconst", ".ifdef", ".ifnblank", ".ifndef", ".ifnref", ".ifp02", ".ifp4510", ".ifp816", ".ifpc02", ".ifpdtv", ".ifpsc02", ".ifref", ".endif",
                ".import", // as is
                ".importzp", // as is
                // ".incbin", ".interruptor", ".linecont", ".list", ".listbytes", ".literal", ".lobytes",
                ".local",
                ".localchar",
                ".macpack",
                ".mac",
                ".org",
                ".out",
                ".p02",
                ".p4510",
                ".p816",
                ".pagelen",
                ".pagelength",
                ".pc02",
                ".pdtv",
                ".popcharmap",
                ".popcpu",
                ".popseg",
                // ".proc", ".endproc",
                ".psc02",
                ".pushcharmap",
                ".pushcpu",
                ".pushseg",
                ".referto",
                ".refto",
                ".reloc",
                ".repeat", ".endrepeat",
                ".res",
                ".rodata",
                // ".scope", ".endscope",
                ".segment",
                ".set",
                ".setcpu",
                ".smart",
                ".struct", ".endstruct",
                ".tag",
                ".undef",
                ".undefine",
                ".union", ".endunion",
                ".warning",
                ".word",
                ".zeropage")),
            seq(field("command", /\.(case|debuginfo|autoimport|linecont)/), /\+|-/),
            seq(field("command", /\.(list)/), /on|off|\+|-/),
            seq(field("command", /\.(include|delmac|delmacro|error|fatal|listbytes)/), $._expression),
            seq(field("command", /\.(charmap|fileopt|fopt|global|globalzp)/), $._expression, ",", $._expression),
            seq(field("command", /\.(align|charmap|constructor|destructor|interruptor)/), $._one_or_two_expressions),
            seq(field("command", /\.(addr|byt|byte|dbyt|asciiz|dword|faraddr|forceimport|hibytes|literal|lobytes)/), $._one_or_more_expressions),
            seq(field("command", /\.(incbin)/), $._expression, optional(seq(",", $._expression)), optional(seq(",", $._expression))),
            seq(field("command", ".assert"), $._expression, ",", /warning|error|ldwarning|lderror/, optional(seq(",", $._expression))),
            seq(field("command", ".condes"), $._expression, ",", /constructor|destructor|[0-6]/, optional(seq(',', $._expression))),
            seq(field("command", ".feature"), $._feature, repeat(seq(",", $._feature))),
            // $.macro

        ),
        _block_control_command: $ => choice(
            $.enum,
            $.if_statement,
            $.macro,
            $.proc,
            $.scope
        ),
        define: $ => seq(".define", $._symbol, $._expression),
        enum: $ => seq(
            ".enum",
            optional(field("name", $._symbol)), "\n",
            repeat(seq(optional(seq($._symbol, optional(seq("=", $._expression)))), "\n")),
            // field("body", optional($.block)),
            ".endenum",),
        _feature: $ => seq($._expression, optional(/-|\+/)),
        if_keyword: $ => caseInsensitive(ifKeywords),
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
        macro: $ => seq(
            ".macro",
            field("name", $._symbol),
            field("parameters", optional($.parameter_list)), "\n",
            field("body", optional($.block)),
            ".endmacro"),
        parameter_list: $ => seq($._symbol, repeat(seq(",", $._symbol))),
        proc: $ => seq(
            ".proc", $._symbol, "\n",
            field("body", optional($.block)),
            ".endproc"
        ),
        repeat: $ => seq(".repeat", $._one_or_two_expressions, "\n", $.block, ".endrepeat"),
        scope: $ => seq(
            ".scope", field("name", $._symbol), "\n",
            field("body", optional($.block)),
            ".endscope"
        ),
        struct: $ => seq(
            ".struct", optional($._symbol), "\n",
        ),
        _storage_allocator: $ => caseInsensitive(storageAllocators),
        struct_member: $ => seq(
            choice(
                seq($._symbol,)
            ),
            "\n"
        ),


        // #########################
        // # Addressing
        // #########################
        _addressing_mode: $ => choice(
            $.absolute_address,
            $.immediate_mode,
            $.indexed_x,
            $.indexed_y,
            $.indirect_x,
            $.indirect_y,
        ),
        absolute_address: $ => $._expression,
        immediate_mode: $ => seq("#", $._expression),
        indexed_x: $ => seq($._expression, ",", "x"),
        indexed_y: $ => seq($._expression, ",", "y"),
        indirect_x: $ => seq("(", $._expression, ",", "x", ")"),
        indirect_y: $ => seq("(", $._expression, ")", ",", "y"),
        unnamed_label_plus: $ => /:\++/,
        unnamed_label_minus: $ => /:-+/,

        // #########################
        // # (de)priority Hell
        // #########################
        mnemonic: _ => caseInsensitive(mnemonics.common),
        word_: _ => /(\.|\$)?[a-zA-Z_][a-zA-Z0-9_]*/,
        identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
        _symbol: $ => choice(
            $.identifier,
            // $.reserved,
            prec(2, $._ident)
        ),
        // reserved: $ => /a|A|f|F|s|S|x|X|y|Y/,
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

