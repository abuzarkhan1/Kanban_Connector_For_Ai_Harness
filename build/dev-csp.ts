import type { Plugin } from 'vite'

/**
 * @vitejs/plugin-react injects the React refresh preamble as an *inline*
 * module script in development. The production CSP (script-src 'self')
 * blocks inline scripts, which would render the dev app blank.
 *
 * This plugin relaxes the CSP only in dev (apply: 'serve'); the built
 * production index.html keeps the strict policy.
 */
const STRICT_SCRIPT_SRC = "script-src 'self'"
const DEV_SCRIPT_SRC = "script-src 'self' 'unsafe-inline'"

export function relaxDevCsp(html: string): string {
  if (html.includes(DEV_SCRIPT_SRC)) return html
  return html.replace(STRICT_SCRIPT_SRC, DEV_SCRIPT_SRC)
}

export function devCspPlugin(): Plugin {
  return {
    name: 'aihpm:relax-dev-csp',
    apply: 'serve',
    transformIndexHtml(html) {
      return relaxDevCsp(html)
    }
  }
}
