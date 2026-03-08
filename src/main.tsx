import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import { Toaster } from 'sonner'
// @ts-ignore
import '@fontsource-variable/open-sans'
import '@radix-ui/themes/styles.css'
import './reset.css'
// app
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme panelBackground="translucent" radius="large" accentColor="amber" appearance="dark">
            <App />
            <Toaster position="top-right" theme="dark" />
        </Theme>
    </StrictMode>
)
