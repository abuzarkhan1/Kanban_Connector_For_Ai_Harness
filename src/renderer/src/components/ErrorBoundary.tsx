import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertIcon } from './icons'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught React render error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = (): void => {
    window.location.reload()
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-canvas p-6 text-snow">
          <div className="w-full max-w-lg rounded-lg border border-red-500/30 bg-surface p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-red-500/10 text-red-400">
                <AlertIcon size="lg" animate="pulse-slow" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-snow">An unexpected error occurred</h2>
                <p className="text-xs text-ash">The application caught a runtime rendering failure</p>
              </div>
            </div>

            {this.state.error && (
              <div className="mt-4 max-h-48 overflow-auto rounded bg-canvas/80 p-3 font-mono text-xs text-red-300">
                {this.state.error.message}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-md border border-line bg-surface-elevated px-3 py-1.5 text-xs font-medium text-snow hover:bg-surface-card"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-canvas hover:bg-snow"
              >
                Reload Window
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
