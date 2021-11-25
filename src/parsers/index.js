import { generateTextBlock } from "./textBlock.js";
import { generateImageBlock } from "./imageBlock.js";

export const parseElement = ({
  element,
  newElements,
  newAddChildIds,
  newClassVariables,
}) => {
  switch (element.type) {
    case "Text":
      generateTextBlock(
        newElements,
        newAddChildIds,
        newClassVariables,
        element
      );
      break;

    case "Image":
      generateImageBlock(
        newElements,
        newAddChildIds,
        newClassVariables,
        element
      );
      break;
  }
};
