"use client";

import React from "react";
import type { EmailSignatureTemplate, EmailSignatureData } from "./types";

function DefaultTemplateRenderer({ data }: { data: EmailSignatureData }) {
  return (
    <div
      className="relative w-full max-w-[600px] bg-white p-4 font-sans"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Gradient accent shape in top-left */}
      {data.showPhoto !== false && (
        <div className="absolute left-0 top-0 h-32 w-32">
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/signature-asset.png"
            alt="Gradient Accent"
            className="h-full w-full object-contain object-top"
          />
        </div>
      )}

      {/* Company branding top right */}
      <div className="absolute right-4 top-5 flex items-center gap-2">
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png"
          alt="AppMaker"
          className="h-5"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Profile photo */}
        {data.showPhoto !== false && (
          <div className="relative">
            <div className="relative h-28 w-28 overflow-hidden rounded-full">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src="https://cms-frontend-api.appmaker.xyz/api/media/file/user-placeholder.png"
                  alt="Gradient Accent"
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        )}

        {/* Contact info */}
        <div className="flex-1">
          <h2 className="mb-1 text-xl font-bold text-[#1a1a2e]">{data.name}</h2>
          <p className="mb-4 text-md font-medium text-[#e91e63]">{data.role}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {data.phone && (
                <div className="flex items-center gap-2">
                  <img
                    src="https://cms-frontend-api.appmaker.xyz/api/media/file/phone.png"
                    alt="Phone"
                    className="h-4 w-4"
                  />
                  <a
                    href={`tel:${data.phone.replace(/\s/g, "")}`}
                    className="text-sm text-[#1a1a2e] underline decoration-transparent transition-colors hover:decoration-[#1a1a2e]"
                  >
                    {data.phone}
                  </a>
                </div>
              )}

              {data.bookingLink && (
                <div className="flex items-center gap-2">
                  <img
                    src="https://cms-frontend-api.appmaker.xyz/api/media/file/calender.png"
                    alt="Calendar"
                    className="h-4 w-4"
                  />
                  <a
                    href={
                      data.bookingLink.startsWith("http")
                        ? data.bookingLink
                        : `https://${data.bookingLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#1a1a2e] underline transition-colors hover:decoration-[#1a1a2e]"
                  >
                    Book a Call
                  </a>
                </div>
              )}
            </div>

            {data.linkedinProfile && (
              <div className="flex items-center gap-2">
                <img
                  src="https://cms-frontend-api.appmaker.xyz/api/media/file/linkedin.png"
                  alt="LinkedIn"
                  className="h-4 w-4"
                />
                <a
                  href={
                    data.linkedinProfile.startsWith("http")
                      ? data.linkedinProfile
                      : `https://${data.linkedinProfile}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1a1a2e] underline transition-colors hover:decoration-[#1a1a2e]"
                >
                  {data.linkedinProfile
                    .replace(/^https?:\/\//, "")
                    .replace(/^www\./, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust badges footer */}
      <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between divide-x divide-gray-200">
        <p className="text-xs text-gray-600 pr-2">
          Trusted by <span className="font-bold">400+</span> Shopify Brands
        </p>
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png"
          alt="Levis"
          className="h-5 px-2"
        />
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey.png"
          alt="Jockey"
          className="h-5 px-2"
        />
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/gnc.png"
          alt="Puma"
          className="h-5 px-2"
        />
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/greenworks.png"
          alt="Nike"
          className="h-5 pl-2"
        />
      </div>
    </div>
  );
}

function generateHTML(data: EmailSignatureData): string {
  const phoneLink = data.phone ? `tel:${data.phone.replace(/\s/g, "")}` : "";
  const bookingHref = data.bookingLink
    ? data.bookingLink.startsWith("http")
      ? data.bookingLink
      : `https://${data.bookingLink}`
    : "";
  const linkedinHref = data.linkedinProfile
    ? data.linkedinProfile.startsWith("http")
      ? data.linkedinProfile
      : `https://${data.linkedinProfile}`
    : "";

  const photoHtml =
    data.showPhoto !== false
      ? data.photoUrl
        ? `<img src="${data.photoUrl}" alt="${data.name}" style="width: 112px; height: 112px; border-radius: 50%; object-fit: cover;" />`
        : `<img src="https://cms-frontend-api.appmaker.xyz/api/media/file/user-placeholder.png" alt="Gradient Accent" style="width: 112px; height: 112px; border-radius: 50%; object-fit: cover;" />`
      : "";

  // Header row with gradient accent and logo using table layout instead of absolute positioning
  const headerRow =
    data.showPhoto !== false
      ? `
  <!-- Header row with gradient accent and company logo -->
  <tr>
    <td style="padding-bottom: 8px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Gradient accent shape in top-left -->
          <td width="128" valign="top" style="padding: 0;">
            <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/signature-asset.png" alt="Gradient Accent" style="width: 128px; height: 95px; object-fit: contain; object-position: top; display: block;" />
          </td>
          <!-- Spacer to push logo to right -->
          <td width="*" style="padding: 0;"></td>
          <!-- Company branding top right -->
          <td width="auto" align="right" valign="top" style="padding-top: 4px;">
            <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png" alt="AppMaker" style="height: 20px; display: block;" />
          </td>
        </tr>
      </table>
    </td>
  </tr>
    `
      : `
  <!-- Header row with company logo only -->
  <tr>
    <td style="padding-bottom: 8px;" align="right">
      <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png" alt="AppMaker" style="height: 20px; display: block;" />
    </td>
  </tr>
    `;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; width: 100%; background-color: #ffffff; padding: 16px;">
${headerRow}
  <!-- Main content -->
  <tr>
    <td style="padding-bottom: 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <!-- Profile photo -->
          ${
            photoHtml
              ? `<td width="112" valign="top" style="padding-right: 16px;">
            ${photoHtml}
          </td>`
              : ""
          }
          
          <!-- Contact info -->
          <td valign="top">
            <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: bold; color: #1a1a2e; line-height: 1.2;">${
              data.name
            }</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 500; color: #e91e63; line-height: 1.4;">${
              data.role
            }</p>
            
            <table cellpadding="0" cellspacing="0" border="0">
              ${
                data.phone || data.bookingLink
                  ? `
              <tr>
                ${
                  data.phone
                    ? `
                <td style="padding-bottom: 8px; padding-right: 16px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="16" valign="middle" style="padding-right: 8px;">
                        <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/phone.png" alt="Phone" style="width: 16px; height: 16px;" />
                      </td>
                      <td valign="middle">
                        <a href="${phoneLink}" style="color: #1a1a2e; text-decoration: underline; text-decoration-color: transparent; font-size: 14px; line-height: 1.5;">${data.phone}</a>
                      </td>
                    </tr>
                  </table>
                </td>
                `
                    : ""
                }
                ${
                  data.bookingLink
                    ? `
                <td style="padding-bottom: 8px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="16" valign="middle" style="padding-right: 8px;">
                        <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/calender.png" alt="Calendar" style="width: 16px; height: 16px;" />
                      </td>
                      <td valign="middle">
                        <a href="${bookingHref}" target="_blank" rel="noopener noreferrer" style="color: #1a1a2e; text-decoration: underline; font-size: 14px; line-height: 1.5;">Book a Call</a>
                      </td>
                    </tr>
                  </table>
                </td>
                `
                    : ""
                }
              </tr>
              `
                  : ""
              }
              ${
                data.linkedinProfile
                  ? `
              <tr>
                <td style="padding-top: 8px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="16" valign="middle" style="padding-right: 8px;">
                        <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/linkedin.png" alt="LinkedIn" style="width: 16px; height: 16px;" />
                      </td>
                      <td valign="middle">
                        <a href="${linkedinHref}" target="_blank" rel="noopener noreferrer" style="color: #1a1a2e; text-decoration: underline; font-size: 14px; line-height: 1.5;">${data.linkedinProfile
                      .replace(/^https?:\/\//, "")
                      .replace(/^www\./, "")}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              `
                  : ""
              }
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  
  <!-- Trust badges footer -->
  <tr>
    <td style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding-right: 8px; border-right: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.5;">Trusted by 400+ Shopify Brands</p>
          </td>
          <td width="60" align="center" style="padding-left: 8px; padding-right: 8px; border-right: 1px solid #e5e7eb;">
            <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png" alt="Levis" style="height: 24px; display: block; max-width: 100%;" />
          </td>
          <td width="60" align="center" style="padding-left: 8px; padding-right: 8px; border-right: 1px solid #e5e7eb;">
            <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey.png" alt="Jockey" style="height: 24px; display: block; max-width: 100%;" />
          </td>
          <td width="60" align="center" style="padding-left: 8px; padding-right: 8px; border-right: 1px solid #e5e7eb;">
            <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/gnc.png" alt="Puma" style="height: 24px; display: block; max-width: 100%;" />
          </td>
          <td width="60" align="center" style="padding-left: 8px;">
            <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/greenworks.png" alt="Nike" style="height: 24px; display: block; max-width: 100%;" />
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `.trim();
}

export const defaultTemplate: EmailSignatureTemplate = {
  id: "default",
  metadata: {
    id: "default",
    name: "Default Template",
    description: "Clean and modern email signature template",
  },
  render: (data: EmailSignatureData) => <DefaultTemplateRenderer data={data} />,
  generateHTML,
};
