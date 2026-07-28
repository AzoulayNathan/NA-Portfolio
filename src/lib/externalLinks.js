const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')

/** Live NA Websites digital showroom (Cloudflare Pages). */
export const NA_WEBSITES_URL =
  import.meta.env.VITE_NA_WEBSITES_URL ??
  (isLocal ? 'http://127.0.0.1:5174/' : 'https://na-websites.pages.dev/')

/** NA Business Systems — site produit dédié (local business digital systems). */
export const NA_BUSINESS_SYSTEMS_URL =
  import.meta.env.VITE_NA_BUSINESS_SYSTEMS_URL ??
  (isLocal ? 'http://127.0.0.1:5184/' : 'https://na-business-systems.pages.dev/')

/** Formula Builder — pedagogical formula app (TeachingApp). */
export const FORMULA_BUILDER_GITHUB_URL =
  'https://github.com/AzoulayNathan/FormulaBuilder_PedagogicalApp'
export const FORMULA_BUILDER_APP_URL = 'https://na-formula-builder.pages.dev'

/** Google Calendar booking — 30 min avec Nathan */
export const BOOKING_CALENDAR_URL = 'https://calendar.app.google/FwvLrs17YcM1Ksmy9'
