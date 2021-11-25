export const TEMPLATE_REGEX = /(static _template())([\s\S]+?)(\n  })/g;
export const CLASS_REGEX =
  /export default class (\w+) extends Lightning.Component {/g;
export const IMPORT_REGEX =
  /import { Lightning, Utils } from '@lightningjs\/sdk'/g;
export const RETURN_BLK_REGEX = /(return {)([\s\S]+?)(\n    })/g;
export const STRING_SPACES_REGEX = /([a-zA-Z0-9])[ ]([a-zA-Z0-9])/g;
export const GLOBAL_SPACES_REGEX = /\s/g;
export const REPLACE_QUOTES = ["Image", "Text", "Regular"];
export const TEMPLATE_REFERENCE_REGEX = /_template\(\)\.([\w]+)\./g;
export const MULTILINE_TEMPLATE_REFERENCE_REGEX = /_template\(\)[\s\S]+\.([\w]+)\./g;
