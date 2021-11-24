/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Utils } from '@lightningjs/sdk'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  constructor(stage: Lightning.Stage) {
    super(stage);

    const TextTexture = new TextTexture(stage);
    TextTexture.fontSize = FontFaceLightSize.P16;
    TextTexture.fontStyle = FontWeight.LIGHT;
    TextTexture.renderer = TextRenderer.Sensible;
    TextTexture.text = {
      text: "Let's start Building!"
    };

    const Text = new Lightning.Element(stage);
    Text.texture = TextTexture;
    Text.mountX = 1;
    Text.mountY = 1;
    Text.x = 960;
    Text.y = 720;

    const AnotherTextTexture = new TextTexture(stage);
    AnotherTextTexture.fontSize = FontFaceLightSize.P16;
    AnotherTextTexture.fontStyle = FontWeight.LIGHT;
    AnotherTextTexture.renderer = TextRenderer.Sensible;
    AnotherTextTexture.text = {
      text: "Let's start Building!"
    };

    const AnotherText = new Lightning.Element(stage);
    AnotherText.texture = AnotherTextTexture;
    AnotherText.mountX = 1;
    AnotherText.mountY = 1;
    AnotherText.x = 960;
    AnotherText.y = 720;

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
