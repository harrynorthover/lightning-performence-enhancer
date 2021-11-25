export const helpText = `
	Usage
	  $ node lng-temp-parser <input>

	Options
	  none

	Examples
	  $ node lng-temp-parser './LightningTemplateDemo/src/App.js ./LightningTemplateDemo/src/App.parsed.ts'
`;

export const config = {
  importMeta: import.meta,
  flags: {
    rainbow: {
      type: "boolean",
      alias: "r",
    },
  },
};
