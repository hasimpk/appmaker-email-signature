import type { EmailSignatureData } from "@/lib/templates/types"
import { getTemplate } from "@/lib/templates/registry"
import { toPng, toJpeg } from "html-to-image"

export function exportAsHTML(data: EmailSignatureData, templateId = "default"): string {
  const template = getTemplate(templateId) || getTemplate("default")!
  return template.generateHTML(data)
}

// Helper function to convert external images to data URLs via proxy
async function convertExternalImagesToDataUrls(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img")
  const promises: Promise<void>[] = []

  images.forEach((img) => {
    const imgSrc = img.src
    // Check if it's an external image
    if (imgSrc && imgSrc.startsWith("http") && !imgSrc.startsWith(window.location.origin)) {
      // Skip if already a data URL or blob URL
      if (imgSrc.startsWith("data:") || imgSrc.startsWith("blob:")) {
        return
      }

      const promise = (async () => {
        try {
          // Use our proxy API to fetch the image
          const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imgSrc)}`
          
          // Fetch through proxy
          const response = await fetch(proxyUrl)
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`)
          }

          const blob = await response.blob()
          
          // Convert to data URL
          return new Promise<void>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              if (reader.result && typeof reader.result === "string") {
                // Store original src for debugging
                const originalSrc = img.src
                const dataUrl = reader.result
                
                // Set up load handlers before changing src
                const handleLoad = () => {
                  img.removeEventListener("load", handleLoad)
                  img.removeEventListener("error", handleError)
                  resolve()
                }
                
                const handleError = () => {
                  img.removeEventListener("load", handleLoad)
                  img.removeEventListener("error", handleError)
                  console.warn(`Image failed to reload after conversion: ${originalSrc}`)
                  resolve() // Still resolve to continue with export
                }
                
                img.addEventListener("load", handleLoad)
                img.addEventListener("error", handleError)
                
                // Change src to data URL - this will trigger reload
                img.src = dataUrl
                
                // If already complete (cached), resolve immediately
                if (img.complete) {
                  handleLoad()
                }
              } else {
                reject(new Error("Failed to convert blob to data URL"))
              }
            }
            reader.onerror = () => reject(new Error("FileReader error"))
            reader.readAsDataURL(blob)
          })
        } catch (error) {
          console.warn(`Failed to convert image ${imgSrc} to data URL:`, error)
          // Don't throw - continue with other images
        }
      })()

      promises.push(promise)
    }
  })

  await Promise.all(promises)
}

// Helper function to wait for all images to load
function waitForImages(element: HTMLElement, timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const images = element.querySelectorAll("img")
    if (images.length === 0) {
      resolve()
      return
    }

    let loadedCount = 0
    let errorCount = 0
    const totalImages = images.length
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout waiting for ${totalImages - loadedCount} images to load`))
    }, timeout)

    const checkComplete = () => {
      if (loadedCount + errorCount === totalImages) {
        clearTimeout(timeoutId)
        if (errorCount > 0) {
          console.warn(`${errorCount} images failed to load, but proceeding with export`)
        }
        resolve()
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++
        checkComplete()
      } else {
        img.onload = () => {
          loadedCount++
          checkComplete()
        }
        img.onerror = () => {
          errorCount++
          checkComplete()
        }
      }
    })
  })
}

export async function exportAsImage(
  element: HTMLElement,
  format: "png" | "jpeg" = "png",
  filename = "email-signature"
): Promise<void> {
  let link: HTMLAnchorElement | null = null
  
  try {
    if (!element) {
      throw new Error("Element is required for export")
    }

    // Validate element is in the DOM
    if (!element.isConnected) {
      throw new Error("Element is not connected to the DOM")
    }

    // Log element info for debugging
    console.log("Exporting element:", {
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      width: element.offsetWidth,
      height: element.offsetHeight,
      imageCount: element.querySelectorAll("img").length,
    })

    // Check for external images and convert them to data URLs via proxy
    const images = element.querySelectorAll("img")
    const externalImages: string[] = []
    images.forEach((img) => {
      if (img.src && img.src.startsWith("http") && !img.src.startsWith(window.location.origin)) {
        // Skip data URLs and blob URLs
        if (!img.src.startsWith("data:") && !img.src.startsWith("blob:")) {
          externalImages.push(img.src)
        }
      }
    })
    
    if (externalImages.length > 0) {
      console.log(`Converting ${externalImages.length} external images to data URLs...`)
      try {
        await convertExternalImagesToDataUrls(element)
        console.log("Successfully converted external images to data URLs")
      } catch (error) {
        console.warn("Failed to convert some external images, proceeding anyway:", error)
      }
    }

    // Wait for images to load/reload after conversion
    try {
      await waitForImages(element)
    } catch (error) {
      console.warn("Some images may not have loaded, proceeding with export:", error)
    }

    // Export options - we can use useCORS: false now since images are data URLs
    const exportOptions = {
      quality: format === "png" ? 1 : 0.95,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      useCORS: false, // Not needed since images are now data URLs
      cacheBust: false, // Not needed
    }

    const dataUrl =
      format === "png"
        ? await toPng(element, exportOptions)
        : await toJpeg(element, exportOptions)

    if (!dataUrl) {
      throw new Error("Failed to generate image data URL")
    }

    link = document.createElement("a")
    link.download = `${filename}.${format}`
    link.href = dataUrl
    link.style.display = "none"
    
    // Append to body temporarily to ensure it works in all browsers
    document.body.appendChild(link)
    
    try {
      link.click()
      // Remove the link after a short delay to ensure download starts
      setTimeout(() => {
        if (link && link.parentNode) {
          document.body.removeChild(link)
        }
      }, 100)
    } catch (clickError) {
      if (link && link.parentNode) {
        document.body.removeChild(link)
      }
      throw new Error(`Failed to trigger download: ${clickError instanceof Error ? clickError.message : String(clickError)}`)
    }
  } catch (error) {
    // Clean up link if it exists
    if (link && link.parentNode) {
      try {
        document.body.removeChild(link)
      } catch {
        // Ignore cleanup errors
      }
    }

    // Better error logging with Event object support
    let errorMessage = "Unknown error"
    let errorDetails = ""

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || ""
    } else if (error instanceof Event) {
      errorMessage = error.type || "Event error occurred"
      errorDetails = `Event type: ${error.type}, target: ${error.target}, timestamp: ${error.timeStamp}`
      // Log Event properties for debugging
      console.error("Event error details:", {
        type: error.type,
        target: error.target,
        currentTarget: error.currentTarget,
        timeStamp: error.timeStamp,
        bubbles: error.bubbles,
        cancelable: error.cancelable,
      })
    } else if (typeof error === "string") {
      errorMessage = error
    } else if (error && typeof error === "object") {
      try {
        // Try to extract useful properties from object
        const errorObj = error as Record<string, unknown>
        if (errorObj.message) {
          errorMessage = String(errorObj.message)
        } else if (errorObj.type) {
          errorMessage = String(errorObj.type)
        } else {
          errorMessage = JSON.stringify(error)
        }
        errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error))
      } catch {
        errorMessage = String(error)
      }
    } else {
      errorMessage = String(error)
    }

    console.error("Error exporting image:", {
      message: errorMessage,
      details: errorDetails,
      error: error,
      errorType: typeof error,
      errorConstructor: error?.constructor?.name,
      isEvent: error instanceof Event,
      isError: error instanceof Error,
    })
    
    throw new Error(errorMessage)
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

