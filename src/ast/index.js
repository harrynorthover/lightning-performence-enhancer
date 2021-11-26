import { parse } from "@typescript-eslint/parser";
import { EXPORT_DEFAULT_DECLARATION, TEMPLATE_FUNC_IDENTIFIER, METHOD_DEFINITION, OBJECT_EXPRESSION, LITERAL_OBJECT, CALL_EXPRESSION } from './consts.js';

export const generateAST = (codeFile) => {
  const { body } = parse(codeFile);

  // const imports = body.filter((obj) => obj.type === "ImportDeclaration")[0];

  const functions = body
    .filter((obj) => obj.type === EXPORT_DEFAULT_DECLARATION)[0]
    .declaration.body.body.filter(
      (bodyElem) => (bodyElem.type = METHOD_DEFINITION)
    );

  const _templateFunc = functions.find((func) => func.key.name === TEMPLATE_FUNC_IDENTIFIER);
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
  if (oE.value.type === LITERAL_OBJECT) {
    return [oE.key.name, oE.value.value];
  }

  if (oE.value.type === CALL_EXPRESSION) {
    return parseCallExpression(oE);
  }

  if (oE.value.type === OBJECT_EXPRESSION) {
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
