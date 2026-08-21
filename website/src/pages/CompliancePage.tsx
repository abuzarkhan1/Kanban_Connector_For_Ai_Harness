import { PageShell } from '../components/origin/PageShell'

const ITEMS = [
  {
    title: 'SOC 2 readiness by design',
    desc: 'Zero data egress—no source or task metadata leaves your perimeter.',
    status: 'Compliant',
  },
  {
    title: 'HIPAA / PHI environments',
    desc: 'No cloud transmission for healthcare code organization.',
    status: 'Compliant',
  },
  {
    title: 'GDPR / CCPA / sovereignty',
    desc: 'All data stays in local SQLite on your hardware.',
    status: 'Compliant',
  },
  {
    title: 'Binary verification',
    desc: 'Release binaries with SHA-256 checksums on GitHub.',
    status: 'Verified',
  },
  {
    title: 'Air-gapped support',
    desc: 'Works fully offline with no network access.',
    status: 'Supported',
  },
]

export const CompliancePage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <PageShell
      title="Security & Compliance"
      eyebrow="Architecture verification"
      onNavigateHome={onNavigateHome}
    >
      <p className="text-[16px] font-light leading-relaxed text-ash">
        SaaS PMs send code and commit context to the cloud. AI Harness runs 100% on your hardware.
      </p>

      <div className="space-y-3">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="card-elevated flex items-start justify-between gap-4 !p-5"
          >
            <div>
              <div className="text-[16px] font-light text-cloud">{item.title}</div>
              <p className="mt-2 text-[14px] font-light text-ash">{item.desc}</p>
            </div>
            <span className="mono-label shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-ash">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
