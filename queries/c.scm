; function definitions (direct)
(function_definition
  declarator: (function_declarator
    declarator: (identifier) @name)
  body: (compound_statement) @body) @function

; function definitions (pointer return type, e.g. char* fn())
(function_definition
  declarator: (pointer_declarator
    declarator: (function_declarator
      declarator: (identifier) @name))
  body: (compound_statement) @body) @function

; function calls
(call_expression
  function: (identifier) @callee) @call

; if statements
(if_statement
  condition: (_) @cond) @condition

; for loops
(for_statement
  body: (compound_statement) @body) @loop

; while loops
(while_statement
  body: (compound_statement) @body) @loop
