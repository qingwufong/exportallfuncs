#!/usr/bin/env node
const recast = require('recast')
const {
    identifier: id,
    expressionStatement,
    memberExpression,
    assignmentExpression,
    arrowFunctionExpression
} = recast.types.builders

const fs = require('fs')
const path = require('path')
// get parameters
const options = process.argv.slice(2)
const rewriteMode = options.includes('-r') || options.includes('--rewrite')

// if has no parameters, either has -h or --help option input, print help message
if(options.length === 0 || options.includes('-h') || options.includes('--help')) {
    console.log(`
        use common.js rules, modify all funtions to export style in javascript file.
        options: '-r' or '--rewrite' option can be used to overwrite original file.
    `)
    proccess.exit(0)
}

// filter file name
const filterOption = options.filter(op => !['-r','--rewrite','-h','--help'].includes(op))

// only process one file
let filename = filterOption[0]

const writeASTFile = function(ast, filename, rewriteMode) {
    const newCode = recast.print(ast).code
    if(!rewriteMode) {
        // in not rewrite mode, new filename called like *.export.js
        filename = filename.split('.').slice(0, -1).concat(['export', 'js']).join('.')
    }
    // rewrite new code to new file
    fs.writeFileSync(path.join(process.cwd(), filename), newCode)
}

recast.run(function(ast, printSource) {
    // which use to save all function names
    let funcs = []
    recast.types.visit(ast, {
        // vist all function declaration
        visitFunctionDeclaration(path) {
            // get funtion name、params、block
            const node = path.node
            const func = node.id
            const params = node.params
            const body = node.body

            // save function name
            funcs.push(func.name)
            // exports.xxx = () => {}
            const replaceAstStruct = expressionStatement(assignmentExpression('=', memberExpression(id('exports'), func), arrowFunctionExpression(params, body)))
            // replace original function ast structure with new
            path.replace(replaceAstStruct)
            // stop traverse
            return false
        }
    })

    // print new ast
    // printSource(ast)

    recast.types.visit(ast, {
        visitCallExpression(path) {
            const node = path.node
            if(funcs.includes(node.callee.name)) {
                node.callee = memberExpression(id('exports'), node.callee)
            }
            return false
        }
    })

    writeASTFile(ast, filename, rewriteMode)
})
