/* eslint-disable */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const deleteFile = promisify(fs.unlink)
const deleteFolder = promisify(fs.rmdir)
const stats = promisify(fs.lstat)
const serviceNames = ['bayi-auth-service', 'bayi-credit-service', 'token-service']
const willBeDeletedFileList = [
  '.openapi-generator',
  'git_push.sh',
  '.openapi-generator-ignore',
  '.gitignore',
]
const fileList = ['api.ts', 'base.ts', 'configuration.ts', 'index.ts']
const addAbsolutePath = (directoryName, fileName) =>
  path.resolve(__dirname, '../src/services/' + directoryName, fileName)
const deleteFiles = async (serviceName = '') => {
  const willBeDeletedFileListUpdated = [...willBeDeletedFileList, serviceName + '.yml']
  await willBeDeletedFileListUpdated
    .map((fileName) => addAbsolutePath(serviceName, fileName))
    .map(async (file) => {
      let fileStats
      try {
        fileStats = await stats(file)
      } catch (err) {
        // file doesn't exist
        return Promise.resolve()
      }
      if (fileStats.isDirectory()) {
        return deleteFolder(file, { recursive: true })
      } else {
        return deleteFile(file)
      }
    })
  console.log(`[DELETE] ${serviceName} / ${willBeDeletedFileListUpdated.join(', ')} are deleted.`)
}
const addEslintAndTsDisable = async (filePath) => {
  const data = await readFile(filePath, 'utf-8')
  const commentAddedData = `/* eslint-disable */
// @ts-nocheck
${data}
`
  return writeFile(filePath, commentAddedData)
}
const eslint = async (serviceName = '') => {
  await fileList
    .map((fileName) => addAbsolutePath(serviceName, fileName))
    .map(addEslintAndTsDisable)
  console.log(`[ESLINT] ${serviceName} / ${fileList.join(', ')} disabled from eslint.`)
}
const main = async () => {
  serviceNames.map((serviceName) => {
    eslint(serviceName)
    deleteFiles(serviceName)
  })
}
main()
