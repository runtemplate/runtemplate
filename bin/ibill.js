#! /usr/bin/env node

require('@babel/register')

const mod = require('./ibill-server')

module.exports = mod.default || mod
