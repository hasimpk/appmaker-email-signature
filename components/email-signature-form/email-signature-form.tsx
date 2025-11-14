"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmailSignatureData } from "@/lib/templates/types";
import { compositeProfilePhoto } from "@/lib/utils/image-composition";
import { Select } from "@/components/ui/select";
import { templates } from "@/lib/templates/registry";

const emailSignatureSchema = z.object({
  templateId: z.string().optional(),
  photoUrl: z.string().optional(),
  showPhoto: z.boolean(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().optional(),
  bookingLink: z.string().optional(),
  linkedinProfile: z.string().optional(),
});

type EmailSignatureFormData = z.infer<typeof emailSignatureSchema>;

interface EmailSignatureFormProps {
  onSubmit: (data: EmailSignatureData, templateId?: string) => void;
  defaultValues?: Partial<EmailSignatureData>;
  defaultTemplateId?: string;
}

export function EmailSignatureForm({
  onSubmit,
  defaultValues,
  defaultTemplateId = "default",
}: EmailSignatureFormProps) {
  const [photoUploadType, setPhotoUploadType] = useState<"url" | "file">("url");
  const [photoPreview, setPhotoPreview] = useState<string>(
    defaultValues?.photoUrl || ""
  );
  const [isComposing, setIsComposing] = useState(false);
  const [compositionError, setCompositionError] = useState<string | null>(null);
  const urlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const originalPhotoRef = useRef<string | null>(
    defaultValues?.photoUrl &&
      !defaultValues.photoUrl.startsWith("data:image/png")
      ? defaultValues.photoUrl
      : null
  );

  const form = useForm<EmailSignatureFormData>({
    resolver: zodResolver(emailSignatureSchema),
    defaultValues: {
      templateId: "banner", // Always use banner template
      photoUrl: defaultValues?.photoUrl || "",
      showPhoto: defaultValues?.showPhoto ?? true,
      name: defaultValues?.name || "",
      role: defaultValues?.role || "",
      phone: defaultValues?.phone || "",
      bookingLink: defaultValues?.bookingLink || "",
      linkedinProfile: defaultValues?.linkedinProfile || "",
    },
  });

  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB maximum)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        setCompositionError("File size must be less than 2MB");
        return;
      }

      const currentTemplateId = "banner"; // Always use banner template
      const shouldCompose = false; // Banner template doesn't need composition

      setIsComposing(true);
      setCompositionError(null);

      try {
        // Upload to CDN
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to upload image to CDN");
        }

        const { url } = await response.json();

        if (!url) {
          throw new Error("No URL returned from upload");
        }

        // Store original CDN URL
        originalPhotoRef.current = url;

        if (shouldCompose) {
          // Create composite image only for default template
          const composite = await compositeProfilePhoto(url);
          setPhotoPreview(composite);
          form.setValue("photoUrl", composite);
        } else {
          // Use CDN URL for other templates (like banner)
          setPhotoPreview(url);
          form.setValue("photoUrl", url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setCompositionError(
          error instanceof Error ? error.message : "Failed to upload image"
        );
        // On error, fallback to data URL for immediate preview
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            setPhotoPreview(result);
            form.setValue("photoUrl", result);
            setIsComposing(false);
          };
          reader.onerror = () => {
            setIsComposing(false);
          };
          reader.readAsDataURL(file);
        } catch {
          setIsComposing(false);
        }
      } finally {
        setIsComposing(false);
      }
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(
      {
        photoUrl: data.photoUrl || "",
        showPhoto: data.showPhoto ?? true,
        name: data.name,
        role: data.role,
        phone: data.phone,
        bookingLink: data.bookingLink,
        linkedinProfile: data.linkedinProfile,
      },
      "banner" // Always use banner template
    );
  });

  // Auto-update on field changes
  const stableOnSubmit = useCallback(
    (data: EmailSignatureData, templateId?: string) => {
      onSubmit(data, templateId);
    },
    [onSubmit]
  );

  // Handle URL input changes with debouncing
  const handleUrlChange = useCallback(
    (url: string) => {
      // Clear existing timeout
      if (urlTimeoutRef.current) {
        clearTimeout(urlTimeoutRef.current);
      }

      if (url && url.trim() !== "") {
        const trimmedUrl = url.trim();
        // Check if it's a valid URL
        if (
          trimmedUrl.startsWith("http://") ||
          trimmedUrl.startsWith("https://") ||
          trimmedUrl.startsWith("data:")
        ) {
          const currentTemplateId = "banner"; // Always use banner template
          const shouldCompose = false; // Banner template doesn't need composition

          setIsComposing(shouldCompose);
          setCompositionError(null);

          urlTimeoutRef.current = setTimeout(async () => {
            try {
              // Store original URL
              originalPhotoRef.current = trimmedUrl;

              if (shouldCompose) {
                // Create composite image only for default template
                const composite = await compositeProfilePhoto(trimmedUrl);
                setPhotoPreview(composite);
                form.setValue("photoUrl", composite, { shouldValidate: true });
              } else {
                // Use original URL for other templates (like banner)
                setPhotoPreview(trimmedUrl);
                form.setValue("photoUrl", trimmedUrl, { shouldValidate: true });
              }
            } catch (error) {
              console.error("Error processing image:", error);
              setCompositionError(
                error instanceof Error
                  ? error.message
                  : "Failed to process image"
              );
              // Fallback to original URL if processing fails
              setPhotoPreview(trimmedUrl);
            } finally {
              setIsComposing(false);
            }
          }, 500); // Debounce for 500ms
        }
      }
    },
    [form]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (urlTimeoutRef.current) {
        clearTimeout(urlTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name && value.role) {
        stableOnSubmit(
          {
            photoUrl: value.photoUrl || "",
            showPhoto: value.showPhoto ?? true,
            name: value.name,
            role: value.role,
            phone: value.phone || undefined,
            bookingLink: value.bookingLink || undefined,
            linkedinProfile: value.linkedinProfile || undefined,
          },
          "banner" // Always use banner template
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form, stableOnSubmit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Signature Generator</CardTitle>
        <CardDescription>
          Customize your email signature template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template selector hidden - using banner template as default */}
            {false && (
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <Select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const newTemplateId =
                          e.target.value || defaultTemplateId;
                        const currentValues = form.getValues();

                        // If switching templates and we have an original photo, reprocess it
                        if (
                          originalPhotoRef.current &&
                          currentValues.photoUrl
                        ) {
                          const shouldCompose = newTemplateId === "default";
                          const originalPhoto = originalPhotoRef.current;

                          if (
                            shouldCompose &&
                            !currentValues.photoUrl.startsWith("data:image/png")
                          ) {
                            // Switch to default template - need to create composite
                            setIsComposing(true);
                            compositeProfilePhoto(originalPhoto)
                              .then((composite) => {
                                form.setValue("photoUrl", composite);
                                setPhotoPreview(composite);
                                setIsComposing(false);
                                // Trigger update with new composite
                                const updatedValues = form.getValues();
                                if (updatedValues.name && updatedValues.role) {
                                  stableOnSubmit(
                                    {
                                      photoUrl: composite,
                                      showPhoto:
                                        updatedValues.showPhoto ?? true,
                                      name: updatedValues.name,
                                      role: updatedValues.role,
                                      phone: updatedValues.phone || undefined,
                                      bookingLink:
                                        updatedValues.bookingLink || undefined,
                                      linkedinProfile:
                                        updatedValues.linkedinProfile ||
                                        undefined,
                                    },
                                    newTemplateId
                                  );
                                }
                              })
                              .catch((error) => {
                                console.error(
                                  "Error creating composite:",
                                  error
                                );
                                // Fallback to original
                                form.setValue("photoUrl", originalPhoto);
                                setPhotoPreview(originalPhoto);
                                setIsComposing(false);
                              });
                          } else if (
                            !shouldCompose &&
                            currentValues.photoUrl.startsWith("data:image/png")
                          ) {
                            // Switch to banner template - use original image
                            form.setValue("photoUrl", originalPhoto);
                            setPhotoPreview(originalPhoto);
                            // Trigger update with original photo
                            if (currentValues.name && currentValues.role) {
                              stableOnSubmit(
                                {
                                  photoUrl: originalPhoto,
                                  showPhoto: currentValues.showPhoto ?? true,
                                  name: currentValues.name,
                                  role: currentValues.role,
                                  phone: currentValues.phone || undefined,
                                  bookingLink:
                                    currentValues.bookingLink || undefined,
                                  linkedinProfile:
                                    currentValues.linkedinProfile || undefined,
                                },
                                newTemplateId
                              );
                            }
                            return; // Early return since we've handled the update
                          }
                        }

                        // Trigger immediate update when template changes
                        if (currentValues.name && currentValues.role) {
                          stableOnSubmit(
                            {
                              photoUrl: currentValues.photoUrl || "",
                              showPhoto: currentValues.showPhoto ?? true,
                              name: currentValues.name,
                              role: currentValues.role,
                              phone: currentValues.phone || undefined,
                              bookingLink:
                                currentValues.bookingLink || undefined,
                              linkedinProfile:
                                currentValues.linkedinProfile || undefined,
                            },
                            newTemplateId
                          );
                        }
                      }}
                    >
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.metadata.name}
                        </option>
                      ))}
                    </Select>
                    <FormDescription>
                      Choose a template for your email signature
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormLabel>Profile Photo</FormLabel>
                    <FormField
                      control={form.control}
                      name="showPhoto"
                      render={({ field: showPhotoField }) => (
                        <FormControl>
                          <Switch
                            checked={showPhotoField.value ?? true}
                            onCheckedChange={showPhotoField.onChange}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                  {form.watch("showPhoto") !== false && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={
                            photoUploadType === "url" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setPhotoUploadType("url")}
                        >
                          <Link2 className="mr-2 h-4 w-4" />
                          URL
                        </Button>
                        <Button
                          type="button"
                          variant={
                            photoUploadType === "file" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setPhotoUploadType("file")}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      {photoUploadType === "url" ? (
                        <FormControl>
                          <Input
                            placeholder="https://example.com/photo.jpg"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              field.onChange(e);
                              handleUrlChange(e.target.value);
                            }}
                          />
                        </FormControl>
                      ) : (
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileChange}
                          />
                        </FormControl>
                      )}
                      {isComposing && (
                        <div className="mt-2 text-sm text-gray-500">
                          Processing image...
                        </div>
                      )}
                      {compositionError && (
                        <div className="mt-2 text-sm text-red-500">
                          {compositionError}
                        </div>
                      )}
                    </div>
                  )}
                  {form.watch("showPhoto") !== false && (
                    <FormDescription>
                      Upload a photo or provide an image URL (max 2MB, square
                      aspect ratio)
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VP Sales"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 234 567 8900"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Format: +1 234 567 8900</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="calendly.com/user or https://..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your calendar booking URL (can be shortened)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="linkedin.com/in/username or https://..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your LinkedIn profile URL (can be shortened)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
