const mnemonics = require("./src/custom/components/mnemonics");
const pseudo_variables = require("./src/custom/components/pseudo_variables");
const pseudo_functions = require("./src/custom/components/pseudo_functions");
const control_commands = require("./src/custom/components/control_commands");

const utilities = require("./src/custom/utilities");

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
        // [$._expression, $._addressing_mode],
        // [$.nominal_pseudo_function_call, $.ident_call, $.blank_call],
        // [$.macro_invocation, $._expression],
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
        ]
    ],
    supertypes: $ => [
        $.control_command,
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
        ),
        _line: $ => seq(
            optional($._label),
            optional($._code_unit),
            $._EOL
        ),
        block: $ => repeat1($._line),
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
            $.label_assignment,
            $.macro_invocation,
            $._expression_block,
            alias($._symbol, $.ambiguous_symbol),
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
        ),
        expression_list: $ => delimited($._expression, ","),
        expressions: $ => repeat1($._expression),
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
        mnemonic: _ => caseless(mnemonics.all),
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
                ":"
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
                        /[^"]/,
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
                        /[^']/,
                    ))
                ),
                "'"
            )
        ),
    },
    pseudos: {
        pseudo_variable: $ => choice(caseless(pseudo_variables), $.PC),

        pseudo_function: _ => caseless(pseudo_functions.nominal),
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

        blank_keyword: $ => caseless(".blank"),
        blank_call: $ => seq(
            alias($.blank_keyword, $.pseudo_function),
            "(",
            field(
                "argument",
                pick(
                    $._expression,
                    ["{", $._expression, "}"],
                )),
            ")"
        ),

        ident_keyword: _ => caseless(".ident"),
        ident_call: $ => seq(
            field("name", alias($.ident_keyword, $.pseudo_function)),
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
                field(
                    "name",
                    caseless_alias(control_commands.nominal, $.command)
                ),
                optional_field("arguments", $.expression_list)
            )
        ),
        _exceptional_control_command: $ => choice(
            $.assert_statement,
            $.feature_command,
            $.feature_toggle_command,
            $.file_opt_command,
            $.repeat_command,

            $.enum_declaration,
            $.macro_declaration,
            $.proc_declaration,
            $.scope_declaration,
            $.struct_declaration,
            $.union_declaration,

            $.condes_statement,
            $.if_statement,
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

        feature_toggle_command: $ => seq(
            caseless_alias(control_commands.togglableFeatures, $.command),
            optional_field(
                "quantifier",
                choice(
                    $.plus,
                    $.minus,
                    $.on,
                    $.off,
                )
            )
        ),

        feature_command: $ => seq(
            caseless_alias(".feature", $.command),
            delimited($._feature, ","),
        ),
        _feature: $ => choice(
            $.enable_feature,
            $.disable_feature,
        ),
        enable_feature: $ => seq(
            field("name", $.feature_name),
            optional_field("quantifier", choice(
                $.plus,
                $.on,
            ))
        ),
        disable_feature: $ => seq(
            field("name", $.feature_name),
            field("quantifier", choice(
                $.minus,
                $.off,
            ))
        ),
        feature_name: $ => caseless(control_commands.compatibilityFeatures),
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


        if_keyword: $ => caseless(control_commands.ifKeywords),
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
        macro_argument: $ => prec.right(
            pick(
                $._expression,
                ["{", $._expression, "}"],
            )
        ),
        macro_arguments: $ => prec.right(
            pick(
                $.macro_argument,
                ",",
                [$.macro_argument, ","],
            )
        ),
        macro_invocation: $ => seq(
            field("name", $._symbol),
            delimited($._expression, ","),
        ),

        proc_declaration: $ => seq(
            caseless_alias(".proc", $.command),
            field("name", $._single_symbol),
            $._newline,
            optional_field("body", $.block),
            caseless_alias(".endproc", $.command)
        ),

        repeat_command: $ => seq(
            caseless_alias(".repeat", $.command),
            field("iterations", $._expression),
            opt(
                ",",
                field("iterator", $._single_symbol)
            ),
            $._newline,
            optional_field("body", $.block),
            alias(
                caseless(
                    ".endrepeat",
                    ".endrep",
                ),
                $.command
            )
        ),

        scope_declaration: $ => seq(
            caseless_alias(".scope", $.command),
            field("name", $._single_symbol),
            $._newline,
            optional_field("body", $.block),
            caseless_alias(".endscope", $.command)
        ),

        struct_declaration: $ => seq(
            caseless_alias(".struct", $.command),
            optional_field("name", $._single_symbol),
            $._newline,
            optional_field(
                "body",
                alias($.union_struct_block, $.block),
            ),
            caseless_alias(".endstruct", $.command)
        ),

        union_declaration: $ => seq(
            caseless_alias(".union", $.command),
            optional_field("name", $._single_symbol),
            $._newline,
            optional_field(
                "body",
                alias($.union_struct_block, $.block),
            ),
            caseless_alias(".endunion", $.command)
        ),

        union_struct_member: $ => seq(
            optional_field("name", $._single_symbol),
            field("size", $.storage_allocator),
            optional_field("multiplier", $._expression),
        ),
        _union_struct_line: $ => seq(
            optional($._label),
            optional(choice(
                $.union_struct_member,
                alias($.union_struct_if_statement, $.if_statement),
                $.macro_invocation,
                $._expression_block,
                alias($._symbol, $.ambiguous_symbol),
            )),
            $._newline
        ),
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



        storage_allocator: $ => caseless(control_commands.storageAllocators),
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
    symbols: {
        identifier: _ => /(\.)?[a-zA-Z_][a-zA-Z0-9_@\$]*/,

        _single_symbol: $ => choice(
            $._reserved,
            $.identifier,
            prec(2, $.ident_call)
        ),
        _symbol: $ => choice(
            $._single_symbol,
            $.scoped_access,
            $.global_scope_access,
        ),

        scoped_access: $ => seq(
            $._single_symbol,
            rep1("::", $._single_symbol),
        ),
        global_scope_access: $ => seq(
            "#::",
            $._single_symbol,
            rep("::", $._single_symbol)
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
};

module.exports = grammar_();
