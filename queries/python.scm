; function definitions
(function_definition
  name: (identifier) @name
  body: (block) @body) @function

; function calls
(call
  function: (identifier) @callee) @call

; method calls (obj.method)
(call
  function: (attribute
    attribute: (identifier) @callee)) @call

; if statements
(if_statement
  condition: (_) @cond) @condition

; for loops
(for_statement
  body: (block) @body) @loop

; while loops
(while_statement
  body: (block) @body) @loop
