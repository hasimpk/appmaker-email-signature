"use client"

import React, { useRef } from "react"
import type { EmailSignatureData } from "@/lib/templates/types"
import { getTemplate } from "@/lib/templates/registry"

interface TemplatePreviewProps {
  data: EmailSignatureData
  templateId?: string
}

export function TemplatePreview({ data, templateId = "default" }: TemplatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const template = getTemplate(templateId) || getTemplate("default")!

  return (
    <div ref={previewRef} className="flex justify-center" data-export-target="true">
      {template.render(data)}
    </div>
  )
}

export function getPreviewElement(data: EmailSignatureData, templateId = "default"): HTMLDivElement {
  const template = getTemplate(templateId) || getTemplate("default")!
  const container = document.createElement("div")
  const tempContainer = document.createElement("div")
  tempContainer.innerHTML = template.generateHTML(data)
  const firstChild = tempContainer.firstElementChild
  if (firstChild) {
    container.appendChild(firstChild.cloneNode(true))
  }
  return container
}

