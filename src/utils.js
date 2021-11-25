import moduleImports from "../config/modules.js";

export const ELEMENT_IDENTIFIER = "Element";

export const generateElementConstructor = ({
  name,
  type = "Lightning.Element",
  global = false,
}) => (global ? `(this.${name} = new ${type}(stage))` : `new ${type}(stage)`);

export const insertElements = (newElements) => newElements.join("\n").trim();

export const insertAddChild = (newAddChildIds) =>
  newAddChildIds
    .map((elem, index) =>
      index === 0
        ? `this.childList.add(${elem});`
        : `    this.childList.add(${elem});`
    )
    .join("\n");

export const insertClassVariables = (newClassVariables) =>
  newClassVariables
    .map(({ name, type }, index) =>
      index === 0 ? `private ${name}: ${type};` : `  private ${name}: ${type};`
    )
    .join("\n");

export const generateImportStatement = (module, location) =>
  `import { ${module} } from '${location}'`;

export const insertImports = (newElements) => {
  const newElementCode = insertElements(newElements);
  let modulesToImport = [];

  moduleImports.forEach(({ module, location }) => {
    if (newElementCode.includes(module)) {
      modulesToImport.push(generateImportStatement(module, location));
    }
  });

  return [...new Set(modulesToImport)].join("\n");
};
