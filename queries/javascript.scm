; function declarations
(function_declaration
  name: (identifier) @name
  body: (statement_block) @body) @function

; arrow functions assigned to variables
(variable_declarator
  name: (identifier) @name
  value: (arrow_function
    body: (_) @body)) @arrow

; method definitions in classes
(method_definition
  name: (property_identifier) @name
  body: (statement_block) @body) @method

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
