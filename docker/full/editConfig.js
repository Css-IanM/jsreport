const fs = require('fs')

const config = JSON.parse(fs.readFileSync('jsreport.config.json').toString())
config.extensions.scripts.allowedModules = ['handlebars-helpers', 'https', 'lodash', 'moment']
delete config.extensions['sample-template']
delete config.extensions['authentication']
fs.writeFileSync('jsreport.config.json', JSON.stringify(config))
