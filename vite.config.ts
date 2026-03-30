import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

const manifest = {
    name: 'Pre-renewal RO MVP Tracking',
    short_name: 'MVP Tracker',
    description: 'Track MVP respawn timers for Pre-renewal Ragnarok Online',
    start_url: '/',
    scope: '/',
    background_color: '#000000',
    theme_color: '#ffca16',
    icons: [
        {
            src: '/192x192.png',
            sizes: '192x192',
            type: 'image/png',
        },
        {
            src: '/512x512.png',
            sizes: '512x512',
            type: 'image/png',
        },
        {
            src: '/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
        },
    ],
}

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        VitePWA({
            manifest,
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['mvps/*.png'],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
})

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDjzeLZlLxP59YRI2AZOFrtOMaN_W0Z1R8",
//     authDomain: "mvp-tracking-e104b.firebaseapp.com",
//     projectId: "mvp-tracking-e104b",
//     storageBucket: "mvp-tracking-e104b.firebasestorage.app",
//     messagingSenderId: "517716272669",
//     appId: "1:517716272669:web:86e400a17470e309a008f4"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
