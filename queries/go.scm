; function definitions
(function_declaration
  name: (identifier) @name
  body: (block) @body) @function

; method definitions
(method_declaration
  name: (field_identifier) @name
  body: (block) @body) @method

; function calls
(call_expression
  function: (identifier) @callee) @call

; if statements
(if_statement
  condition: (_) @cond) @condition

; for loops
(for_statement
  body: (_) @body) @loop
