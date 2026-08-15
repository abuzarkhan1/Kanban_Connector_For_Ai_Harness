import type { ObservedEvent } from '@domain/entities/ObservedEvent'
import type { Task } from '@domain/entities/Task'
import type { Repository } from '@domain/entities/Repository'
import type { Session } from '@domain/entities/Session'

export interface CorrelationResult {
  projectId: string | null
  repositoryId: string | null
  workspaceId: string | null
  sessionId: string | null
  taskId: string | null
  confidence: number
}

export class Correlator {
  correlate(
    event: ObservedEvent,
    context: {
      repositories: Repository[]
      tasks: Task[]
      sessions: Session[]
    }
  ): CorrelationResult {
    let projectId = event.projectId
    let repositoryId = event.repositoryId
    const workspaceId = event.workspaceId
    let sessionId = event.sessionId
    let taskId = event.taskId
    let confidence = 0.5

    // 1. Resolve Repository by filepath or workingDirectory
    const filepath = (event.payload.filepath as string) || (event.payload.workingDirectory as string) || ''
    if (!repositoryId && filepath) {
      for (const repo of context.repositories) {
        if (filepath.startsWith(repo.path)) {
          repositoryId = repo.id
          projectId = repo.projectId
          confidence += 0.2
          break
        }
      }
    }

    // 2. Resolve Session
    if (!sessionId && event.processId) {
      const activeSession = context.sessions.find(
        (s) => !s.endedAt && (s.repositoryId === repositoryId || (!s.repositoryId && repositoryId))
      )
      if (activeSession) {
        sessionId = activeSession.id
        if (!projectId) projectId = activeSession.projectId
        if (!taskId) taskId = activeSession.taskId
        confidence += 0.2
      }
    }

    // 3. Resolve Task by branch or repositoryId match
    if (!taskId && repositoryId) {
      const repo = context.repositories.find((r) => r.id === repositoryId)
      if (repo && repo.currentBranch) {
        const matchingTask = context.tasks.find(
          (t) => t.repositoryId === repositoryId && t.branch === repo.currentBranch && t.status !== 'DONE'
        )
        if (matchingTask) {
          taskId = matchingTask.id
          projectId = matchingTask.projectId
          confidence += 0.3
        }
      }
    }

    // If task was found from context, ensure projectId matches
    if (taskId && !projectId) {
      const task = context.tasks.find((t) => t.id === taskId)
      if (task) projectId = task.projectId
    }

    return {
      projectId,
      repositoryId,
      workspaceId,
      sessionId,
      taskId,
      confidence: Math.min(1.0, confidence)
    }
  }
}
