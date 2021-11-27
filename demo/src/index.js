import { Launch } from '@lightningjs/sdk'
import App from './App.parsed.ts'

export default function() {
  return Launch(App, ...arguments)
}
