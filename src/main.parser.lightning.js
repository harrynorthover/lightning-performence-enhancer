import fs, { write } from 'fs-extra'
import meow from 'meow'
import { parse } from '@typescript-eslint/parser'
import { parseElement } from './parsers/index.js'
import { ESLint } from 'eslint'

import {
  insertAddChild,
  insertClassVariables,
  insertElements,
  insertImports
} from './utils.js'

import {
  TEMPLATE_REGEX,
  CLASS_REGEX,
  IMPORT_REGEX,
  TEMPLATE_REFERENCE_REGEX,
  MULTILINE_TEMPLATE_REFERENCE_REGEX,
  RETURN_BLK_REGEX
} from './regex.js'
import { config, helpText } from '../config/cli.js'
import { getTemplateFunc } from '../parsers/lightning.template.js'

const newElements = []
const newAddChildIds = []
const newClassVariables = []
const eslint = new ESLint()

const newClass = []

const cli = meow(helpText, config)

const loadFile = (url) => {
  let _tmpFile = ''

  try {
    _tmpFile = fs.readFileSync(url, 'utf8')
  } catch (e) {
    console.log('Error:', e.stack)
  }

  return _tmpFile
}

const writeLightningClassToDisk = (data) => {
  try {
    fs.outputFileSync(`${cli.input[1]}`, data, () =>
      console.log(`${cli.input[1]} written to disk`)
    )
  } catch (e) {
    console.log('writeFile: ', e)
  }
}

const init = () => {
  const templateFile = loadFile(cli.input[0])
  const _tempFunc = templateFile.match(TEMPLATE_REGEX)[0]
  const _returnObj = _tempFunc.match(RETURN_BLK_REGEX)[0]
  const _fixedReturn = _returnObj.replace(/return /g, '')
  const obj = eval('(' + _fixedReturn + ')')

  const parsedTemp = getTemplateFunc(obj)

  const _constructor = `constructor(stage: Lightning.Stage) {
    super(stage);

    ${parsedTemp}
  }`

  const newClassString = templateFile.replace(TEMPLATE_REGEX, _constructor).replace(new RegExp(MULTILINE_TEMPLATE_REFERENCE_REGEX, 'g'), '$1Element.')

  eslint.lintText(newClassString).then((result) => {
    writeLightningClassToDisk(result[0].source)
  })
}

init()
