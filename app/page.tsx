"use client";

import { useState, useRef } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EmailSignatureForm } from "@/components/email-signature-form/email-signature-form";
import { TemplatePreview } from "@/components/template-preview/template-preview";
import type { EmailSignatureData } from "@/lib/templates/types";
import {
  exportAsHTML,
  exportAsImage,
  copyToClipboard,
} from "@/lib/utils/export";

export default function Home() {
  const [signatureData, setSignatureData] = useState<EmailSignatureData>({
    photoUrl: "",
    name: "Abhyudaya Adulkar",
    role: "VP Sales",
    phone: "+91 98235 30341",
    bookingLink: "",
    linkedinProfile: "linkedin.com/adulkarabhyudaya",
  });
  const [htmlCode, setHtmlCode] = useState("");
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (data: EmailSignatureData) => {
    setSignatureData(data);
    const html = exportAsHTML(data);
    setHtmlCode(html);
  };

  const handleCopyHTML = async () => {
    const success = await copyToClipboard(
      htmlCode || exportAsHTML(signatureData)
    );
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportImage = async (format: "png" | "jpeg") => {
    try {
      if (!previewRef.current) {
        console.error("Preview ref is not available");
        return;
      }

      // Find the actual signature content element
      // First try to find the element with data-export-target attribute
      const exportTarget = previewRef.current.querySelector(
        '[data-export-target="true"]'
      ) as HTMLElement;

      if (!exportTarget) {
        console.error("Could not find export target element");
        return;
      }

      // Get the direct child element (the actual signature content)
      // The template renders a div directly, so firstElementChild should be it
      let previewElement = exportTarget.firstElementChild as HTMLElement;

      // Fallback: if no child found, use the export target itself
      if (!previewElement) {
        console.warn("No child element found, using export target element");
        previewElement = exportTarget;
      }

      if (!previewElement) {
        console.error("Could not find preview element for export");
        return;
      }

      const filename = `email-signature-${signatureData.name
        .replace(/\s/g, "-")
        .toLowerCase()}`;

      await exportAsImage(previewElement, format, filename);
    } catch (error) {
      console.error("Error in handleExportImage:", error);
      alert(
        `Failed to export image: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center items-center justify-center flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Email Signature</h1>
          <p className="text-sm text-gray-600">
            Company Email Signature Generator
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            <EmailSignatureForm
              onSubmit={handleFormSubmit}
              defaultValues={signatureData}
            />

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Export your email signature as HTML or image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportImage("png")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleExportImage("jpeg")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export JPEG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Live preview of your email signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                  <div ref={previewRef}>
                    <TemplatePreview data={signatureData} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HTML Code */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>HTML Code</CardTitle>
                    <CardDescription>
                      Copy this HTML code to use in your email client
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyHTML}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy HTML
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={htmlCode || exportAsHTML(signatureData)}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                  onClick={(e) => {
                    e.currentTarget.select();
                    handleCopyHTML();
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
