import type { Task } from '@domain/entities/Task'
import type { ObservedEvent } from '@domain/entities/ObservedEvent'
import type { InternalStatus } from '@domain/state-machine/status'
import { canTransition } from '@domain/state-machine/stateMachine'
import type { TaskService } from '@application/services/taskService'
import type { EvidenceRepository } from '@persistence/repositories/evidenceRepository'
import { createEvidence } from '@domain/entities/Evidence'

export interface InferenceRuleResult {
  candidateStatus: InternalStatus
  ruleId: string
  confidence: number
  summary: string
  items: Array<{
    type: 'process' | 'git' | 'test' | 'file' | 'mcp' | 'adapter'
    description: string
    eventId?: string
    confidence: number
  }>
}

export class InferenceEngine {
  private lastTransitionTimes = new Map<string, number>()
  private readonly MIN_DWELL_TIME_MS = 3000 // 3s hysteresis guard

  constructor(
    private readonly taskService: TaskService,
    private readonly evidenceRepo: EvidenceRepository
  ) {}

  evaluate(event: ObservedEvent, task: Task): InferenceRuleResult | null {
    // 1. Agent started / active in task context
    if (
      event.type === 'HARNESS_DETECTED' ||
      event.type === 'HARNESS_SESSION_STARTED' ||
      event.type === 'MCP_TOOL_CALLED'
    ) {
      let candidate: InternalStatus | null = null
      if (task.status === 'BACKLOG') candidate = 'READY'
      else if (task.status === 'READY') candidate = 'ASSIGNED'
      else if (task.status === 'ASSIGNED') candidate = 'AGENT_STARTED'
      else if (task.status === 'AGENT_STARTED') candidate = 'IMPLEMENTING'

      if (candidate) {
        return {
          candidateStatus: candidate,
          ruleId: 'RULE_AGENT_STARTED',
          confidence: 0.85,
          summary: `AI harness activity detected, advancing to ${candidate}`,
          items: [
            {
              type: event.category === 'mcp' ? 'mcp' : 'process',
              description: `Agent signal received: ${event.type}`,
              eventId: event.id,
              confidence: 0.85
            }
          ]
        }
      }
    }

    // 2. Tests passed + Files modified -> promote to READY_FOR_REVIEW
    if (
      event.type === 'TEST_PASSED' &&
      (task.status === 'IMPLEMENTING' || task.status === 'TESTING' || task.status === 'AGENT_STARTED')
    ) {
      return {
        candidateStatus: 'READY_FOR_REVIEW',
        ruleId: 'RULE_TESTS_PASSED_CLEAN',
        confidence: 0.88,
        summary: 'Test suite passed with clean build',
        items: [
          {
            type: 'test',
            description: `Test execution passed (${event.payload.command || 'test suite'})`,
            eventId: event.id,
            confidence: 0.88
          }
        ]
      }
    }

    // 3. Tests started -> promote to TESTING
    if (event.type === 'TEST_STARTED' && task.status === 'IMPLEMENTING') {
      return {
        candidateStatus: 'TESTING',
        ruleId: 'RULE_TESTS_RUNNING',
        confidence: 0.8,
        summary: 'Test execution started',
        items: [
          {
            type: 'test',
            description: `Test run started (${event.payload.command || 'tests'})`,
            eventId: event.id,
            confidence: 0.8
          }
        ]
      }
    }

    // 4. Repeated Test Failure / Permission required -> BLOCKED
    if (
      (event.type === 'HARNESS_AWAITING_PERMISSION' || event.type === 'TEST_FAILED') &&
      (task.status === 'IMPLEMENTING' || task.status === 'TESTING')
    ) {
      return {
        candidateStatus: 'BLOCKED',
        ruleId: event.type === 'TEST_FAILED' ? 'RULE_TEST_FAILURE' : 'RULE_PERMISSION_REQUIRED',
        confidence: 0.75,
        summary: event.type === 'TEST_FAILED' ? 'Test failure detected' : 'Agent awaiting user permission',
        items: [
          {
            type: event.type === 'TEST_FAILED' ? 'test' : 'adapter',
            description: `Failure or permission prompt: ${event.type}`,
            eventId: event.id,
            confidence: 0.75
          }
        ]
      }
    }

    // 5. Merge / Commit detected -> DONE (for tasks in REVIEW / APPROVED)
    if (
      (event.type === 'MERGE_DETECTED' || event.type === 'COMMIT_CREATED') &&
      (task.status === 'READY_FOR_REVIEW' || task.status === 'APPROVED' || task.status === 'MERGED')
    ) {
      return {
        candidateStatus: 'DONE',
        ruleId: 'RULE_MERGE_COMPLETED',
        confidence: 0.95,
        summary: 'Git merge or final commit created',
        items: [
          {
            type: 'git',
            description: `Git event: ${event.type}`,
            eventId: event.id,
            confidence: 0.95
          }
        ]
      }
    }

    return null
  }

  processTransition(event: ObservedEvent, task: Task): Task | null {
    if (task.automationMode === 'MANUAL') return null

    const result = this.evaluate(event, task)
    if (!result) return null

    // Check if transition is allowed by state machine
    if (!canTransition(task.status, result.candidateStatus)) {
      return null
    }

    // Dwell time check to avoid rapid oscillating transitions
    const lastTime = this.lastTransitionTimes.get(task.id) ?? 0
    const now = Date.now()
    if (now - lastTime < this.MIN_DWELL_TIME_MS) {
      return null
    }

    // Execute state move with system actor
    const updated = this.taskService.move(task.id, result.candidateStatus, {
      actor: 'system',
      confidence: result.confidence,
      ruleId: result.ruleId
    })

    this.lastTransitionTimes.set(task.id, now)

    // Find the latest transition to link evidence
    const transitions = this.taskService.transitionsFor(task.id)
    const latestTransition = transitions[transitions.length - 1]
    if (latestTransition) {
      this.evidenceRepo.insert(
        createEvidence({
          transitionId: latestTransition.id,
          taskId: task.id,
          ruleId: result.ruleId,
          confidence: result.confidence,
          summary: result.summary,
          items: result.items
        })
      )
    }

    return updated
  }
}
