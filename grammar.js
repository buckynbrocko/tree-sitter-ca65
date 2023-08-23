const mnemonics = require("./src/components/mnemonics");
const pseudo_variables = require("./src/components/pseudo_variables");
const pseudo_functions = require("./src/components/pseudo_functions");
const control_commands = require("./src/components/control_commands");

module.exports = grammar({
    name: "ca65",
    conflicts: $ => [
        [$.nominal_pseudo_function_call, $.ident_call, $.blank_call],
        [$.macro_invocation, $._expression],
        [$.assignment_statement, $._expression],
        [$.unary_operator, $.pseudo_function],
        [$.unary_expression, $.binary_expression],
        // [$.pseudo_function, $.identifier],
    ],
    externals: _ => [],
    extras: $ => [
        // $.line_continue,
        $.c_comment,
        $.comment,
        $._spacing,
    ],
    inline: $ => [
        $.pseudo_function_call,
        // $._parenned_expression,
        // $.expression_list,
    ],
    precedences: _ => [
        [
            "unary_ops", // + - ~ < > ^ .bitnot .lobyte .hibyte .banknyte
            "muldiv", /* * / & ^  <<  >> .mod .bitand .bitxor .shl .shr */
            "addsub", // + - | .bitor
            "comparison_ops", // = <> < > <= >=
            "boolean_and_xor", // && .and .xor
            "boolean_or", // || .or
            "boolean_not", /* ! .not */
        ],
        [
            "pseudo-function",
            "identifier",
        ],
    ],
    supertypes: $ => [$.control_command],
    word: $ => $._word,
    rules: {
        source_file: $ => repeat($._line),
        _spacing: _ => / |\t/,
        _newline: _ => /\r?\n/,
        line_continue: _ => /\\\r?\n/,
        _code_unit: $ => choice(
            $._statement,
            $._expression,
        ),
        _line: $ => seq(optional($._label), optional($._code_unit), "\n"),
        block: $ => repeat1($._line),

        //---------------------------
        // Comments
        //---------------------------

        comment: _ => token.immediate(seq(
            ";",
            field("contents", /.*?/)
        )),
        // c_comment: _ => /\/\*[^(\*\/)]*?\*\/\r?\n/,
        c_comment: _ => token.immediate(seq(
            field("left", "/*"),
            field("contents", /[^(\*\/)]*?/),
            field("left", "*/"),
            /\r?\n/
        )),


        //---------------------------
        // Statements
        //---------------------------

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
        _parenned_expression: $ => seq("(", $._expression, ")"),
        _one_or_two_expressions: $ => seq($._expression, optional(seq(",", $._expression))),
        expression_list: $ => delimitted($._expression, ","),
        expressions: $ => repeat1($._expression),
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
            prec("boolean_or", caseInsensitive(".or")),
        ),
        _expression_block: $ => seq( // (For debugging purposes)
            "tree-sitter-expression-block-start", "\n",
            repeat(seq(optional($._expression), "\n")),
            "tree-sitter-expression-block-end",
        ),

        //---------------------------
        // Mnemonics & Instructions
        //---------------------------

        mnemonic: _ => caseInsensitive(mnemonics.common),
        instruction: $ => prec.right(3, seq(
            field("mnemonic", $.mnemonic),
            optional(field("address", $._addressing_mode)))
        ),

        //---------------------------
        // Labels
        //---------------------------

        _label: $ => choice($.label_declaration, $.cheap_label_declaration, $.unnamed_label),
        label_assignment: $ => seq(
            field("left", $._single_symbol),
            ":=",
            field("right", $._expression)),
        label_declaration: $ => prec.left(2, seq(
            field("name", $._single_symbol),
            ":")),
        cheap_label: $ => seq(
            choice("@", "?"),
            $._single_symbol
        ),
        cheap_label_declaration: $ => prec.left(2, seq(
            field("name", $.cheap_label),
            ":")
        ),

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
        _dollar_hex: _ => token.immediate(seq(
            field("base_symbol", "$"),
            field("digits", /[a-fA-F0-9]+(_?[a-fA-F0-9]+)*/)
        )),
        _h_hex: _ => token.immediate(seq(
            field("digits", /[a-fA-F0-9]+(_?[a-fA-F0-9]+)*/),
            field("base_symbol", /[hH]/),
        )),
        hex_literal: $ => choice(
            $._dollar_hex,
            $._h_hex,
        ),
        decimal_literal: _ => field("digits", /[0-9]+(_?[0-9]+)*/),
        binary_literal: $ => token.immediate(seq(
            field("base_symbol", "%"),
            field("digits", /[0-1]+(_?[0-1]+)*/))
        ),
        _number_literal: $ => choice(
            $.hex_literal,
            $.binary_literal,
            $.decimal_literal,
        ),
        string_literal: _ => token.immediate(seq(
            '"',
            field("contents", repeat(/[^"]/)), // TODO: escaping
            '"'
        )),


        //---------------------------
        // Pseudo Functions/Variables
        //---------------------------

        pseudo_variable: _ => caseInsensitive(pseudo_variables),

        pseudo_function: _ => caseInsensitive(pseudo_functions.nominal),
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

        blank_keyword: $ => caseInsensitive(".blank"),
        blank_call: $ => seq(
            alias($.blank_keyword, $.pseudo_function),
            "(",
            field("argument", choice(
                $._expression,
                seq("{", $._expression, "}"),
            )),
            ")"
        ),

        ident_keyword: $ => caseInsensitive(".ident"),
        ident_call: $ => seq(
            field("name", alias($.ident_keyword, $.pseudo_function)),
            // $.ident_keyword,
            field("argument", seq("(", $._expression, ")"))
        ),

        //---------------------------
        // Control Commands
        //---------------------------

        control_command: $ => choice(
            $.nominal_control_command,
            $._exceptional_control_command,
        ),
        nominal_control_command: $ => prec.right(seq(
            field("name", alias(caseInsensitive(control_commands.nominal), $.command)),
            optional(field("arguments", $.expression_list))
        )),
        _exceptional_control_command: $ => choice(
            $.assert_command,
            $.feature_command,
            $.repeat_command,
            $.feature_toggle_command,
            $.enum_declaration,
            $.macro_declaration,
            $.proc_declaration,
            $.scope_declaration,
            $.condes_statement,
            $.if_statement,
        ),

        assert_command: $ => seq(
            field("command", ".assert"),
            $._expression, ",",
            alias(/warning|error|ldwarning|lderror/, $.action_specifier),
            optional(seq(",", $._expression))
        ),

        condes_statement: $ => seq(
            field("command", ".condes"),
            $._expression, ",",
            alias(/constructor|destructor|[0-6]/, $.condes_type),
            optional(seq(',', $._expression))
        ),

        enum_declaration: $ => seq(
            field("command", ".enum"),
            optional(field("name", $._single_symbol)), "\n",
            repeat(seq(optional(seq($._single_symbol, optional(seq("=", $._expression)))), "\n")),
            // field("body", optional($.block)),
            ".endenum",
        ),

        feature_toggle_command: $ => seq(
            field("command", caseInsensitive(control_commands.togglableFeatures)),
            optional(choice(
                alias("+", $.plus),
                alias("-", $.minus),
                alias("on", $.on),
                alias("off", $.off),
            ))
        ),

        feature_command: $ => seq(
            field("command", caseInsensitive(".feature")),
            $._feature,
            repeat(seq(",", $._feature))
        ),
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
        _feature_name: $ => caseInsensitive(control_commands.compatibilityFeatures),


        if_keyword: $ => caseInsensitive(control_commands.ifKeywords),
        if_statement: $ => seq(
            field("if_type", alias($.if_keyword, $.command)),
            optional(field("condition", $._expression)),
            "\n",
            field("body", optional($.block)),
            repeat($.elseif),
            optional($.else),
            alias(".endif", $.command)
        ),
        else: $ => seq(
            alias(".else", $.command),
            "\n",
            field("body", optional($.block))
        ),
        elseif: $ => seq(
            alias(".elseif", $.command),
            field("condition", $._expression),
            "\n",
            optional($.block)),

        macro_parameters: $ => seq($._single_symbol, repeat(seq(",", $._single_symbol))),
        macro_declaration: $ => seq(
            field("command", ".macro"),
            field("name", $._single_symbol),
            field("parameters", optional($.macro_parameters)), "\n",
            field("body", optional($.block)),
            alias(".endmacro", $.command)
        ),
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
            field("name", $._symbol),
            $._expression,
            repeat(seq(",", $._expression))
            // repeat($.macro_arguments),
        ),

        proc_declaration: $ => seq(
            field("command", ".proc"), $._single_symbol, "\n",
            field("body", optional($.block)),
            ".endproc"
        ),

        repeat_command: $ => seq(
            field("command", ".repeat"),
            $._one_or_two_expressions,
            "\n",
            $.block,
            ".endrepeat"),

        scope_declaration: $ => seq(
            field("field", ".scope"), field("name", $._single_symbol), "\n",
            field("body", optional($.block)),
            ".endscope"
        ),

        struct_declaration: $ => seq(
            field("command", ".struct"), optional($._single_symbol), "\n",
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

        storage_allocator: $ => field("size", caseInsensitive(control_commands.storageAllocators)),



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
        indirect_x: $ => choice(
            seq("(", $._expression, ",", $.x, ")"),
            seq("[", $._expression, ",", $.x, "]"),
        ),
        indirect_y: $ => choice(
            seq("(", $._expression, ")", ",", $.y),
            seq("[", $._expression, "]", ",", $.y),
        ),


        // ---------------------------
        // (de)priority Hell / Symbols
        // ---------------------------

        // identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
        // identifier: _ => prec.left("identifier", /(\.)?[a-zA-Z_][a-zA-Z0-9_@\$]*/),
        identifier: _ => /(\.)?[a-zA-Z_][a-zA-Z0-9_@\$]*/,

        _single_symbol: $ => choice(
            $.identifier,
            // $._reserved,
            prec(2, $.ident_call)
        ),
        _symbol: $ => choice(
            $._single_symbol,
            $.scoped_access,
            $.global_scope_access,
        ),

        scoped_access: $ => seq($._single_symbol, repeat1(seq("::", $._single_symbol))),
        global_scope_access: $ => seq("#::", $._single_symbol, repeat(seq("::", $._single_symbol))),

        _word: _ => /(\.|\$)?[a-zA-Z_][a-zA-Z0-9_@\$]*/,

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
