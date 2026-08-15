import type { Database } from 'better-sqlite3'

/**
 * Ordered migration scripts. Index 0 is migration v1, index n-1 is vN.
 * Never edit an applied migration — append a new one.
 */
const MIGRATIONS: readonly string[] = [
  // v1 — initial schema
  `
  CREATE TABLE projects (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE tasks (
    id            TEXT PRIMARY KEY,
    project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL,
    priority      TEXT NOT NULL DEFAULT 'MEDIUM',
    repository_id TEXT,
    created_at    INTEGER NOT NULL,
    updated_at    INTEGER NOT NULL
  );

  CREATE INDEX idx_tasks_project ON tasks(project_id);
  CREATE INDEX idx_tasks_status ON tasks(status);

  CREATE TABLE task_labels (
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label   TEXT NOT NULL,
    PRIMARY KEY (task_id, label)
  );

  CREATE TABLE transitions (
    id          TEXT PRIMARY KEY,
    task_id     TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    from_status TEXT NOT NULL,
    to_status   TEXT NOT NULL,
    actor       TEXT NOT NULL,
    confidence  REAL,
    rule_id     TEXT,
    created_at  INTEGER NOT NULL
  );

  CREATE INDEX idx_transitions_task ON transitions(task_id, created_at);
  `,
  // v2 — Repositories, Workspaces, Agents, Sessions, Events, Evidence, Settings & Task extensions
  `
  ALTER TABLE tasks ADD COLUMN workspace_id TEXT;
  ALTER TABLE tasks ADD COLUMN branch TEXT;
  ALTER TABLE tasks ADD COLUMN automation_mode TEXT NOT NULL DEFAULT 'AUTO';

  CREATE TABLE repositories (
    id              TEXT PRIMARY KEY,
    project_id      TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    path            TEXT NOT NULL UNIQUE,
    default_branch  TEXT NOT NULL DEFAULT 'main',
    current_branch  TEXT NOT NULL DEFAULT 'main',
    head_commit     TEXT,
    worktrees_json  TEXT NOT NULL DEFAULT '[]',
    last_scanned_at INTEGER NOT NULL,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
  );

  CREATE INDEX idx_repos_project ON repositories(project_id);

  CREATE TABLE workspaces (
    id            TEXT PRIMARY KEY,
    repository_id TEXT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    path          TEXT NOT NULL UNIQUE,
    branch        TEXT NOT NULL DEFAULT 'main',
    is_worktree   INTEGER NOT NULL DEFAULT 0,
    created_at    INTEGER NOT NULL,
    updated_at    INTEGER NOT NULL
  );

  CREATE INDEX idx_workspaces_repo ON workspaces(repository_id);
  CREATE INDEX idx_workspaces_project ON workspaces(project_id);

  CREATE TABLE agents (
    id                TEXT PRIMARY KEY,
    type              TEXT NOT NULL,
    display_name      TEXT NOT NULL,
    process_id        INTEGER,
    command           TEXT,
    working_directory TEXT,
    adapter_level     INTEGER NOT NULL DEFAULT 1,
    status            TEXT NOT NULL DEFAULT 'active',
    last_seen_at      INTEGER NOT NULL,
    created_at        INTEGER NOT NULL
  );

  CREATE TABLE sessions (
    id               TEXT PRIMARY KEY,
    agent_id         TEXT NOT NULL,
    agent_type       TEXT NOT NULL,
    project_id       TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    repository_id    TEXT REFERENCES repositories(id) ON DELETE SET NULL,
    workspace_id     TEXT REFERENCES workspaces(id) ON DELETE SET NULL,
    task_id          TEXT REFERENCES tasks(id) ON DELETE SET NULL,
    branch           TEXT,
    activity_state   TEXT NOT NULL DEFAULT 'thinking',
    last_prompt      TEXT,
    started_at       INTEGER NOT NULL,
    last_activity_at INTEGER NOT NULL,
    ended_at         INTEGER
  );

  CREATE INDEX idx_sessions_project ON sessions(project_id);
  CREATE INDEX idx_sessions_task ON sessions(task_id);
  CREATE INDEX idx_sessions_active ON sessions(ended_at);

  CREATE TABLE events (
    id              TEXT PRIMARY KEY,
    timestamp       INTEGER NOT NULL,
    source          TEXT NOT NULL,
    category        TEXT NOT NULL,
    type            TEXT NOT NULL,
    project_id      TEXT,
    repository_id   TEXT,
    workspace_id    TEXT,
    session_id      TEXT,
    task_id         TEXT,
    process_id      INTEGER,
    payload_json    TEXT NOT NULL DEFAULT '{}',
    correlation_key TEXT
  );

  CREATE INDEX idx_events_timestamp ON events(timestamp DESC);
  CREATE INDEX idx_events_task ON events(task_id);
  CREATE INDEX idx_events_session ON events(session_id);
  CREATE INDEX idx_events_project ON events(project_id);

  CREATE TABLE evidence (
    id            TEXT PRIMARY KEY,
    transition_id TEXT NOT NULL REFERENCES transitions(id) ON DELETE CASCADE,
    task_id       TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    rule_id       TEXT NOT NULL,
    confidence    REAL NOT NULL,
    summary       TEXT NOT NULL,
    items_json    TEXT NOT NULL DEFAULT '[]',
    created_at    INTEGER NOT NULL
  );

  CREATE INDEX idx_evidence_transition ON evidence(transition_id);
  CREATE INDEX idx_evidence_task ON evidence(task_id);

  CREATE TABLE app_settings (
    key        TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
  `
]

export function migrate(db: Database): void {
  const current = db.pragma('user_version', { simple: true }) as number
  for (let version = current; version < MIGRATIONS.length; version += 1) {
    const sql = MIGRATIONS[version]
    if (!sql) throw new Error(`Migration ${version + 1} is missing`)
    const run = db.transaction(() => {
      db.exec(sql)
      db.pragma(`user_version = ${version + 1}`)
    })
    run()
  }
}
