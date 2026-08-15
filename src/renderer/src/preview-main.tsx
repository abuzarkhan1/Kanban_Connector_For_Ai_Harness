import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { installPreviewApi, FIRST_PROJECT_ID } from './preview-mock'

/**
 * Dev-only browser entry (see preview.html + vite.preview.config.ts).
 *
 * The real app runs inside Electron, where the preload bridge injects
 * `window.api`. For a browser preview we install an in-memory mock before the
 * app module graph (which reads `window.api` at import time) is loaded, then
 * open the first project so the board renders immediately.
 */
async function bootstrap() {
  installPreviewApi()

  const { default: App } = await import('./App')
  const { useBoardStore } = await import('./stores/useBoardStore')

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  void useBoardStore.getState().selectProject(FIRST_PROJECT_ID)
}

void bootstrap()
