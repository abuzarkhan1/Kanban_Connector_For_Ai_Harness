import { z } from 'zod'
import { COLUMNS } from '@domain/state-machine/status'
import { TaskSchema } from './taskContracts'

export const BoardColumnSchema = z.object({
  id: z.enum(COLUMNS),
  name: z.string(),
  tasks: z.array(TaskSchema)
})

export type BoardColumnDto = z.infer<typeof BoardColumnSchema>

export const BoardSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string(),
  columns: z.array(BoardColumnSchema)
})

export type BoardDto = z.infer<typeof BoardSchema>

export const GetBoardSchema = z.object({
  projectId: z.string().uuid()
}).strict()

export type GetBoardInput = z.infer<typeof GetBoardSchema>
