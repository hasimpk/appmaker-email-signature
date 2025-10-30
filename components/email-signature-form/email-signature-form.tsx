"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Select } from "@/components/ui/select";
import type { EmailSignatureData } from "@/lib/templates/types";
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
  onSubmit: (data: EmailSignatureData) => void;
  defaultValues?: Partial<EmailSignatureData>;
}

export function EmailSignatureForm({
  onSubmit,
  defaultValues,
}: EmailSignatureFormProps) {
  const [photoUploadType, setPhotoUploadType] = useState<"url" | "file">("url");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(
    defaultValues?.photoUrl || ""
  );

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

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        form.setValue("photoUrl", result);
      };
      reader.readAsDataURL(file);
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
                      {photoPreview && (
                        <div className="mt-2">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                          />
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
