/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMAZON_ACCESS_KEY_ID: string
  readonly VITE_AMAZON_SECRET_ACCESS_KEY: string
  readonly VITE_AMAZON_PARTNER_TAG: string
  readonly VITE_AMAZON_REGION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}