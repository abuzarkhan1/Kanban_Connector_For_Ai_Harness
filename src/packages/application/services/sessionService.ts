import type { Session, AgentActivityState, CreateSessionInput } from '@domain/entities/Session'
import { createSession } from '@domain/entities/Session'
import type { Agent, CreateAgentInput } from '@domain/entities/Agent'
import { createAgent } from '@domain/entities/Agent'
import type { SessionRepository } from '@persistence/repositories/sessionRepository'
import type { AgentRepository } from '@persistence/repositories/agentRepository'

export class SessionService {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly agents: AgentRepository
  ) {}

  registerAgent(input: CreateAgentInput): Agent {
    const agent = createAgent(input)
    this.agents.upsert(agent)
    return agent
  }

  listAgents(): Agent[] {
    return this.agents.list()
  }

  listActiveAgents(): Agent[] {
    return this.agents.listActive()
  }

  startSession(input: CreateSessionInput): Session {
    const session = createSession(input)
    this.sessions.insert(session)
    return session
  }

  updateActivity(
    sessionId: string,
    state: AgentActivityState,
    extra: { lastPrompt?: string; taskId?: string; branch?: string } = {}
  ): Session {
    const session = this.sessions.get(sessionId)
    const updated: Session = {
      ...session,
      activityState: state,
      lastPrompt: extra.lastPrompt !== undefined ? extra.lastPrompt : session.lastPrompt,
      taskId: extra.taskId !== undefined ? extra.taskId : session.taskId,
      branch: extra.branch !== undefined ? extra.branch : session.branch,
      lastActivityAt: Date.now()
    }
    this.sessions.save(updated)
    return updated
  }

  endSession(sessionId: string): Session {
    const session = this.sessions.get(sessionId)
    const now = Date.now()
    const updated: Session = {
      ...session,
      activityState: 'finished',
      lastActivityAt: now,
      endedAt: now
    }
    this.sessions.save(updated)
    return updated
  }

  listByProject(projectId: string): Session[] {
    return this.sessions.listByProject(projectId)
  }

  listActive(): Session[] {
    return this.sessions.listActive()
  }

  listByTask(taskId: string): Session[] {
    return this.sessions.listByTask(taskId)
  }
}
