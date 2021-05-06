const fs = require('fs')
const {logToFile, fileExists} = require('./logger')

describe('Should handle basic file operations', () => {
  logToFile('TEST STRING')
  const timestamp = new Date().toISOString().split('T')
  const path = __dirname + `logs/log-${timestamp[0]}`

  test('Should create new file with appropriate timestamp', () => {
    fileExists(path, res => {
      expect(res).toBe(true)
    })
  })

  test('Should write to file correctly', () => {
    fs.readFile(path, res => {
      console.log('FILE READ: ', res)
      expect(res).toBe('TEST STRING')
    })
  })

  test('Should update file correctly', () => {
    logToFile('TEST STRING 2')
    fs.readFile(path, res => {
      expect(res).toBe('TEST STRING TEST STRING 2')
    })
  })

  test('Should delete file correctly', () => {
    fs.unlink(path, () => {
      fileExists(path).then(res => {
        expect(res).toBe(false)
      })
    })
  })
})
