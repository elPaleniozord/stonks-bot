const fs = require('fs')
const util = require('util')

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
const log_stdout = process.stdout

const logToFile = (d) => {
  log_file.write(util.format(d) + '\n')
  log_stdout.write(util.format(d) + '\n')
}

exports.logToFile = logToFile