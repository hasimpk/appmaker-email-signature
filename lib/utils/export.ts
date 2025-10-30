import type { EmailSignatureData } from "@/lib/templates/types"
import { getTemplate } from "@/lib/templates/registry"
import { toPng, toJpeg } from "html-to-image"

export function exportAsHTML(data: EmailSignatureData, templateId = "default"): string {
  const template = getTemplate(templateId) || getTemplate("default")!
  return template.generateHTML(data)
}

export async function exportAsImage(
  element: HTMLElement,
  format: "png" | "jpeg" = "png",
  filename = "email-signature"
): Promise<void> {
  try {
    const dataUrl =
      format === "png"
        ? await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
          })
        : await toJpeg(element, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
          })

    const link = document.createElement("a")
    link.download = `${filename}.${format}`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error("Error exporting image:", error)
    throw error
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Error copying to clipboard:", error)
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

