; function declarations
(function_declaration
  name: (identifier) @name
  body: (statement_block) @body) @function

; method definitions in classes/interfaces
(method_definition
  name: (property_identifier) @name
  body: (statement_block) @body) @method

; arrow functions
(arrow_function
  body: (_) @body) @arrow

; function calls
(call_expression
  function: (identifier) @callee) @call

; method calls
(call_expression
  function: (member_expression
    property: (property_identifier) @callee)) @call

; if statements
(if_statement
  condition: (_) @cond) @condition

; for loops
(for_statement
  body: (statement_block) @body) @loop

; while loops
(while_statement
  body: (statement_block) @body) @loop
