const strings = require("./etc/strings");
const utilities = require("./etc/utilities");

const opt = utilities.opt;
const rep = utilities.rep;
const rep1 = utilities.rep1;
const pick = utilities.pick;
const delimited = utilities.delimited;
const immediate = utilities.immediate;
const caseless = utilities.caseless;
const caseless_alias = utilities.caseless_alias;
const optional_field = utilities.optional_field;


const grammar_ = () => grammar({
    name: "ca65",
    conflicts: $ => [
        // [$._EOL, $._union_struct_line],
        [$._symbol, $._line, $.contextual_sequence],
        [$._symbol, $.label_declaration],
        // [$._symbol, $.contextual_sequence],
        [$._expression, $.contextual_sequence],
        [$._symbol, $.contextual_sequence],
        [$.comma, $.contextual_sequence],
        [$.macro_arguments, $.contextual_sequence],
        // [$._expression, $._addressing_mode],
        // [$.nominal_pseudo_function_call, $.ident_call, $.blank_call],
        // [$.assignment_statement, $._expression],
        // [$.unary_operator, $.pseudo_function],
        // [$.unary_expression, $.binary_expression],
        // [$.union_struct_member, $.macro_invocation],
        // [$.pseudo_function, $.identifier],
    ],
    externals: _ => [],
    extras: $ => [
        $.line_continue,
        $.c_comment,
        $.comment,
        $._spacing,
    ],
    inline: $ => [
        $.pseudo_function_call,
    ],
    precedences: _ => [
        [
            "unary_ops", // + - ~ < > ^ .bitnot .lobyte .hibyte .bankbyte
            "muldiv", /* * / & ^  <<  >> .mod .bitand .bitxor .shl .shr */
            "addsub", // + - | .bitor
            "comparison_ops", // = <> < > <= >=
            "boolean_and_xor", // && .and .xor
            "boolean_or", // || .or
            "boolean_not", /* ! .not */
        ],
        [
            "enum-member",
            "statement"
        ],
        [
            "_line",
            "_symbol",
        ],
        [
            "contextual_sequence",
            "_symbol",
        ],
        [
            "contextual_symbol",
            "_symbol",
            "_single_symbol",
        ],
        [
            "_single_symbol",

        ]
    ],
    supertypes: $ => [
        $.control_command,
        $._symbol,
        $.PC,
        $.unary_operator,
        $.binary_operator,
    ],
    word: $ => $._word,
    rules: {
        ...rules_.meta,
        ...rules_.comments,
        ...rules_.statements,
        ...rules_.expressions,
        ...rules_.instructions,
        ...rules_.labels,
        ...rules_.literals,
        ...rules_.pseudos,
        ...rules_.commands,
        ...rules_.addressing,
        ...rules_.symbols,
    },
});

const rules_ = {
    meta: {
        source_file: $ => repeat($._line),
        _spacing: _ => / |\t/,
        _newline: _ => /\r?\n/,
        line_continue: _ => /\\\r?\n/,
        EOF: _ => token('\0'),
        _EOL: $ => choice($._newline, $.EOF),
        _code_unit: $ => choice(
            $._statement,
            $.macro_invocation,
        ),
        _line: $ => prec("_line", seq(
            opt(pick(
                $.contextual_symbol,
                $.contextual_sequence,
                $.label_assignment,
                $._label,
                $._code_unit,
                [$._label, $._code_unit],
            )),
            $._EOL
        )),
        block: $ => repeat1($._line),
    },
    symbols: {
        identifier: _ => /(\.)?[a-zA-Z_][a-zA-Z0-9_@\$]*/,

        _single_symbol: $ => prec("_single_symbol", choice(
            $.identifier,
            prec(2, $.ident_call)
        )),
        _symbol: $ => prec("_symbol", choice(
            $._single_symbol,
            $.qualified_symbol,
        )),
        contextual_symbol: $ => prec("contextual_symbol", $._single_symbol),
        contextual_sequence: $ => prec("contextual_sequence",
            seq(
                $._single_symbol,
                $._symbol,
                opt($._macro_arguments)
            )
        ),

        qualified_symbol: $ => seq(
            opt(
                alias("#", $.global_scope),
                "::"
            ),
            $._single_symbol,
            rep1("::", $._single_symbol),
        ),

        _word: _ => /(\.|\$)?[a-zA-Z_][a-zA-Z0-9_@\$]*/,

        star_PC: _ => "*",
        dollar_PC: _ => "$",
        PC: $ => choice(
            $.star_PC,
            $.dollar_PC
        ),

        _reserved: $ => choice(
            $.a,
            $.f,
            $.sp,
            $.x,
            $.y,
            $.z,
        ),
        a: _ => caseless("a"),
        f: _ => caseless("f"),
        sp: _ => caseless(["s", "sp"]),
        x: _ => caseless("x"),
        y: _ => caseless("y"),
        z: _ => caseless("z"),
    },
    comments: {
        comment: _ => immediate(
            ";",
            field("contents", /.*?/)
        ),
        c_comment: _ => immediate(
            field("left", "/*"),
            field("contents", /[^(\*\/)]*?/),
            field("right", "*/"),
            /\r?\n/
        ),
    },
    statements: {
        _statement: $ => choice(
            $.control_command,
            $.instruction,
            $.assignment_statement,
            $._expression_block,
        ),

        _assignable_to: $ => choice(
            $._symbol,
            $.PC
        ),

        assignment_statement: $ => seq(
            field("left", $._assignable_to),
            "=",
            field("right", $._expression)
        )
    },
    expressions: {
        _expression: $ => choice(
            prec(-1, seq("(", $._expression, ")")),
            $._literal,
            $.pseudo_variable,
            $.pseudo_function_call,
            $._symbol,
            $.unary_expression,
            $.binary_expression,
            $.cheap_label,
            $.unnamed_label_plus,
            $.unnamed_label_minus,
            $.PC
        ),
        _optionally_curly_expression: $ => pick(
            $._expression,
            ["{", $._expression, "}"],
        ),
        expression_list: $ => delimited($._expression, ","),
        plus: _ => "+",
        minus: _ => "-",
        tilde: _ => "~",
        LT: _ => "<",
        GT: _ => ">",
        caret: _ => "^",
        bang: _ => "!",
        star: _ => "*",
        slash: _ => "/",
        ampersand: _ => "&",
        ampersand_ampersand: _ => "&&",
        LTLT: _ => "<<",
        GTGT: _ => ">>",
        pipe: _ => "|",
        equals: _ => "=",
        LTGT: _ => "<>",
        LTE: _ => "<=",
        GTE: _ => ">=",
        bankbyte: _ => caseless(".bankbyte"),
        lobyte: _ => caseless(".lobyte"),
        hibyte: _ => caseless(".hibyte"),
        bitand: _ => caseless(".bitand"),
        bitnot: _ => caseless(".bitnot"),
        bitor: _ => caseless(".bitor"),
        bitxor: _ => caseless(".bitxor"),
        dot_and: _ => caseless(".and"),
        dot_mod: _ => caseless(".mod"),
        dot_not: _ => caseless(".not"),
        dot_or: _ => caseless(".or"),
        dot_xor: _ => caseless(".xor"),
        shl: _ => caseless(".shl"),
        shr: _ => caseless(".shr"),

        unary_expression: $ => choice(
            prec("unary_ops", seq(
                field("operator", choice($.plus, $.minus, $.tilde, $.LT, $.GT, $.caret, $.bitnot, $.lobyte, $.hibyte, $.bankbyte)),
                field("operand", $._expression)

            )),
            prec("boolean_not", seq(
                field("operator", choice($.bang, $.dot_not)),
                field("operand", $._expression)

            )),
        ),

        unary_operator: $ => choice(
            prec("unary_ops", choice($.plus, $.minus, $.tilde, $.LT, $.GT, $.caret, $.bitnot, $.lobyte, $.hibyte, $.bankbyte)),
            prec("boolean_not", choice($.bang, $.dot_not)),
        ),
        binary_expression: $ => prec.right(choice(
            prec("muldiv", seq(
                field("left", $._expression),
                field("operator", choice($.star, $.slash, $.ampersand, $.caret, $.LTLT, $.GTGT, $.dot_mod, $.bitand, $.bitxor, $.shl, $.shr),),
                field("right", $._expression),
            )),
            prec("addsub", seq(
                field("left", $._expression),
                field("operator", choice($.plus, $.minus, $.pipe, $.bitor)),
                field("right", $._expression),
            )),
            prec("comparison_ops", seq(
                field("left", $._expression),
                field("operator", choice($.equals, $.LTGT, $.LT, $.GT, $.LTE, $.GTE)),
                field("right", $._expression),
            )),
            prec("boolean_and_xor", seq(
                field("left", $._expression),
                field("operator", choice($.ampersand_ampersand, $.dot_and, $.dot_xor)),
                field("right", $._expression),
            )),
            prec("boolean_or", seq(
                field("left", $._expression),
                field("operator", $.dot_or),
                field("right", $._expression),
            )),
        )),
        binary_operator: $ => choice(
            prec("muldiv", choice($.star, $.slash, $.ampersand, $.caret, $.LTLT, $.GTGT, $.dot_mod, $.bitand, $.bitxor, $.shl, $.shr)),
            prec("addsub", choice($.plus, $.minus, $.pipe, $.bitor)),
            prec("comparison_ops", choice($.equals, $.LTGT, $.LT, $.GT, $.LTE, $.GTE)),
            prec("boolean_and_xor", choice($.ampersand_ampersand, $.dot_and, $.dot_xor)),
            prec("boolean_or", $.dot_or),
        ),
        _expression_block: $ => seq( // (For testing/debugging purposes)
            "tree-sitter-expression-block-start",
            $._newline,
            rep(
                optional($._expression),
                $._newline,
            ),
            "tree-sitter-expression-block-end",
        ),
    },
    instructions: {
        mnemonic: _ => caseless(strings.mnemonics.all),
        instruction: $ => prec.right(3,
            seq(
                field("mnemonic", $.mnemonic),
                optional_field("address", $._addressing_mode)
            )
        ),
    },
    labels: {
        _label: $ => choice(
            $.label_declaration,
            $.cheap_label_declaration,
            $.unnamed_label),
        label_assignment: $ => seq(
            field("left", $._single_symbol),
            ":=",
            field("right", $._expression)),
        label_declaration: $ => prec.left(2,
            seq(
                field("name", $._single_symbol),
                ":"
            )
        ),
        cheap_label: $ => seq(
            choice("@", "?"),
            $._single_symbol
        ),
        cheap_label_declaration: $ => prec.left(2,
            seq(
                field("name", $.cheap_label),
                opt(":")
            )
        ),

        unnamed_label: _ => ":",
        unnamed_label_plus: $ => /:\++/,
        unnamed_label_minus: $ => /:-+/,
    },
    literals: {
        _literal: $ => choice(
            $._number_literal,
            $.string_literal,
            $.char_sans_terminator,
        ),
        _dollar_hex: _ => immediate(
            field("base_symbol", "$"),
            field("digits", /[a-fA-F0-9]+(_?[a-fA-F0-9]+)*/)
        ),
        _h_hex: _ => immediate(
            field("digits", /[a-fA-F0-9]+(_?[a-fA-F0-9]+)*/),
            field("base_symbol", /[hH]/),
        ),
        hex_literal: $ => choice(
            $._dollar_hex,
            $._h_hex,
        ),
        decimal_literal: _ => field("digits", /[0-9]+(_?[0-9]+)*/),
        binary_literal: $ => immediate(
            field("base_symbol", "%"),
            field("digits", /[0-1]+(_?[0-1]+)*/)
        ),
        _number_literal: $ => choice(
            $.hex_literal,
            $.binary_literal,
            $.decimal_literal,
        ),
        char_sans_terminator: _ => prec.left(/'./),

        string_literal: $ => choice(
            immediate(
                '"',
                field("contents",
                    repeat(choice(
                        "\\\\", // \\
                        "\\'", // \'
                        "\\\"", // \""
                        "\\t", // \t
                        "\\r", // \r
                        "\\n", // \n
                        /\\x[0-9A-F]{2}/, // \x01, \x9A, \xEF, ...
                        /[^"\n]/,
                    ))
                ),
                '"'
            ),
            immediate(
                "'",
                field("contents",
                    repeat(choice(
                        "\\\\", // \\
                        "\\'", // \'
                        "\\\"", // \""
                        "\\t", // \t
                        "\\r", // \r
                        "\\n", // \n
                        /\\x[0-9A-F]{2}/, // \x01, \x9A, \xEF, ...
                        /[^'\n]/,
                    ))
                ),
                "'"
            ),
        ),
    },
    pseudos: {
        pseudo_variable: $ => choice(caseless(strings.pseudo_variables)),

        pseudo_function: _ => caseless(strings.pseudo_functions.nominal),
        nominal_pseudo_function_call: $ => seq(
            field("name", $.pseudo_function),
            "(",
            field("arguments", $.expression_list),
            ")",
        ),
        pseudo_function_call: $ => choice(
            $.ident_call,
            $.blank_call,
            $.nominal_pseudo_function_call
        ),

        blank_call: $ => seq(
            caseless_alias(".blank", $.pseudo_function),
            "(",
            field("argument", $._optionally_curly_expression),
            ")"
        ),

        // ident_keyword: _ => caseless(".ident"),
        ident_call: $ => seq(
            field("name", caseless_alias(".ident", $.pseudo_function)),
            field("argument", seq("(", $._expression, ")"))
        ),
    },
    commands: {
        control_command: $ => choice(
            $.nominal_control_command,
            $._exceptional_control_command,
        ),
        nominal_control_command: $ => prec.right(
            seq(
                field("name", caseless_alias(strings.commands.nominal, $.command)),
                optional_field("arguments", $.expression_list)
            )
        ),
        _exceptional_control_command: $ => choice(
            $.repeat_block,

            $.group_feature_command,
            $.single_feature_command,
            $.file_opt_command,

            $.enum_declaration,
            $.macro_declaration,
            $.proc_declaration,
            $.scope_declaration,
            $.struct_declaration,
            $.union_declaration,

            $.assert_statement,
            $.condes_statement,
            $.if_statement,
            $.set_statement,
        ),

        assert_statement: $ => seq(
            caseless_alias(".assert", $.command),
            field("condition", $._expression),
            ",",
            field(
                "action",
                caseless_alias([
                    "warning",
                    "error",
                    "ldwarning",
                    "lderror"
                ], $.contextual_keyword)
            ),
            opt(
                ",",
                field("message", $._expression)
            ),
        ),

        condes_statement: $ => seq(
            caseless_alias(".condes", $.command),
            field("name", $._symbol),
            ",",
            field(
                "type",
                choice(
                    $._expression,
                    // /[0-6]/,
                    caseless_alias([
                        "constructor",
                        "destructor"
                    ], $.contextual_keyword)
                )
            ),
            opt(
                ',',
                field("priority", $._expression)
            )
        ),

        enum_declaration: $ => seq(
            caseless_alias(".enum", $.command),
            optional_field("name", $._single_symbol),
            $._newline,
            optional_field("body", $.block),
            caseless_alias(".endenum", $.command),
        ),

        single_feature_command: $ => seq(
            caseless_alias(strings.commands.togglableFeatures, $.command),
            optional_field("quantifier", $._feature_quantifier)
        ),

        group_feature_command: $ => seq(
            caseless_alias(".feature", $.command),
            delimited($.feature_toggle, ","),
        ),
        feature_toggle: $ => seq(
            field("name", caseless_alias(strings.commands.compatibilityFeatures, $.contextual_keyword)),
            optional_field("quantifier", $._feature_quantifier)),

        _feature_quantifier: $ => choice(
            $.on,
            $.off,
            $.plus,
            $.minus,
        ),

        on: _ => caseless("on"),
        off: _ => caseless("off"),

        file_opt_command: $ => seq(
            caseless_alias([".fileopt", ".fopt"], $.command),
            field("option", $.file_option),
            $._expression
        ),
        file_option: _ => caseless(
            "author",
            "comment",
            "compiler"
        ),


        if_keyword: $ => caseless(strings.commands.ifKeywords),
        if_statement: $ => seq(
            field(
                "if_type",
                alias($.if_keyword, $.command)
            ),
            optional_field("condition", $._expression),
            $._newline,
            optional_field("body", $.block),
            repeat($.elseif),
            optional($.else),
            caseless_alias(".endif", $.command)
        ),
        else: $ => seq(
            caseless_alias(".else", $.command),
            $._newline,
            optional_field("body", $.block)
        ),
        elseif: $ => seq(
            caseless_alias(".elseif", $.command),
            field("condition", $._expression),
            $._newline,
            optional_field("body", $.block)),

        macro_parameters: $ => delimited($._single_symbol, ","),
        macro_declaration: $ => seq(
            caseless_alias([".macro", ".mac"], $.command),
            field("name", $._single_symbol),
            optional_field("parameters", $.macro_parameters),
            $._newline,
            optional_field("body", $.block),
            caseless_alias([".endmacro", ".endmac"], $.command)
        ),
        _macro_arguments: $ => choice(
            $._optionally_curly_expression,
            seq(
                opt($._optionally_curly_expression),
                delimited($.comma, opt($._optionally_curly_expression)),
                opt($._optionally_curly_expression),
            )),
        macro_arguments: $ => $._macro_arguments,
        macro_invocation: $ => seq(
            field("name", $._symbol),
            opt($.macro_arguments),
        ),
        comma: _ => ",",

        proc_declaration: $ => seq(
            caseless_alias(".proc", $.command),
            field("name", $._single_symbol),
            $._newline,
            optional_field("body", $.block),
            caseless_alias(".endproc", $.command)
        ),

        repeat_block: $ => seq(
            caseless_alias(".repeat", $.command),
            field("iterations", $._expression),
            opt(
                ",",
                field("iterator", $._single_symbol)
            ),
            $._newline,
            optional_field("body", $.block),
            caseless_alias([".endrepeat", ".endrep"], $.command)
        ),

        scope_declaration: $ => seq(
            caseless_alias(".scope", $.command),
            field("name", $._single_symbol),
            $._newline,
            optional_field("body", $.block),
            caseless_alias(".endscope", $.command)
        ),

        set_statement: $ => seq(
            field("left", $._symbol),
            caseless_alias(".set", $.command),
            field("right", $._expression),
        ),

        struct_declaration: $ => seq(
            caseless_alias(".struct", $.command),
            optional_field("name", $._single_symbol),
            $._newline,
            optional_field("body", alias($.union_struct_block, $.block),
            ),
            caseless_alias(".endstruct", $.command)
        ),

        union_declaration: $ => seq(
            caseless_alias(".union", $.command),
            optional_field("name", $._single_symbol),
            $._newline,
            optional_field("body", alias($.union_struct_block, $.block)),
            caseless_alias(".endunion", $.command)
        ),

        union_struct_member: $ => prec(3, seq(
            optional_field("name", $._single_symbol),
            field("size", $.storage_allocator),
            optional_field("multiplier", $._expression),
        )),
        _union_struct_line: $ => prec("_line", seq(
            optional($._label),
            optional(choice(
                $.union_struct_member,
                alias($.union_struct_if_statement, $.if_statement),
                // $.control_command,
                $.instruction,
                $.assignment_statement,
                $.label_assignment,
                $.macro_invocation,
                $._expression_block,
            )),
            $._newline
        )),
        union_struct_block: $ => repeat1($._union_struct_line),

        union_struct_if_statement: $ => seq(
            field(
                "if_type",
                alias($.if_keyword, $.command)
            ),
            optional_field("condition", $._expression),
            $._newline,
            optional_field("body", alias($.union_struct_block, $.block)),
            repeat(alias($.union_struct_elseif, $.elseif)),
            optional(alias($.union_struct_else, $.else)),
            caseless_alias(".endif", $.command)
        ),
        union_struct_else: $ => seq(
            caseless_alias(".else", $.command),
            $._newline,
            optional_field("body", alias($.union_struct_block, $.block))
        ),
        union_struct_elseif: $ => seq(
            caseless_alias(".elseif", $.command),
            field("condition", $._expression),
            $._newline,
            optional_field("body", alias($.union_struct_block, $.block))),



        storage_allocator: $ => prec(2, caseless(strings.commands.storageAllocators),)
    },
    addressing: {
        _addressing_mode: $ => prec(3, choice(
            $.absolute_address,
            $.immediate_mode,
            $.indexed_x,
            $.indexed_y,
            $.indirect_x,
            $.indirect_y,
            $.unnamed_label_plus,
            $.unnamed_label_minus,
        )),
        absolute_address: $ => $._expression,
        immediate_mode: $ => seq("#", $._expression),
        indexed_x: $ => seq($._expression, ",", $.x),
        indexed_y: $ => seq($._expression, ",", $.y),
        indirect_x: $ => pick(
            ["(", $._expression, ",", $.x, ")"],
            ["[", $._expression, ",", $.x, "]"],
        ),
        indirect_y: $ => pick(
            ["(", $._expression, ")", ",", $.y],
            ["[", $._expression, "]", ",", $.y],
        ),
    },
};

module.exports = grammar_();
