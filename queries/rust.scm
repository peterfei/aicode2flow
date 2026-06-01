; function definitions
(function_item
  name: (identifier) @name
  body: (block) @body) @function

; function calls
(call_expression
  function: (identifier) @callee) @call

; method calls
(call_expression
  function: (field_expression
    field: (field_identifier) @callee)) @call

; if expressions
(if_expression
  condition: (_) @cond) @condition

; for loops
(for_expression
  body: (block) @body) @loop

; while loops
(while_expression
  body: (block) @body) @loop

; loop expressions
(loop_expression
  body: (block) @body) @loop
