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
}

export function createKanbanMcpServer(context: McpServerContext): McpServer {
  const { projects, tasks, repositories, sessions, events, evidence } = context

  const server = new McpServer({
    name: 'ai-harness-project-manager',
    version: '1.0.0'
  })

  // -------------------------------------------------------------------------
  // TOOLS
  // -------------------------------------------------------------------------

  // 1. kanban_list_projects
  server.tool('kanban_list_projects', 'List all available Kanban projects and their IDs', {}, async () => {
    const list = projects.list()
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
        (t) => t.repositoryId === matchedRepo.id || (t.branch && t.branch === matchedRepo.currentBranch)
      )

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                matched: true,
                project,
                repository: matchedRepo,
                matchingTasks,
                allProjectTasks: projectTasks
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

  server.resource(
    'project-resource',
    new ResourceTemplate('kanban://project/{projectId}', { list: undefined }),
    async (uri, { projectId }) => {
      const pId = String(projectId)
      const project = projects.get(pId)
      const taskList = tasks.listByProject(pId)
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

  server.resource(
    'active-tasks-resource',
    'kanban://tasks/active',
    async (uri) => {
      const allProjects = projects.list()
      const activeTasks = allProjects.flatMap((p) =>
        tasks.listByProject(p.id).filter((t) => t.status !== 'DONE' && t.status !== 'BACKLOG')
      )
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ activeTasks }, null, 2),
            mimeType: 'application/json'
          }
        ]
      }
    }
  )

  server.resource(
    'task-resource',
    new ResourceTemplate('kanban://tasks/{taskId}', { list: undefined }),
    async (uri, { taskId }) => {
      const tId = String(taskId)
      const task = tasks.get(tId)
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(task, null, 2),
            mimeType: 'application/json'
          }
        ]
      }
    }
  )

  // -------------------------------------------------------------------------
  // PROMPTS
  // -------------------------------------------------------------------------

  server.prompt(
    'kanban_task_context',
    'Get full task instructions, acceptance criteria, branch, and transition instructions for an AI agent',
    {
      taskId: z.string().describe('The task UUID to frame context for')
    },
    async ({ taskId }) => {
      const task = tasks.get(taskId)
      const project = projects.get(task.projectId)
      const taskTransitions = tasks.transitionsFor(taskId)

      return {
        description: `Context framing for task: ${task.title}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                `You are working on task "${task.title}" in project "${project.name}".`,
                `Current Status: ${task.status}`,
                `Priority: ${task.priority}`,
                task.description ? `Description:\n${task.description}` : '',
                task.branch ? `Associated Git Branch: ${task.branch}` : '',
                task.labels.length > 0 ? `Labels: ${task.labels.join(', ')}` : '',
                '',
                'Instructions:',
                '1. As you begin implementation, report activity using `kanban_report_activity` with activityState: "modifying_files".',
                '2. When running unit tests, report `kanban_report_activity` with activityState: "running_tests".',
                '3. When finished, move the task to READY_FOR_REVIEW using `kanban_move_task`.',
                '',
                `Audit History (${taskTransitions.length} transitions):`,
                ...taskTransitions.map(
                  (t) => `- ${new Date(t.createdAt).toISOString()}: ${t.fromStatus} -> ${t.toStatus} (${t.actor})`
                )
              ]
                .filter(Boolean)
                .join('\n')
            }
          }
        ]
      }
    }
  )

  server.prompt(
    'kanban_start_task',
    'Initialize development on a task: moves task to in-progress and sets up workspace instructions',
    {
      taskId: z.string().describe('The task UUID to start work on')
    },
    async ({ taskId }) => {
      const task = tasks.get(taskId)
      return {
        description: `Start working on task: ${task.title}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please begin work on task [${task.id}] "${task.title}". First examine the code, then implement changes and run verification tests.`
            }
          }
        ]
      }
    }
  )

  return server
}
