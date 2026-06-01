; method definitions
(method_declaration
  name: (identifier) @name
  body: (block) @body) @function

; method calls (bar())
(method_invocation
  name: (identifier) @callee) @call

; method calls on objects (obj.method())
(method_invocation
  object: (_)
  name: (identifier) @callee) @call

; if statements
(if_statement
  condition: (_) @cond) @condition

; for loops
(for_statement
  body: (block) @body) @loop

; while loops
(while_statement
  body: (block) @body) @loop
