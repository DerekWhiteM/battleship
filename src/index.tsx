import { createRoot } from 'react-dom/client';
import App from './components/App';
import React from 'react';

const domContainer = document.getElementById('root');
if (!domContainer) throw('No dom container');
const root = createRoot(domContainer);
root.render(<React.StrictMode><App/></React.StrictMode>);