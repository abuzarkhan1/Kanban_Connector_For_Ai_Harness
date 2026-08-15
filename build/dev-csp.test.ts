import { describe, expect, it } from 'vitest'
import { relaxDevCsp } from './dev-csp'

const STRICT_HTML =
  '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; connect-src \'self\' ws://localhost:*" />'

describe('dev CSP relaxation', () => {
  it('allows inline scripts only in the dev transform', () => {
    const relaxed = relaxDevCsp(STRICT_HTML)
    expect(relaxed).toContain("script-src 'self' 'unsafe-inline'")
    // Styles were already allowed inline; connect-src must not be touched.
    expect(relaxed).toContain("style-src 'self' 'unsafe-inline'")
    expect(relaxed).toContain("connect-src 'self' ws://localhost:*")
  })

  it('keeps the production policy strict', () => {
    // No transform applied => the original strict script-src survives.
    expect(STRICT_HTML).toContain("script-src 'self';")
    expect(STRICT_HTML).not.toContain("script-src 'self' 'unsafe-inline'")
  })

  it('is idempotent', () => {
    const once = relaxDevCsp(STRICT_HTML)
    expect(relaxDevCsp(once)).toBe(once)
  })
})
