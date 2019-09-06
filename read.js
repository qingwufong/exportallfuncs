#!/usr/bin/env node
const recast = require('recast')
const TNT = recast.types.namedTypes

recast.run(function(ast, printSource) {
    recast.visit(ast, {
        visitExpressionStatement: function(path) {
            const node = path.node
            printSource(node) // print expression statement
            this.traverse(path)
        }
    })
})