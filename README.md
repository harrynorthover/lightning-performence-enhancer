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
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }
  
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

export default class App extends Lightning.Component {
  private LogoElement: Lightning.Element;
  private TextElementTexture: TextTexture;
  private TextElement: Lightning.Element;  
  
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  constructor(stage: Lightning.Stage) {
    super(stage);

    const LogoElement = (this.LogoElement = new Lightning.Element(stage))
    LogoElement.on('txLoaded', () => console.log(LogoElement, ' loaded'));
    LogoElement.src = Utils.asset('images/logo.png');
    LogoElement.x = 960;
    LogoElement.y = 600;
    LogoElement.w = undefined;
    LogoElement.h = undefined;
    LogoElement.alpha = 1;

    const TextElementTexture = (this.TextElementTexture = new TextTexture(stage));
    TextElementTexture.fontSize = 64;
    TextElementTexture.fontStyle = 'Regular';
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

    const AnotherTextElementTexture = new TextTexture(stage);
    AnotherTextElementTexture.fontSize = 64;
    AnotherTextElementTexture.fontStyle = 'Regular';
    AnotherTextElementTexture.renderer = TextRenderer.Sensible;
    AnotherTextElementTexture.text = {
      text: "Let's start Building!"
    };

    const AnotherTextElement = new Lightning.Element(stage);
    AnotherTextElement.texture = AnotherTextElementTexture;
    AnotherTextElement.mountX = 1;
    AnotherTextElement.mountY = 1;
    AnotherTextElement.x = 960;
    AnotherTextElement.y = 720;

    this.childList.add(LogoElement);
    this.childList.add(TextElement);
    this.childList.add(AnotherTextElement);
  }

  _init() {
    this.TextElement.animation({
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

    this.LogoElement.animation({
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