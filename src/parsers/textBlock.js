export const generateTextBlock = (newElements, newAddChildIds, newClassVariables, { name, text, x, y, mountX = 1, mountY = 1 }) => {
  const elementName = `${name}Element`;
  const textureName = `${elementName}Texture`;

  const _tmp = `
    const ${textureName} = (this.${textureName} = new TextTexture(stage));
    ${textureName}.fontSize = FontFaceLightSize.P16;
    ${textureName}.fontStyle = FontWeight.LIGHT;
    ${textureName}.renderer = TextRenderer.Sensible;
    ${textureName}.text = {
      text: "${text.text}"
    };

    const ${elementName} = (this.${elementName} = new Lightning.Element(stage));
    ${elementName}.texture = ${elementName}Texture;
    ${elementName}.mountX = ${mountX};
    ${elementName}.mountY = ${mountY};
    ${elementName}.x = ${x};
    ${elementName}.y = ${y};`;
  
    newClassVariables.push({name: textureName, type: 'TextTexture'});
    newClassVariables.push({name: elementName, type: 'Lightning.Element'});
    newAddChildIds.push(elementName);
    newElements.push(_tmp);
}