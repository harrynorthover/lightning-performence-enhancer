export const generateImageBlock = (newElements, newAddChildIds, { name, src, x = 0, y = 0, alpha = 1, w, h, mountX = 1, mountY = 1 }) => {
  const _tmpImg = `
    const ${name} = (this.${name} = new Lightning.Element(stage));
    ${name}.on('txLoaded', () => console.log(${name}, ' loaded'));
    ${name}.w = ${w};
    ${name}.h = ${h};
    ${name}.alpha = ${alpha};`;

  newAddChildIds.push(name);
  newElements.push(_tmpImg);
}