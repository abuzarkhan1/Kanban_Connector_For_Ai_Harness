import type {
  IpcResult,
  ProjectDto,
  TaskDto,
  TransitionDto,
  EvidenceDto,
  ListEvidenceInput,
  BoardDto,
  CreateProjectInput,
  UpdateProjectInput,
  DeleteProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
  MoveTaskToColumnInput,
  ListTasksInput,
  DeleteTaskInput,
  ListTransitionsInput,
  GetBoardInput,
  RepositoryDto,
  CreateRepositoryInput,
  ListRepositoriesInput,
  DeleteRepositoryInput,
  ScanRepositoryInput,
  AgentDto,
  SessionDto,
  ListSessionsInput,
  ObservedEventDto,
  ListEventsInput,
  McpStatusDto,
  ConfigureHarnessInput,
  UnconfigureHarnessInput,
  VerifyHarnessInput,
  McpVerificationResultDto,
  AddCustomHarnessInput,
  RemoveCustomHarnessInput,
  DiagnosticsInfoDto
} from '@ipc'

/**
 * The complete API surface exposed to the renderer through the preload bridge.
 *
 * This file contains types only, so it can be included in both the node and
 * web TypeScript projects. The actual implementation lives in index.ts.
 */
export interface RendererApi {
  projects: {
    list(): Promise<IpcResult<ProjectDto[]>>
    create(input: CreateProjectInput): Promise<IpcResult<ProjectDto>>
    update(input: UpdateProjectInput): Promise<IpcResult<ProjectDto>>
    delete(input: DeleteProjectInput): Promise<IpcResult<{ deleted: boolean }>>
  }
  tasks: {
    list(input: ListTasksInput): Promise<IpcResult<TaskDto[]>>
    create(input: CreateTaskInput): Promise<IpcResult<TaskDto>>
    update(input: UpdateTaskInput): Promise<IpcResult<TaskDto>>
    move(input: MoveTaskInput): Promise<IpcResult<TaskDto>>
    moveToColumn(input: MoveTaskToColumnInput): Promise<IpcResult<TaskDto>>
    delete(input: DeleteTaskInput): Promise<IpcResult<{ deleted: boolean }>>
    transitions(input: ListTransitionsInput): Promise<IpcResult<TransitionDto[]>>
    evidence(input: ListEvidenceInput): Promise<IpcResult<EvidenceDto[]>>
  }
  board: {
    get(input: GetBoardInput): Promise<IpcResult<BoardDto>>
  }
  repositories: {
    list(input: ListRepositoriesInput): Promise<IpcResult<RepositoryDto[]>>
    listAll(): Promise<IpcResult<RepositoryDto[]>>
    create(input: CreateRepositoryInput): Promise<IpcResult<RepositoryDto>>
    delete(input: DeleteRepositoryInput): Promise<IpcResult<{ deleted: boolean }>>
    scan(input: ScanRepositoryInput): Promise<IpcResult<RepositoryDto>>
    pickDirectory(): Promise<IpcResult<string | null>>
  }
  sessions: {
    list(input?: ListSessionsInput): Promise<IpcResult<SessionDto[]>>
    listActive(): Promise<IpcResult<SessionDto[]>>
    listAgents(): Promise<IpcResult<AgentDto[]>>
  }
  events: {
    list(input?: ListEventsInput): Promise<IpcResult<ObservedEventDto[]>>
  }
  mcp: {
    getStatus(): Promise<IpcResult<McpStatusDto>>
    configureHarness(input: ConfigureHarnessInput): Promise<IpcResult<{ success: boolean; message: string }>>
    unconfigureHarness(input: UnconfigureHarnessInput): Promise<IpcResult<{ success: boolean; message: string }>>
    verifyHarness(input: VerifyHarnessInput): Promise<IpcResult<McpVerificationResultDto>>
    verifyAll(): Promise<IpcResult<Record<string, McpVerificationResultDto>>>
    addCustomHarness(input: AddCustomHarnessInput): Promise<IpcResult<{ success: boolean; entry: unknown }>>
    removeCustomHarness(input: RemoveCustomHarnessInput): Promise<IpcResult<{ success: boolean }>>
  }
  diagnostics: {
    getInfo(): Promise<IpcResult<DiagnosticsInfoDto>>
  }
  onSync(callback: (payload: { timestamp: number; type?: string }) => void): () => void
}
