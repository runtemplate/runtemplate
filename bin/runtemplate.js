#! /usr/bin/env node

require('@babel/register')

const mod = require('./runtemplate-server')

module.exports = mod.default || mod
