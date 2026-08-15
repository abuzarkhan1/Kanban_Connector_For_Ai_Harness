import type { ObservedEvent, CreateObservedEventInput } from '@domain/entities/ObservedEvent'
import { createObservedEvent } from '@domain/entities/ObservedEvent'
import type { EventRepository } from '@persistence/repositories/eventRepository'

export class EventService {
  constructor(private readonly events: EventRepository) {}

  record(input: CreateObservedEventInput): ObservedEvent {
    const event = createObservedEvent(input)
    this.events.insert(event)
    return event
  }

  listRecent(limit: number = 100): ObservedEvent[] {
    return this.events.listRecent(limit)
  }

  listByProject(projectId: string, limit: number = 100): ObservedEvent[] {
    return this.events.listByProject(projectId, limit)
  }

  listByTask(taskId: string, limit: number = 100): ObservedEvent[] {
    return this.events.listByTask(taskId, limit)
  }

  count(): number {
    return this.events.count()
  }
}
