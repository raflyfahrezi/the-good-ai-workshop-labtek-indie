import { mount } from 'svelte'
// Fonts are bundled with the build so the demo works offline during the session
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/600.css'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
