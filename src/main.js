import fs from "fs-extra";
import meow from "meow";
import { parse } from "@typescript-eslint/parser";
import { parseElement } from "./parsers/index.js";
import { ESLint } from "eslint";

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
  TEMPLATE_REFERENCE_REGEX,
} from "./regex.js";
import { config, helpText } from "../config/cli.js";

const newElements = [];
const newAddChildIds = [];
const newClassVariables = [];
const eslint = new ESLint();

let newClass = [];

const cli = meow(helpText, config);

const loadFile = (url) => {
  let _tmpFile = "";

  try {
    _tmpFile = fs.readFileSync(url, "utf8");
  } catch (e) {
    console.log("Error:", e.stack);
  }

  return _tmpFile;
};

const generateAST = (codeFile) => {
  const { body } = parse(codeFile);

  // const imports = body.filter((obj) => obj.type === "ImportDeclaration")[0];

  const functions = body
    .filter((obj) => obj.type === "ExportDefaultDeclaration")[0]
    .declaration.body.body.filter(
      (bodyElem) => (bodyElem.type = "MethodDefinition")
    );

  const _templateFunc = functions.find((func) => func.key.name === "_template");
  const _templateElements =
    _templateFunc.value.body.body[0].argument.properties.map((prop) => {
      const _tmpProp = Object.fromEntries(
        new Map(prop.value.properties.map((p) => parseObject(p)))
      );

      return {
        name: prop.key.name,
        ..._tmpProp,
      };
    });

  return _templateElements;
};

const parseObject = (oE) => {
  if (oE.value.type === "Literal") {
    return [oE.key.name, oE.value.value];
  }

  if (oE.value.type === "CallExpression") {
    return parseCallExpression(oE);
  }

  if (oE.value.type === "ObjectExpression") {
    return [
      oE.key.name,
      Object.fromEntries(
        oE.value.properties.map((prop) => [prop.key.name, prop.value.value])
      ),
    ];
  }
};

const parseCallExpression = (cE) => {
  const _func = `${cE.value.callee.object.name}.${cE.value.callee.property.name}`;
  const _args = cE.value.arguments
    .map((arg) => {
      return arg.raw;
    })
    .join(", ");

  return [cE.key.name, `${_func}(${_args})`];
};

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
  newClass = newClass.replace(TEMPLATE_REFERENCE_REGEX, `$1Element.`);

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
    console.log("writeFile: ", e);
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
