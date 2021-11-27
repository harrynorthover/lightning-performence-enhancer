import fs from 'fs-extra'

export const loadFile = (url) => {
  let _tmpFile = ''

  try {
    _tmpFile = fs.readFileSync(url, 'utf8')
  } catch (e) {
    console.log('Error:', e.stack)
  }

  return _tmpFile
}
