; function definitions
(function_definition
  type: (_)
  declarator: (function_declarator
    declarator: (identifier) @name)
  body: (compound_statement) @body) @function

; function calls
(call_expression
  function: (identifier) @callee) @call

; method calls (obj.method())
(call_expression
  function: (field_expression
    field: (field_identifier) @callee)) @call

; if statements
(if_statement
  condition: (_) @cond) @condition

; for range loops
(for_range_loop
  body: (compound_statement) @body) @loop

; for statements
(for_statement
  body: (compound_statement) @body) @loop

; while loops
(while_statement
  body: (compound_statement) @body) @loop
