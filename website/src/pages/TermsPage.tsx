import { PageShell, PageSection } from '../components/origin/PageShell'

export const TermsPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <PageShell
      title="Terms of Service"
      eyebrow={`Effective ${new Date().getFullYear()} · MIT`}
      onNavigateHome={onNavigateHome}
    >
      <PageSection title="Open Source License">
        <p>
          AI Harness Project Manager is free software under the MIT License. You may use, copy,
          modify, publish, and distribute it subject to MIT terms.
        </p>
      </PageSection>
      <PageSection title="Local-First & Data Ownership">
        <p>
          The app runs on your machine. Projects, tasks, Git traces, and SQLite data stay under your
          control. We do not host or access your data.
        </p>
      </PageSection>
      <PageSection title="Disclaimer of Warranty">
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Authors are not liable for
          claims or damages arising from use of the software.
        </p>
      </PageSection>
      <PageSection title="Agent Interactions">
        <p>
          Connecting harnesses via MCP lets those agents read and modify local tasks within your
          configured workspace permissions.
        </p>
      </PageSection>
    </PageShell>
  )
}
