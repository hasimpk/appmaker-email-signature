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
  onSubmit: (data: EmailSignatureData) => void;
  defaultValues?: Partial<EmailSignatureData>;
}

export function EmailSignatureForm({
  onSubmit,
  defaultValues,
}: EmailSignatureFormProps) {
  const [photoUploadType, setPhotoUploadType] = useState<"url" | "file">("url");
  const [photoPreview, setPhotoPreview] = useState<string>(
    defaultValues?.photoUrl || ""
  );
  const [isComposing, setIsComposing] = useState(false);
  const [compositionError, setCompositionError] = useState<string | null>(null);
  const urlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<EmailSignatureFormData>({
    resolver: zodResolver(emailSignatureSchema),
    defaultValues: {
      templateId: "default",
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
      setIsComposing(true);
      setCompositionError(null);

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const result = reader.result as string;
            // Create composite image
            const composite = await compositeProfilePhoto(result);
            setPhotoPreview(composite);
            form.setValue("photoUrl", composite);
          } catch (error) {
            console.error("Error creating composite:", error);
            setCompositionError(
              error instanceof Error
                ? error.message
                : "Failed to create composite image"
            );
            // Fallback to original image if composition fails
            const result = reader.result as string;
            setPhotoPreview(result);
            form.setValue("photoUrl", result);
          } finally {
            setIsComposing(false);
          }
        };
        reader.onerror = () => {
          setCompositionError("Failed to read file");
          setIsComposing(false);
        };
        reader.readAsDataURL(file);
      } catch {
        setCompositionError("Failed to process file");
        setIsComposing(false);
      }
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      photoUrl: data.photoUrl || "",
      showPhoto: data.showPhoto ?? true,
      name: data.name,
      role: data.role,
      phone: data.phone,
      bookingLink: data.bookingLink,
      linkedinProfile: data.linkedinProfile,
    });
  });

  // Auto-update on field changes
  const stableOnSubmit = useCallback(
    (data: EmailSignatureData) => {
      onSubmit(data);
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
          setIsComposing(true);
          setCompositionError(null);

          urlTimeoutRef.current = setTimeout(async () => {
            try {
              const composite = await compositeProfilePhoto(trimmedUrl);
              setPhotoPreview(composite);
              form.setValue("photoUrl", composite, { shouldValidate: true });
            } catch (error) {
              console.error("Error creating composite:", error);
              setCompositionError(
                error instanceof Error
                  ? error.message
                  : "Failed to create composite image"
              );
              // Fallback to original URL if composition fails
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
        stableOnSubmit({
          photoUrl: value.photoUrl || "",
          showPhoto: value.showPhoto ?? true,
          name: value.name,
          role: value.role,
          phone: value.phone || undefined,
          bookingLink: value.bookingLink || undefined,
          linkedinProfile: value.linkedinProfile || undefined,
        });
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
            {/* <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select {...field}>
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
            /> */}

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
                      Upload a photo or provide an image URL
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
