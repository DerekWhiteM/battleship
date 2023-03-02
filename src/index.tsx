import { createRoot } from 'react-dom/client'
import React from 'react'

function App () {
    return <p>Test</p>
}

const domContainer = document.querySelector('#root')
if (!domContainer) throw('Dom container missing')
const root = createRoot(domContainer)
root.render(<App />)