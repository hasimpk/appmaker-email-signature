"use client";

import { useState, useRef } from "react";
import { Download, Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EmailSignatureForm } from "@/components/email-signature-form/email-signature-form";
import { TemplatePreview } from "@/components/template-preview/template-preview";
import type { EmailSignatureData } from "@/lib/templates/types";
import {
  exportAsHTML,
  exportAsImage,
  copyHTMLToClipboard,
} from "@/lib/utils/export";

export default function Home() {
  const [signatureData, setSignatureData] = useState<EmailSignatureData>({
    photoUrl: "",
    name: "John Doe",
    role: "VP Sales",
    phone: "+91 99966 60606",
    bookingLink: "",
    linkedinProfile: "linkedin.com/john-doe",
  });
  const [templateId, setTemplateId] = useState<string>("banner");
  const [htmlCode, setHtmlCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg">("png");
  const [exportScale, setExportScale] = useState<number>(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (
    data: EmailSignatureData,
    selectedTemplateId?: string
  ) => {
    setSignatureData(data);
    const currentTemplateId = selectedTemplateId || templateId;
    setTemplateId(currentTemplateId);
    const html = exportAsHTML(data, currentTemplateId);
    setHtmlCode(html);
  };

  const handleCopyHTML = async () => {
    try {
      // Use the template's generateHTML method for Gmail compatibility
      // This produces table-based HTML with inline styles, which is best for email clients
      const htmlToCopy = htmlCode || exportAsHTML(signatureData, templateId);

      const success = await copyHTMLToClipboard(htmlToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error copying HTML:", error);
      // Fallback: try to copy the generated HTML
      try {
        const htmlToCopy = exportAsHTML(signatureData, templateId);
        const success = await copyHTMLToClipboard(htmlToCopy);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
    }
  };

  const handleExportImage = async () => {
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

      await exportAsImage(previewElement, exportFormat, filename, exportScale);
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
              defaultTemplateId={templateId}
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
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Format</Label>
                    <Select
                      id="export-format"
                      value={exportFormat}
                      onChange={(e) =>
                        setExportFormat(e.target.value as "png" | "jpeg")
                      }
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="export-scale">Size</Label>
                    <Select
                      id="export-scale"
                      value={exportScale.toString()}
                      onChange={(e) =>
                        setExportScale(parseFloat(e.target.value))
                      }
                    >
                      <option value="0.5">0.5x</option>
                      <option value="1">1x (Optimal for Gmail)</option>
                      <option value="2">2x</option>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleExportImage}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Image
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
                <CardAction>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost">
                        <Info className="h-4 w-4" />
                        <span>Instructions</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>How to Add Signature to Gmail</SheetTitle>
                        <SheetDescription>
                          Follow these steps to add your email signature to
                          Gmail
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6 px-4 pb-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">
                            Step 1: Copy the HTML Code
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Click the button below to copy your email signature
                            HTML code to your clipboard.
                          </p>
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={handleCopyHTML}
                          >
                            {copied ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy HTML Code
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">
                            Step 2: Open Gmail Settings
                          </h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>
                              <a
                                href="https://mail.google.com/mail/u/0/#settings/general"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                              >
                                Open Gmail Settings
                              </a>{" "}
                              or click the gear icon (⚙️) in the top right
                              corner and select &quot;See all settings&quot;
                            </li>
                          </ol>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">
                            Step 3: Navigate to Signature Settings
                          </h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Click on the &quot;General&quot; tab</li>
                            <li>
                              Scroll down to the &quot;Signature&quot; section
                            </li>
                            <li>
                              If you don&apos;t have a signature yet, click
                              &quot;Create new&quot;
                            </li>
                            <li>
                              If you want to replace an existing signature,
                              select it from the dropdown
                            </li>
                          </ol>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">
                            Step 4: Paste Your Signature
                          </h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>In the signature editor, right-click</li>
                            <li>Paste using Ctrl+V (Cmd+V on Mac)</li>
                            <li>Your signature should appear in the editor</li>
                            <li>
                              Make sure &quot;Insert this signature before
                              quoted text in replies and remove the
                              &quot;--&quot; line that precedes it&quot; is
                              checked if you want it in replies
                            </li>
                          </ol>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-semibold text-base">
                            Step 5: Save Your Changes
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Scroll to the bottom of the settings page and click
                            &quot;Save Changes&quot;. Your signature will now
                            automatically appear in new emails!
                          </p>
                        </div>
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>Tip:</strong> You can set different
                            signatures for different email addresses by
                            selecting the address from the dropdown in the
                            Signature section.
                          </p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                  <div ref={previewRef}>
                    <TemplatePreview
                      data={signatureData}
                      templateId={templateId}
                    />
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
              <CardContent className="space-y-3">
                <Textarea
                  value={htmlCode || exportAsHTML(signatureData, templateId)}
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
