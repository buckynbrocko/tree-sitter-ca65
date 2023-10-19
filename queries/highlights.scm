[
    (comment)
    (c_comment)
] @comment

(binary_expression operator: _ @operator)
(unary_expression operator: _ @operator)
(assignment_statement
    left: (identifier)? @constant
    "=" @operator)

(string_literal) @string

[
    (unnamed_label_plus)
    (unnamed_label_minus)
] @variable

[
    (hex_literal)
    (decimal_literal)
    (binary_literal)
] @number

; (identifier) @tag

(scoped_access
    (_)
    ("::" (_) @attribute))
(global_scope_access
    (_) @attribute
    ("::" (_) @attribute))

(immediate_mode
    "#" @operator)

[
    (a)
    (f)
    (sp)
    (x)
    (y)
    (z)
    (PC)
] @variable.builtin

(mnemonic) @function.builtin @mnemonic 

(label_declaration
    name: (identifier) @constant @label-name)

(label_assignment
    left: (identifier)? @constant
    ":=" @operator)
(cheap_label
    (identifier) @constant)

(storage_allocator) @type
(pseudo_variable) @constant
(pseudo_function) @function.builtin



(command) @keyword @command

(macro_declaration
    name: (_) @function
    (macro_parameters
        (_) @variable.parameter @parameter-name)
    body: (block
        (_
            (identifier) @variable.parameter
            (#any-eq? @variable.parameter @parameter-name)
            )*
        )?
    )

(macro_invocation
    name: (identifier) @function)

(struct_declaration
    name: (_)? @type
    )

(union_declaration
    name: (_)? @type
    )

(union_struct_member
    name: (_)? @property
    size: (_) @type
    )

