import { useEffect } from 'react'
import { api } from './api/client'
import { useBoardStore, type NavigationView } from './stores/useBoardStore'
import { Sidebar } from './components/Sidebar'
import { Board } from './components/Board'
import { TaskDetail } from './components/TaskDetail'
import { AppNavigation } from './components/Navigation/AppNavigation'
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard'
import { RepositoryManager } from './components/Repositories/RepositoryManager'
import { AgentMonitor } from './components/Agents/AgentMonitor'
import { ActivityTimeline } from './components/Timeline/ActivityTimeline'
import { McpSettings } from './components/Settings/McpSettings'
import { DiagnosticsView } from './components/Diagnostics/DiagnosticsView'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BrandMark } from './components/ui'
import { ToastContainer } from './components/Toast'
import { useToastStore } from './stores/useToastStore'

function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex max-w-sm flex-col items-center px-6 text-center">
        <div className="grid size-12 place-items-center rounded-lg border border-hairline bg-surface text-mute">
          <BrandMark className="size-6" />
        </div>
        <h2 className="mt-4 text-[15px] font-medium tracking-tight text-ink">No project selected</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-mute">
          Create a project in the sidebar, or select one from the list to open its Kanban board.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const loadProjects = useBoardStore((s) => s.loadProjects)
  const selectedProjectId = useBoardStore((s) => s.selectedProjectId)
  const currentView = useBoardStore((s) => s.currentView)
  const selectTask = useBoardStore((s) => s.selectTask)
  const error = useBoardStore((s) => s.error)
  const clearError = useBoardStore((s) => s.clearError)

  useEffect(() => {
    void loadProjects()
    const cleanup = useBoardStore.getState().initLiveSync()
    return cleanup
  }, [loadProjects])

  useEffect(() => {
    const cleanupNav = api.onNavigate((view: string) => {
      useBoardStore.getState().setCurrentView(view as NavigationView)
    })
    
    const cleanupAction = api.onAction((action: string) => {
      window.dispatchEvent(new CustomEvent(action))
    })

    return () => {
      cleanupNav()
      cleanupAction()
    }
  }, [])

  // Escape: blur a focused field first, otherwise close the task detail.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        el.blur()
        return
      }
      window.dispatchEvent(new CustomEvent('request-close-task'))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectTask])

  useEffect(() => {
    if (error) {
      useToastStore.getState().addToast('error', error)
      clearError()
    }
  }, [error, clearError])

  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col overflow-hidden bg-canvas text-ink">
        <AppNavigation />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {currentView === 'kanban' && <Sidebar />}

          <main className="flex min-w-0 flex-1 flex-col overflow-hidden" key={currentView}>
            <div className="view-enter flex min-h-0 flex-1 flex-col">
              {currentView === 'kanban' && (selectedProjectId ? <Board /> : <EmptyState />)}
              {currentView === 'dashboard' && <OverviewDashboard />}
              {currentView === 'repositories' && <RepositoryManager />}
              {currentView === 'agents' && <AgentMonitor />}
              {currentView === 'timeline' && <ActivityTimeline />}
              {currentView === 'mcp' && <McpSettings />}
              {currentView === 'diagnostics' && <DiagnosticsView />}
            </div>
          </main>

          {currentView === 'kanban' && <TaskDetail />}
        </div>

        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}
