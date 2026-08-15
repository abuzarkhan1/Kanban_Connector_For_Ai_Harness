import React from 'react'
import { useBoardStore, type NavigationView } from '../../stores/useBoardStore'
import {
  KanbanIcon,
  DashboardIcon,
  RepositoryIcon,
  AgentIcon,
  TimelineIcon,
  McpPlugIcon,
  DiagnosticsIcon,
  type IconProps
} from '../icons'

interface NavItem {
  id: NavigationView
  label: string
  Icon: React.ComponentType<IconProps>
  badge?: number
}

export const AppNavigation: React.FC = () => {
  const { currentView, setCurrentView, repositories, agents, sessions } = useBoardStore()

  const activeSessionsCount = sessions.filter((s) => !s.endedAt).length

  const navItems: NavItem[] = [
    { id: 'kanban', label: 'Kanban Board', Icon: KanbanIcon },
    { id: 'dashboard', label: 'Overview', Icon: DashboardIcon },
    { id: 'repositories', label: 'Repositories', Icon: RepositoryIcon, badge: repositories.length },
    {
      id: 'agents',
      label: 'Agents & Sessions',
      Icon: AgentIcon,
      badge: activeSessionsCount || agents.length
    },
    { id: 'timeline', label: 'Activity Timeline', Icon: TimelineIcon },
    { id: 'mcp', label: 'MCP & Integrations', Icon: McpPlugIcon },
    { id: 'diagnostics', label: 'Diagnostics', Icon: DiagnosticsIcon }
  ]

  return (
    <nav className="flex items-center gap-1 border-b border-hairline bg-surface px-4 py-2">
      <div className="flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const IconComponent = item.Icon
          const isAgentActive = item.id === 'agents' && activeSessionsCount > 0

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`group flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-ring ${
                isActive
                  ? 'border border-hairline bg-surface-elevated text-ink'
                  : 'border border-transparent text-mute hover:bg-surface-elevated hover:text-ink'
              }`}
            >
              <IconComponent
                size="sm"
                animate={isAgentActive ? 'pulse' : isActive ? 'none' : 'hover-scale'}
                active={isActive}
                className={isActive ? 'text-ink' : 'text-ash group-hover:text-ink'}
              />
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="rounded-[5px] bg-surface-card px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-mute">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
