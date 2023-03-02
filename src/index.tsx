import { createRoot } from 'react-dom/client'
import App from './App'

const domContainer = document.getElementById('root')
if (!domContainer) throw('Missing dom container')
const root = createRoot(domContainer)
root.render(<App/>)