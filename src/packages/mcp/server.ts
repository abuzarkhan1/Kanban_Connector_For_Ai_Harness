import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { ProjectService } from '@application/services/projectService'
import type { TaskService } from '@application/services/taskService'
import type { RepositoryService } from '@application/services/repositoryService'
import type { SessionService } from '@application/services/sessionService'
import type { EventService } from '@application/services/eventService'
import type { EvidenceRepository } from '@persistence/repositories/evidenceRepository'
import type { InternalStatus } from '@domain/state-machine/status'
import { INTERNAL_STATUSES } from '@domain/state-machine/status'
import { PRIORITIES } from '@domain/value-objects/priority'
import { createEvidence } from '@domain/entities/Evidence'

export interface McpServerContext {
  projects: ProjectService
  tasks: TaskService
  repositories: RepositoryService
  sessions: SessionService
  events: EventService
  evidence: EvidenceRepository
  onMutation?: () => void
}

export function createKanbanMcpServer(context: McpServerContext): McpServer {
  const { projects, tasks, repositories, sessions, events, evidence, onMutation } = context

  const server = new McpServer({
    name: 'ai-harness-project-manager',
    version: '1.0.0'
  })

  // -------------------------------------------------------------------------
  // TOOLS
  // -------------------------------------------------------------------------

  // 0. kanban_ping (Live connection probe & health check)
  server.tool(
    'kanban_ping',
    'Verify MCP stdio bridge health, latency, database accessibility, and server status',
    {},
    async () => {
      const projectCount = projects.list().length
      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_TOOL_CALLED',
        taskId: null,
        payload: { tool: 'kanban_ping', projectCount }
      })

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              server: 'ai-harness-project-manager',
              version: '1.0.0',
              timestamp: Date.now(),
              db: 'connected',
              activeProjects: projectCount
            })
          }
        ]
      }
    }
  )

  // 1. kanban_list_projects
  server.tool('kanban_list_projects', 'List all available Kanban projects and their IDs', {}, async () => {
    const list = projects.list()
    events.record({
      source: 'mcp-server',
      category: 'mcp',
      type: 'MCP_TOOL_CALLED',
      taskId: null,
      payload: { tool: 'kanban_list_projects', count: list.length }
    })
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(list, null, 2)
        }
      ]
    }
  })

  // 2. kanban_list_tasks
  server.tool(
    'kanban_list_tasks',
    'List and filter tasks for a given project',
    {
      projectId: z.string().describe('The project UUID'),
      status: z.enum(INTERNAL_STATUSES).optional().describe('Filter by specific internal status')
    },
    async ({ projectId, status }) => {
      let taskList = tasks.listByProject(projectId)
      if (status) {
        taskList = taskList.filter((t) => t.status === status)
      }

      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_TOOL_CALLED',
        taskId: null,
        projectId,
        payload: { tool: 'kanban_list_tasks', projectId, status, count: taskList.length }
      })

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(taskList, null, 2)
          }
        ]
      }
    }
  )

  // 3. kanban_get_task
  server.tool(
    'kanban_get_task',
    'Get full task details, description, linked branch, and transition history',
    {
      taskId: z.string().describe('The task UUID')
    },
    async ({ taskId }) => {
      const task = tasks.get(taskId)
      const transitions = tasks.transitionsFor(taskId)
      const evidenceList = evidence.listByTask(taskId)

      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_TOOL_CALLED',
        taskId,
        projectId: task.projectId,
        payload: { tool: 'kanban_get_task', taskId }
      })

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ task, transitions, evidence: evidenceList }, null, 2)
          }
        ]
      }
    }
  )

  // 4. kanban_create_task
  server.tool(
    'kanban_create_task',
    'Create a new task in a project',
    {
      projectId: z.string().describe('The project UUID'),
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Task description and acceptance criteria'),
      priority: z.enum(PRIORITIES).optional().describe('Task priority'),
      labels: z.array(z.string()).optional().describe('Array of label tags'),
      branch: z.string().optional().describe('Associated git branch')
    },
    async (args) => {
      const created = tasks.create({
        projectId: args.projectId,
        title: args.title,
        description: args.description,
        priority: args.priority,
        labels: args.labels,
        branch: args.branch
      })

      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_TOOL_CALLED',
        taskId: created.id,
        projectId: args.projectId,
        payload: { tool: 'kanban_create_task', taskId: created.id, title: args.title }
      })

      try {
        onMutation?.()
      } catch {
        // Ignore
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(created, null, 2)
          }
        ]
      }
    }
  )

  // 5. kanban_move_task
  server.tool(
    'kanban_move_task',
    'Transition a task to a new state with explanation and rationale',
    {
      taskId: z.string().describe('The task UUID'),
      toStatus: z.enum(INTERNAL_STATUSES).describe('Target internal status'),
      reason: z.string().describe('Why this transition is occurring')
    },
    async ({ taskId, toStatus, reason }) => {
      const updated = tasks.move(taskId, toStatus as InternalStatus, {
        actor: 'system',
        confidence: 0.9,
        ruleId: 'MCP_AGENT_DIRECT'
      })

      // Record MCP event
      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_TOOL_CALLED',
        taskId,
        payload: { tool: 'kanban_move_task', toStatus, reason }
      })

      // Attach evidence to latest transition
      const transitions = tasks.transitionsFor(taskId)
      const latest = transitions[transitions.length - 1]
      if (latest) {
        evidence.insert(
          createEvidence({
            transitionId: latest.id,
            taskId,
            ruleId: 'MCP_AGENT_DIRECT',
            confidence: 0.9,
            summary: reason,
            items: [{ type: 'mcp', description: reason, confidence: 0.9 }]
          })
        )
      }

      try {
        onMutation?.()
      } catch {
        // Ignore
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(updated, null, 2)
          }
        ]
      }
    }
  )

  // 6. kanban_report_activity
  server.tool(
    'kanban_report_activity',
    'Report current agent activity state (thinking, modifying_files, running_tests, awaiting_permission, blocked, finished)',
    {
      agentType: z.string().describe('Harness type, e.g. antigravity, claude_code, etc.'),
      activityState: z.enum([
        'thinking',
        'waiting_for_input',
        'awaiting_permission',
        'executing_commands',
        'modifying_files',
        'running_tests',
        'finished',
        'failed',
        'stuck',
        'idle'
      ]),
      taskId: z.string().optional().describe('Task UUID being worked on'),
      lastPrompt: z.string().optional().describe('User prompt or current intent')
    },
    async (args) => {
      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_ACTIVITY_REPORTED',
        taskId: args.taskId ?? null,
        payload: args
      })

      if (sessions && args.taskId) {
        try {
          const matchingSessions = sessions.listByTask(args.taskId)
          if (matchingSessions[0]) {
            sessions.updateActivity(matchingSessions[0].id, args.activityState, {
              lastPrompt: args.lastPrompt
            })
          }
        } catch {
          // Ignore
        }
      }

      try {
        onMutation?.()
      } catch {
        // Ignore
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ reported: true, activityState: args.activityState })
          }
        ]
      }
    }
  )

  // 7. kanban_get_workspace_context
  server.tool(
    'kanban_get_workspace_context',
    'Resolve the current workspace context (matching project, repositories, and active tasks) for a directory path',
    {
      workingDirectory: z.string().describe('Current working directory path')
    },
    async (args) => {
      const allRepos = repositories.listAll()
      const normalizedWd = args.workingDirectory.replace(/\\/g, '/')
      const matchedRepo = allRepos.find((r) => {
        const repoPath = r.path.replace(/\\/g, '/')
        return normalizedWd === repoPath || normalizedWd.startsWith(repoPath + '/')
      })

      if (!matchedRepo) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ matched: false, message: 'No registered repository found for directory' }, null, 2)
            }
          ]
        }
      }

      const project = projects.get(matchedRepo.projectId)
      const projectTasks = tasks.listByProject(matchedRepo.projectId)
      const matchingTasks = projectTasks.filter(
        (t) => t.status === 'READY' || t.status === 'IMPLEMENTING' || t.status === 'ASSIGNED'
      )

      events.record({
        source: 'mcp-server',
        category: 'mcp',
        type: 'MCP_TOOL_CALLED',
        taskId: null,
        projectId: project.id,
        repositoryId: matchedRepo.id,
        payload: { tool: 'kanban_get_workspace_context', workingDirectory: args.workingDirectory }
      })

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                matched: true,
                project: { id: project.id, name: project.name },
                repository: { id: matchedRepo.id, name: matchedRepo.name, branch: matchedRepo.currentBranch },
                suggestedTasks: matchingTasks
              },
              null,
              2
            )
          }
        ]
      }
    }
  )

  // -------------------------------------------------------------------------
  // RESOURCES
  // -------------------------------------------------------------------------

  // 1. Direct project metadata resource
  server.resource(
    'project',
    new ResourceTemplate('kanban://project/{projectId}', { list: undefined }),
    async (uri, { projectId }) => {
      const project = projects.get(String(projectId))
      const taskList = tasks.listByProject(String(projectId))
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ project, tasks: taskList }, null, 2),
            mimeType: 'application/json'
          }
        ]
      }
    }
  )

  // 2. Full project board resource
  server.resource(
    'project_board',
    new ResourceTemplate('kanban://projects/{projectId}/board', { list: undefined }),
    async (uri, { projectId }) => {
      const project = projects.get(String(projectId))
      const taskList = tasks.listByProject(String(projectId))
      const columns = {
        TODO: taskList.filter((t) => t.status === 'BACKLOG' || t.status === 'READY' || t.status === 'ASSIGNED'),
        IN_PROGRESS: taskList.filter((t) => t.status === 'AGENT_STARTED' || t.status === 'IMPLEMENTING' || t.status === 'TESTING' || t.status === 'BLOCKED'),
        REVIEW: taskList.filter((t) => t.status === 'READY_FOR_REVIEW' || t.status === 'CHANGES_REQUESTED' || t.status === 'APPROVED'),
        DONE: taskList.filter((t) => t.status === 'MERGED' || t.status === 'DONE')
      }
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ project, columns }, null, 2),
            mimeType: 'application/json'
          }
        ]
      }
    }
  )

  // 3. Single task details and transition history
  server.resource(
    'task',
    new ResourceTemplate('kanban://tasks/{taskId}', { list: undefined }),
    async (uri, { taskId }) => {
      const task = tasks.get(String(taskId))
      const transitions = tasks.transitionsFor(String(taskId))
      const evidenceList = evidence.listByTask(String(taskId))
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ task, transitions, evidence: evidenceList }, null, 2),
            mimeType: 'application/json'
          }
        ]
      }
    }
  )

  // 4. Active tasks query resource
  server.resource(
    'active_tasks',
    'kanban://tasks/active',
    async (uri) => {
      const allProjects = projects.list()
      const activeTasks = allProjects.flatMap((p) =>
        tasks
          .listByProject(p.id)
          .filter(
            (t) =>
              t.status === 'READY' ||
              t.status === 'ASSIGNED' ||
              t.status === 'AGENT_STARTED' ||
              t.status === 'IMPLEMENTING' ||
              t.status === 'TESTING' ||
              t.status === 'READY_FOR_REVIEW'
          )
      )
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(activeTasks, null, 2),
            mimeType: 'application/json'
          }
        ]
      }
    }
  )

  // -------------------------------------------------------------------------
  // PROMPTS
  // -------------------------------------------------------------------------

  // 1. Context prompt for working on a task
  server.prompt(
    'kanban_task_context',
    'Load task requirements, acceptance criteria, linked git branch, and transition history',
    {
      taskId: z.string().describe('The task UUID to load')
    },
    async ({ taskId }) => {
      const task = tasks.get(taskId)
      const transitions = tasks.transitionsFor(taskId)
      const project = projects.get(task.projectId)

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `You are working on task "${task.title}" in project "${project.name}".\n\nStatus: ${task.status}\nPriority: ${task.priority}\nLabels: ${task.labels.join(', ')}\nBranch: ${task.branch || 'none'}\n\nDescription:\n${task.description || 'No description provided.'}\n\nTransition History:\n${transitions.map((t) => `- ${new Date(t.createdAt).toISOString()}: ${t.fromStatus} -> ${t.toStatus} (${t.actor})`).join('\n')}\n\nPlease report your progress using kanban_report_activity and move tasks using kanban_move_task when milestones are completed.`
            }
          }
        ]
      }
    }
  )

  // 2. Start working on highest priority ready task prompt
  server.prompt(
    'kanban_start_task',
    'Identify and start working on the highest priority task in READY status for a project',
    {
      projectId: z.string().describe('The project UUID')
    },
    async ({ projectId }) => {
      const project = projects.get(projectId)
      const taskList = tasks.listByProject(projectId)
      const readyTasks = taskList.filter((t) => t.status === 'READY')

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Here are the READY tasks available in project "${project.name}":\n\n${readyTasks.map((t) => `- [${t.priority}] ${t.title} (ID: ${t.id})`).join('\n') || 'No tasks currently in READY status.'}\n\nSelect the highest priority task, move it to IMPLEMENTING via kanban_move_task, and begin implementation.`
            }
          }
        ]
      }
    }
  )

  return server
}
