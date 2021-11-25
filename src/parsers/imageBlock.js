import { ELEMENT_IDENTIFIER, generateElementConstructor } from "../utils.js";

export const generateImageBlock = (
  elementCode,
  childListElements,
  classVariables,
  {
    name,
    src,
    x = 0,
    y = 0,
    alpha = 1,
    w,
    h,
    mountX = 1,
    mountY = 1,
    global = false,
  }
) => {
  const elementName = `${name}${ELEMENT_IDENTIFIER}`;

  if (global) {
    classVariables.push({ name: elementName, type: "Lightning.Element" });
  }

  const _tmpImg = `
    const ${elementName} = ${generateElementConstructor({
    name: elementName,
    global,
  })}
    ${elementName}.on('txLoaded', () => console.log(${elementName}, ' loaded'));
    ${elementName}.src = ${src};
    ${elementName}.x = ${x};
    ${elementName}.y = ${y};
    ${elementName}.w = ${w};
    ${elementName}.h = ${h};
    ${elementName}.alpha = ${alpha};`;

  childListElements.push(elementName);
  elementCode.push(_tmpImg);
};
