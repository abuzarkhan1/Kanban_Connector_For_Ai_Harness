import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertIcon } from './icons'
import { Button } from './ui'

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
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-canvas p-6 text-ink">
          <div className="w-full max-w-lg rounded-lg border border-status-danger-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md border border-status-danger-border bg-surface-elevated text-status-danger">
                <AlertIcon size="lg" animate="pulse-slow" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">An unexpected error occurred</h2>
                <p className="text-xs text-ash">The application caught a runtime rendering failure</p>
              </div>
            </div>

            {this.state.error && (
              <div className="mt-4 max-h-48 overflow-auto rounded-md border border-hairline bg-canvas p-3 font-mono text-xs text-body">
                {this.state.error.message}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={this.handleReload}
              >
                Reload Window
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
