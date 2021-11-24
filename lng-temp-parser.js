import fs from 'fs-extra';
import meow from 'meow';

const TEMPLATE_REGEX = /(static _template())([\s\S]+?)(\n  })/g;
const RETURN_BLK_REGEX = /(return {)([\s\S]+?)(\n    })/g;
const STRING_SPACES_REGEX = /([a-zA-Z0-9])[ ]([a-zA-Z0-9])/g;
const GLOBAL_SPACES_REGEX = /\s/g;
const REPLACE_QUOTES = ['Image', 'Text', 'Regular'];

const newElements = [];
const newAddChildIds = [];
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

const generateTextBlock = ({ name, text, x, y, mountX = 1, mountY = 1 }) => {
  const textureName = `${name}Texture`;

  const _tmp = `
    const ${textureName} = new TextTexture(stage);
    ${textureName}.fontSize = FontFaceLightSize.P16;
    ${textureName}.fontStyle = FontWeight.LIGHT;
    ${textureName}.renderer = TextRenderer.Sensible;
    ${textureName}.text = {
      text: "${text.text}"
    };

    const ${name} = new Lightning.Element(stage);
    ${name}.texture = ${name}Texture;
    ${name}.mountX = ${mountX};
    ${name}.mountY = ${mountY};
    ${name}.x = ${x};
    ${name}.y = ${y};`;

  newAddChildIds.push(name);
  newElements.push(_tmp);
}

const insertElements = () => newElements.join('\n').trim();
const insertAddChild = () => newAddChildIds.map((elem, index) => index === 0 ? `this.childList.add(${elem})` : `    this.childList.add(${elem})` ).join('\n');

const generateLightningClass = (templateFile) => {
  const _constructor = `constructor(stage: Lightning.Stage) {
    super(stage);

    ${insertElements()}

    ${insertAddChild()}
  }`;

  newClass = templateFile.replace(TEMPLATE_REGEX, _constructor);
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

    if(element.type == 'Text') {
      generateTextBlock({
        name: elemName,
        ...element
      });
    }
  }

  generateLightningClass(templateFile);
  writeLightningClassToDisk();
};

parseTemplate();