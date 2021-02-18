const fs = require('fs')
const util = require('util')

const log_file = fs.createWriteStream(__dirname, '/logs/debug.log', {flags: 'w'})
const log_stdout = process.stdout

export const logToFile = () => {
  log_file.write(util.format(d) + '\n')
  log_stdout.write(util.format(d) + '\n')
}