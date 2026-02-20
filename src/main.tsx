import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
// @ts-ignore
import '@fontsource-variable/open-sans'
import '@radix-ui/themes/styles.css'
import './reset.css'
// app
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme panelBackground="translucent" radius="large" accentColor="gray" appearance="dark">
            <App />
        </Theme>
    </StrictMode>
)
