# lightning-performence-enhancer
Translates Lightning templates into more performant inline Typescript code.

Features includes:
 - Translating template elements to inline code.
 - Auto-generating class variables.
 - Auto-generating module imports. 

### Initial class using `static _template()`
---
```
import { Lightning, Utils } from '@lightningjs/sdk'

export default class App extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        type: 'Image',
        mountX: 0.5,
        mountY: 1,
        x: 960,
        y: 600,
        src: Utils.asset('images/logo.png'),
      },
      Text: {
        type: 'Text',
        mount: 0.5,
        x: 960,
        y: 720,
        text: {
          text: "Let's start Building!",
          fontFace: 'Regular',
          fontSize: 64,
          textColor: 0xbbffffff,
        },
      },
      AnotherText: {
        type: 'Text',
        mount: 0.5,
        x: 960,
        y: 720,
        text: {
          text: "Let's start Building!",
          fontFace: 'Regular',
          fontSize: 64,
          textColor: 0xbbffffff,
        },
      },
    }
  }

  _init() {
    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
          },
        ],
      })
      .start()
  }
}

```

### Typescript Output
---
```
import { Lightning, Utils } from '@lightningjs/sdk'
import { TextTexture } from 'src/lightning/textures/TextTexture'
import { TextRenderer } from 'src/lightning/textures/TextTexture'
import { FontFaceLightSize } from 'src/desin/fonts'
import { FontWeight } from 'src/desin/fonts'

export default class App extends Lightning.Component {
    private Logo: Lightning.Element;
    private TextElementTexture: TextTexture;
    private TextElement: Lightning.Element;
    private AnotherTextElementTexture: TextTexture;
    private AnotherTextElement: Lightning.Element;  
  
  constructor(stage: Lightning.Stage) {
    super(stage);

    const Logo = (this.Logo = new Lightning.Element(stage));
    Logo.on('txLoaded', () => console.log(Logo, ' loaded'));
    Logo.w = undefined;
    Logo.h = undefined;
    Logo.alpha = 1;

    const TextElementTexture = (this.TextElementTexture = new TextTexture(stage));
    TextElementTexture.fontSize = FontFaceLightSize.P16;
    TextElementTexture.fontStyle = FontWeight.LIGHT;
    TextElementTexture.renderer = TextRenderer.Sensible;
    TextElementTexture.text = {
      text: "Let's start Building!"
    };

    const TextElement = (this.TextElement = new Lightning.Element(stage));
    TextElement.texture = TextElementTexture;
    TextElement.mountX = 1;
    TextElement.mountY = 1;
    TextElement.x = 960;
    TextElement.y = 720;

    const AnotherTextElementTexture = (this.AnotherTextElementTexture = new TextTexture(stage));
    AnotherTextElementTexture.fontSize = FontFaceLightSize.P16;
    AnotherTextElementTexture.fontStyle = FontWeight.LIGHT;
    AnotherTextElementTexture.renderer = TextRenderer.Sensible;
    AnotherTextElementTexture.text = {
      text: "Let's start Building!"
    };

    const AnotherTextElement = (this.AnotherTextElement = new Lightning.Element(stage));
    AnotherTextElement.texture = AnotherTextElementTexture;
    AnotherTextElement.mountX = 1;
    AnotherTextElement.mountY = 1;
    AnotherTextElement.x = 960;
    AnotherTextElement.y = 720;

    this.childList.add(this.Logo);
    this.childList.add(TextElement);
    this.childList.add(AnotherTextElement);
  }

  _init() {
    this.tag('Background')
      .animation({
        duration: 15,
        repeat: -1,
        actions: [
          {
            t: '',
            p: 'color',
            v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
          },
        ],
      })
      .start()
  }
}

```