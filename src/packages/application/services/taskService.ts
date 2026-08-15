import type { Task } from '@domain/entities/Task'
import { createTask, withStatus, withTaskPatch } from '@domain/entities/Task'
import { createTransition, type Transition, type TransitionActor } from '@domain/entities/Transition'
import { InvalidTransitionError } from '@domain/errors/domainError'
import { canTransition } from '@domain/state-machine/stateMachine'
import { columnFor, defaultStatusForColumn, type ColumnId, type InternalStatus } from '@domain/state-machine/status'
import type { Priority } from '@domain/value-objects/priority'
import type { ProjectRepository } from '@persistence/repositories/projectRepository'
import type { TaskRepository } from '@persistence/repositories/taskRepository'
import type { TransitionRepository } from '@persistence/repositories/transitionRepository'

export interface CreateTaskInput {
  projectId: string
  title: string
  description?: string
  priority?: Priority
  labels?: string[]
  repositoryId?: string | null
  workspaceId?: string | null
  branch?: string | null
  automationMode?: 'AUTO' | 'MANUAL' | 'CONFIRM'
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  priority?: Priority
  labels?: string[]
  repositoryId?: string | null
  workspaceId?: string | null
  branch?: string | null
  automationMode?: 'AUTO' | 'MANUAL' | 'CONFIRM'
}

export interface MoveTaskOptions {
  actor?: TransitionActor
  confidence?: number | null
  ruleId?: string | null
}

export class TaskService {
  constructor(
    private readonly projects: ProjectRepository,
    private readonly tasks: TaskRepository,
    private readonly transitions: TransitionRepository
  ) {}

  create(input: CreateTaskInput): Task {
    // Enforce the project exists before creating a task inside it.
    this.projects.get(input.projectId)
    const task = createTask({
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      labels: input.labels,
      repositoryId: input.repositoryId,
      workspaceId: input.workspaceId,
      branch: input.branch,
      automationMode: input.automationMode
    })
    this.tasks.insert(task)
    return task
  }

  listByProject(projectId: string): Task[] {
    return this.tasks.listByProject(projectId)
  }

  get(id: string): Task {
    return this.tasks.get(id)
  }

  update(id: string, patch: UpdateTaskInput): Task {
    const task = this.tasks.get(id)
    const updated = withTaskPatch(task, patch)
    this.tasks.save(updated)
    return updated
  }

  /**
   * Move a task through the state machine. Every move — manual or (later)
   * automatic — records an auditable transition and is validated against the
   * explicit transition table first.
   */
  move(id: string, toStatus: InternalStatus, options: MoveTaskOptions = {}): Task {
    const task = this.tasks.get(id)
    if (!canTransition(task.status, toStatus)) {
      throw new InvalidTransitionError(task.status, toStatus)
    }
    const updated = withStatus(task, toStatus)
    const transition = createTransition({
      taskId: task.id,
      fromStatus: task.status,
      toStatus,
      actor: options.actor ?? 'user',
      confidence: options.confidence ?? null,
      ruleId: options.ruleId ?? null,
      now: updated.updatedAt
    })
    this.tasks.save(updated)
    this.transitions.insert(transition)
    return updated
  }

  /**
   * User-initiated column move (drag-and-drop on the board).
   *
   * Dragging a card to a column is explicit user intent and is the documented
   * "Allow user override" safeguard (docs/03-domain/STATE_MACHINE.md): it does
   * not need to match a one-step lifecycle edge. The task is set to the
   * column's entry status and the move is still recorded as an audited user
   * transition. No-op when the task already sits in that column.
   * System/inferred moves remain strictly gated by the transition table.
   */
  moveToColumn(id: string, columnId: ColumnId, options: MoveTaskOptions = {}): Task {
    const task = this.tasks.get(id)
    if (columnFor(task.status) === columnId) return task
    const toStatus = defaultStatusForColumn(columnId)
    const updated = withStatus(task, toStatus)
    const transition = createTransition({
      taskId: task.id,
      fromStatus: task.status,
      toStatus,
      actor: options.actor ?? 'user',
      confidence: options.confidence ?? null,
      ruleId: options.ruleId ?? null,
      now: updated.updatedAt
    })
    this.tasks.save(updated)
    this.transitions.insert(transition)
    return updated
  }

  transitionsFor(taskId: string): Transition[] {
    return this.transitions.listByTask(taskId)
  }

  delete(id: string): void {
    this.tasks.delete(id)
  }
}
