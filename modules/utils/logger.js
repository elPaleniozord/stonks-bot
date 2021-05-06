const fs = require('fs')
const util = require('util')

const fileExists = (file) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, err => {
      err ? resolve(false) : resolve(true)
    })
  })
}

const logToFile = (data, name = 'log') => {
  const timestamp = new Date().toISOString().split('T')
  const path = `../../logs/${name}-${timestamp[0]}`
  const stream = fs.createWriteStream(path, {flags: 'a'})

  stream.write(data)
}

exports.logToFile = logToFile
exports.fileExists = fileExists