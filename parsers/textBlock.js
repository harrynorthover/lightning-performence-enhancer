export const generateTextBlock = (newElements, newAddChildIds, newClassVariables, { name, text, x, y, mountX = 1, mountY = 1 }) => {
  const textureName = `${name}Texture`;

  const _tmp = `
    const ${textureName} = (this.${textureName} = new TextTexture(stage));
    ${textureName}.fontSize = FontFaceLightSize.P16;
    ${textureName}.fontStyle = FontWeight.LIGHT;
    ${textureName}.renderer = TextRenderer.Sensible;
    ${textureName}.text = {
      text: "${text.text}"
    };

    const ${name} = (this.${name} = new Lightning.Element(stage));
    ${name}.texture = ${name}Texture;
    ${name}.mountX = ${mountX};
    ${name}.mountY = ${mountY};
    ${name}.x = ${x};
    ${name}.y = ${y};`;
  
    newClassVariables.push({name: textureName, type: 'TextTexture'});
    newClassVariables.push({name, type: 'Lightning.Element'});
    newAddChildIds.push(name);
    newElements.push(_tmp);
}