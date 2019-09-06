const recast = require('recast')
const { variableDeclaration, variableDeclarator, functionExpression } = recast.types.builders // "moulds: for changing code"

const code = `
    function multiply(a, b) {
        // return the result of a multiply b
        return (a * b)
    }
`
// parse code
const ast = recast.parse(code)
// get parse code
const multiply = ast.program.body[0]
// print
console.log(multiply)

/**
 * print result like this: FunctionDeclaration
 */
// FunctionDeclaration {
//     type: 'FunctionDeclaration',
//     id:
//      Identifier {
//        type: 'Identifier',
//        name: 'multiply',
//        loc:
//         { start: [Object],
//           end: [Object],
//           lines: [Lines],
//           tokens: [Array],
//           indent: 4 } },
//     params:
//      [ Identifier { type: 'Identifier', name: 'a', loc: [Object] },
//        Identifier { type: 'Identifier', name: 'b', loc: [Object] } ],
//     body:
//      BlockStatement {
//        type: 'BlockStatement',
//        body: [ [ReturnStatement] ],
//        loc:
//         { start: [Object],
//           end: [Object],
//           lines: [Lines],
//           tokens: [Array],
//           indent: 4 } },
//     generator: false,
//     expression: false,
//     async: false,
//     loc:
//      { start: { line: 2, column: 4, token: 0 },
//        end: { line: 5, column: 5, token: 15 },
//        lines:
//         Lines {
//           infos: [Array],
//           mappings: [],
//           cachedSourceMap: null,
//           cachedTabWidth: undefined,
//           length: 6,
//           name: null },
//        tokens:
//         [ [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object],
//           [Object] 
//         ],
//        indent: 4 
//     } 
// }

// use ast to convert function declaration to function expression,
// like const multiply = function(a, b) { return (a * b) }
ast.program.body[0] = variableDeclaration("const", [
    variableDeclarator(multiply.id, functionExpression(
    null, // Anonymize the function expression.
    multiply.params,
    multiply.body
    ))
])

// revert to source code
const output = recast.print(ast).code
// beauty ouptput code with two tab width
const formatOutput = recast.prettyPrint(ast, { tabWidth: 2 }).code
console.log(output)
console.log(formatOutput)

