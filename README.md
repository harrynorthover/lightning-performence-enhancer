# lightning-performence-enhancer
Translates Lightning templates into more performant inline Typescript code.

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

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  constructor(stage: Lightning.Stage) {
    super(stage);

    const Logo = (this.Logo = new Lightning.Element(stage));
    Logo.on('txLoaded', () => console.log(Logo, ' loaded'));
    Logo.w = undefined;
    Logo.h = undefined;
    Logo.alpha = 1;

    const TextTexture = (this.TextTexture = new TextTexture(stage));
    TextTexture.fontSize = FontFaceLightSize.P16;
    TextTexture.fontStyle = FontWeight.LIGHT;
    TextTexture.renderer = TextRenderer.Sensible;
    TextTexture.text = {
      text: "Let's start Building!"
    };

    const Text = (this.Text = new Lightning.Element(stage));
    Text.texture = TextTexture;
    Text.mountX = 1;
    Text.mountY = 1;
    Text.x = 960;
    Text.y = 720;

    const AnotherTextTexture = (this.AnotherTextTexture = new TextTexture(stage));
    AnotherTextTexture.fontSize = FontFaceLightSize.P16;
    AnotherTextTexture.fontStyle = FontWeight.LIGHT;
    AnotherTextTexture.renderer = TextRenderer.Sensible;
    AnotherTextTexture.text = {
      text: "Let's start Building!"
    };

    const AnotherText = (this.AnotherText = new Lightning.Element(stage));
    AnotherText.texture = AnotherTextTexture;
    AnotherText.mountX = 1;
    AnotherText.mountY = 1;
    AnotherText.x = 960;
    AnotherText.y = 720;

    this.childList.add(Logo)
    this.childList.add(Text)
    this.childList.add(AnotherText)
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