import { PageShell, PageSection } from '../components/origin/PageShell'

export const PrivacyPolicyPage: React.FC<{ onNavigateHome: () => void }> = ({
  onNavigateHome,
}) => {
  return (
    <PageShell
      title="Privacy Policy"
      eyebrow={`Effective ${new Date().getFullYear()} · Zero telemetry`}
      onNavigateHome={onNavigateHome}
    >
      <div className="card-elevated !p-6">
        <p className="mono-label text-ash">Local processing</p>
        <p className="mt-3 text-[16px] font-light text-cloud">
          No personal data, source code, or tasks are collected or sent to remote servers.
        </p>
      </div>

      <PageSection title="What we do not collect">
        <p>
          No accounts, IP logs, tracking cookies, or diagnostic telemetry to external servers.
        </p>
      </PageSection>
      <PageSection title="Local storage">
        <p>
          Projects and evidence live in{' '}
          <code className="font-mono text-cloud">~/.ai-harness/kanban.sqlite</code> on your machine.
        </p>
      </PageSection>
      <PageSection title="API keys">
        <p>
          We do not require or collect OpenAI, Anthropic, or Google API keys. Inference runs locally
          with zero external API calls.
        </p>
      </PageSection>
      <PageSection title="GDPR & CCPA">
        <p>
          Because we do not process personal data on external servers, compliance follows by
          design.
        </p>
      </PageSection>
    </PageShell>
  )
}
