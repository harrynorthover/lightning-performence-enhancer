import { ELEMENT_IDENTIFIER, generateElementConstructor } from '../utils.js'

export const generateTextBlock = (
  newElements,
  childListElements,
  classVariables,
  {
    name,
    text: { text, fontSize, fontFace },
    x = 0,
    y = 0,
    mountX = 1,
    mountY = 1,
    global = false
  }
) => {
  const elementName = `${name}${ELEMENT_IDENTIFIER}`
  const textureName = `${elementName}Texture`

  if (global) {
    classVariables.push({ name: textureName, type: 'TextTexture' })
    classVariables.push({ name: elementName, type: 'Lightning.Element' })
  }

  const _tmp = `
    const ${textureName} = ${generateElementConstructor({
    name: textureName,
    type: 'TextTexture',
    global
  })};
    ${textureName}.fontSize = ${fontSize};
    ${textureName}.fontStyle = '${fontFace}';
    ${textureName}.renderer = TextRenderer.Sensible;
    ${textureName}.text = {
      text: "${text}"
    };

    const ${elementName} = ${generateElementConstructor({
    name: elementName,
    global
  })};
    ${elementName}.texture = ${elementName}Texture;
    ${elementName}.mountX = ${mountX};
    ${elementName}.mountY = ${mountY};
    ${elementName}.x = ${x};
    ${elementName}.y = ${y};`

  childListElements.push(elementName)
  newElements.push(_tmp)
}
