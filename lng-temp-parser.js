import fs from 'fs-extra';
import meow from 'meow';
import { generateTextBlock } from './parsers/textBlock.js'
import { generateImageBlock } from './parsers/imageBlock.js'

const TEMPLATE_REGEX = /(static _template())([\s\S]+?)(\n  })/g;
const CLASS_REGEX = /export default class (\w+) extends Lightning.Component {/g;
const RETURN_BLK_REGEX = /(return {)([\s\S]+?)(\n    })/g;
const STRING_SPACES_REGEX = /([a-zA-Z0-9])[ ]([a-zA-Z0-9])/g;
const GLOBAL_SPACES_REGEX = /\s/g;
const REPLACE_QUOTES = ['Image', 'Text', 'Regular'];

const newElements = [];
const newAddChildIds = [];
const newClassVariables = [];
let newClass = [];

const cli = meow(`
	Usage
	  $ node lng-temp-parser <input>

	Options
	  none

	Examples
	  $ node lng-temp-parser './LightningTemplateDemo/src/App.js ./LightningTemplateDemo/src/App.parsed.ts'
`, {
	importMeta: import.meta,
	flags: {
		rainbow: {
			type: 'boolean',
			alias: 'r'
		}
	}
});

const insertElements = () => newElements.join('\n').trim();
const insertAddChild = () => newAddChildIds.map((elem, index) => index === 0 ? `this.childList.add(${elem});` : `    this.childList.add(${elem});` ).join('\n');
const insertClassVariables = () => newClassVariables.map(({name, type}, index) => index === 0 ? `private ${name}: ${type};` : `    private ${name}: ${type};` ).join('\n');

const generateLightningClass = (templateFile) => {
  const _classVariables = `export default class $1 extends Lightning.Component {
    ${insertClassVariables()}  
  `

  console.log('_classVariables: ', _classVariables);

  const _constructor = `constructor(stage: Lightning.Stage) {
    super(stage);

    ${insertElements()}

    ${insertAddChild()}
  }`;

  newClass = templateFile.replace( new RegExp(CLASS_REGEX, "g"), _classVariables);
  newClass = newClass.replace(TEMPLATE_REGEX, _constructor);
}
const writeLightningClassToDisk = () => {
  try {
    fs.outputFileSync(`${cli.input[1]}`, newClass, () => console.log(`${cli.input[1]} written to disk`));
  } catch (e) {
    console.log('writeFile: ', e);
  }
}

const parseTemplate = () => {
  const url = cli.input[0];
  let templateFile = "";

  try {
    templateFile = fs.readFileSync(url, 'utf8')
  } catch(e) {
    console.log('Error:', e.stack);
  }

  let template = templateFile.match(TEMPLATE_REGEX)[0];
  template = template.replace('static _template() ', '');

  let templateObj = template.match(RETURN_BLK_REGEX)[0];
  templateObj = templateObj.replace('return ', '');
  templateObj = templateObj.replace(STRING_SPACES_REGEX, '$1#s#$2');
  templateObj = templateObj.replace(GLOBAL_SPACES_REGEX, '');
  templateObj = templateObj.replace(/#s#/g, ' ');
  templateObj = templateObj.replace("'Regular'", '"Regular"');

  REPLACE_QUOTES.forEach(str => templateObj = templateObj.replace( new RegExp(`'${str}'`,'g'), `"${str}"`))

  templateObj = templateObj.replace(/,}/g, '}');
  templateObj = templateObj.replace(/(0x[a-zA-Z0-9]+)/g, '"$1"');
  templateObj = templateObj.replace(/(Utils.asset\([\S\s]+\))/g, '"$1"');
  templateObj = templateObj.replace(/([A-Za-z0-9_-]+?):/g, '"$1":');
  templateObj = JSON.parse(templateObj.trim());

  for(const elemName in templateObj) {
    const element = templateObj[elemName];

    const params = {
      name: elemName,
      ...element
    }

    switch(element.type) {
      case 'Text':
        generateTextBlock(newElements, newAddChildIds, newClassVariables, params);
        break;

      case 'Image':
        generateImageBlock(newElements, newAddChildIds, newClassVariables, params);
        break;
    }
  }

  generateLightningClass(templateFile);
  writeLightningClassToDisk();
};

parseTemplate();