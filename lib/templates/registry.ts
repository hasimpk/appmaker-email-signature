import type { EmailSignatureTemplate } from "./types"
import { defaultTemplate } from "./default-template"
import { bannerTemplate } from "./banner-template"

export const templates: EmailSignatureTemplate[] = [defaultTemplate, bannerTemplate]

export function getTemplate(id: string): EmailSignatureTemplate | undefined {
  return templates.find((t) => t.id === id)
}

export function getDefaultTemplate(): EmailSignatureTemplate {
  return templates[0] || defaultTemplate
}

