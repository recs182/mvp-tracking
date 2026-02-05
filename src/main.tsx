import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-ignore
import '@fontsource-variable/open-sans'
import './reset.css'
import Router from './Router.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router />
    </StrictMode>
)
