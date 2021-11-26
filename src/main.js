import fs from "fs-extra";
import meow from "meow";
import { ESLint } from "eslint";

import { parseElement } from "./parsers/index.js";
import { config, helpText } from "../config/cli.js";
import { loadFile } from "./utils/loadFile.js";

import {
  insertAddChild,
  insertClassVariables,
  insertElements,
  insertImports,
} from "./utils.js";

import {
  TEMPLATE_REGEX,
  CLASS_REGEX,
  IMPORT_REGEX,
  MULTILINE_TEMPLATE_REFERENCE_REGEX,
} from "./regex.js";
import { generateAST } from "./ast/index.js";

const eslint = new ESLint();
const cli = meow(helpText, config);

const newElements = [];
const newAddChildIds = [];
const newClassVariables = [];

let newClass = '';

const generateLightningClass = (templateFile) => {
  const _importStatements = `import { Lightning, Utils } from '@lightningjs/sdk'
${insertImports(newElements)}`;

  const _classVariables = `export default class $1 extends Lightning.Component {
  ${insertClassVariables(newClassVariables)}  
  `;

  const _constructor = `constructor(stage: Lightning.Stage) {
    super(stage);

    ${insertElements(newElements)}

    ${insertAddChild(newAddChildIds)}
  }`;

  newClass = templateFile.replace(IMPORT_REGEX, _importStatements);
  newClass = newClass.replace(new RegExp(CLASS_REGEX, "g"), _classVariables);
  newClass = newClass.replace(TEMPLATE_REGEX, _constructor);

  /* Needs to be multiline based on linting rules currently set in the demo project */
  newClass = newClass.replace( new RegExp(MULTILINE_TEMPLATE_REFERENCE_REGEX, 'g'), `.$1Element.`);

  eslint.lintText(newClass).then((result) => {
    newClass = result[0].source;
    writeLightningClassToDisk();
  });
};

const writeLightningClassToDisk = () => {
  try {
    fs.outputFileSync(`${cli.input[1]}`, newClass, () =>
      console.log(`${cli.input[1]} written to disk`)
    );
  } catch (e) {
    console.log("writeFile error: ", e);
  }
};

const init = () => {
  const templateFile = loadFile(cli.input[0]);
  const templateElements = generateAST(templateFile);

  templateElements.forEach((element) =>
    parseElement({ element, newElements, newAddChildIds, newClassVariables })
  );

  generateLightningClass(templateFile);
};

init();
