import { mount } from 'svelte'
import './app.css'
import '../node_modules/jsxgraph/distrib/jsxgraph.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
