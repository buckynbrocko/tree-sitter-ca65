(label_declaration
    name: (identifier) @label.declaration
)

(cheap_label_declaration
    name: (cheap_label) @cheap_label.declaration
)

(label_assignment
    left: (identifier) @label.declaration
)

(assignment_statement
    left: [
        (identifier)
        (qualified_symbol)
        ] @variable.declaration
)

(set_statement
    left: [
        (identifier)
        (qualified_symbol)
    ] @variable.declaration
)

(enum_declaration
    name: (identifier) @enum.declaration
)

(macro_declaration
    name: (identifier) @macro.declaration
    parameters: (macro_parameters
        (identifier)* @parameter.declaration
        (
            ","
            (identifier) @parameter.declaration
        )*
    )?
)

(proc_declaration
    name: (identifier) @proc.declaration
)

(scope_declaration
    name: (identifier) @scope.declaration
)

(struct_declaration
    name: (identifier) @struct.declaration
    (union_struct_member
        name: (identifier) @struct.member.declaration
    )*
)

(union_declaration
    name: (identifier) @union.declaration
    (union_struct_member
        name: (identifier) @union.member.declaration
    )*
)

(ERROR) @parsing_errorstruct
