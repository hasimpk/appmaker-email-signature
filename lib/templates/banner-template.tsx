"use client";

import React from "react";
import type { EmailSignatureTemplate, EmailSignatureData } from "./types";

function BannerTemplateRenderer({ data }: { data: EmailSignatureData }) {
  return (
    <div
      className="w-full max-w-[600px] bg-white font-sans"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Top Section */}
      <div className="flex flex-row flex-wrap items-start gap-4 p-4">
        {/* AppMaker Logo - Left Side */}
        <div className="flex items-center justify-center mt-4">
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png"
            alt="AppMaker"
            className="h-6 sm:h-6 shrink-0"
          />
        </div>

        <div className="border-l border-gray-200 pl-4">
          {/* Profile Card - Right Side */}
          <div className="flex-1 w-full">
            {/* First Row: Image, Name, Role */}
            <div className="flex flex-row items-center gap-4">
              {/* Profile Photo */}
              {data.showPhoto !== false && (
                <div className="relative h-20 w-20 rounded-full overflow-hidden shrink-0">
                  {data.photoUrl ? (
                    <img
                      src={data.photoUrl}
                      alt={data.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://cms-frontend-api.appmaker.xyz/api/media/file/user-placeholder.png"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Name and Role - Stacked */}
              <div className="flex flex-col min-w-0">
                <h2 className="text-lg sm:text-xl font-medium text-[#1a1a2e] leading-tight wrap-break-word">
                  {data.name}
                </h2>
                <p className="text-sm sm:text-md font-medium text-gray-500 leading-tight wrap-break-word">
                  {data.role}
                </p>
              </div>
            </div>

            {/* Second Row: Contact Links */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
              {data.phone && (
                <div className="flex items-center gap-1">
                  <img
                    src="https://cms-frontend-api.appmaker.xyz/api/media/file/phone-round.png"
                    alt="Phone"
                    className="h-6 w-6 shrink-0"
                  />
                  <a
                    href={`tel:${data.phone.replace(/\s/g, "")}`}
                    className="text-xs font-medium hover:underline break-all"
                  >
                    {data.phone}
                  </a>
                </div>
              )}

              {data.bookingLink && (
                <div className="flex items-center gap-1">
                  <img
                    src="https://cms-frontend-api.appmaker.xyz/api/media/file/calender-round.png"
                    alt="Calendar"
                    className="h-6 w-6 shrink-0"
                  />
                  <a
                    href={
                      data.bookingLink.startsWith("http")
                        ? data.bookingLink
                        : `https://${data.bookingLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium hover:underline break-all"
                  >
                    Book a Call
                  </a>
                </div>
              )}

              {data.linkedinProfile && (
                <div className="flex items-center gap-1">
                  <img
                    src="https://cms-frontend-api.appmaker.xyz/api/media/file/linkedin-round.png"
                    alt="LinkedIn"
                    className="h-6 w-6 shrink-0"
                  />
                  <a
                    href={
                      data.linkedinProfile.startsWith("http")
                        ? data.linkedinProfile
                        : `https://${data.linkedinProfile}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium hover:underline break-all"
                  >
                    linkedin
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Separator */}
      <div
        className="h-[4px] w-full"
        style={{
          background:
            "linear-gradient(to right, #6366f1, #8b5cf6, #ec4899, #f97316)",
        }}
      />

      {/* Trust badges footer */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 sm:divide-x divide-gray-200">
        <p className="text-xs text-gray-600 sm:pr-2 text-center sm:text-left">
          Trusted by <span className="font-bold">400+</span> Shopify Brands
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-0 flex-wrap divide-x divide-gray-200">
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png"
            alt="Levis"
            className="h-4 sm:h-5 px-2"
          />
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey-1.png"
            alt="Jockey"
            className="h-4 sm:h-5 px-2"
          />
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/gnc.png"
            alt="Puma"
            className="h-4 sm:h-5 px-2"
          />
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/greenworks.png"
            alt="Nike"
            className="h-4 sm:h-5 px-2 sm:pl-2"
          />
        </div>
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
        ? `<td width="80" valign="middle" style="padding-right:16px"><div style="width:80px;height:80px;border-radius:50%;overflow:hidden"><img src="${data.photoUrl}" style="width:100%;height:100%;object-fit:cover" /></div></td>`
        : `<td width="80" valign="middle" style="padding-right:16px"><div style="width:80px;height:80px;border-radius:50%;overflow:hidden"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/user-placeholder.png" style="width:100%;height:100%;object-fit:cover" /></div></td>`
      : "";

  const phoneHtml = data.phone
    ? `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-right:12px;display:inline-table;vertical-align:middle"><tr><td style="width:24px;height:24px;padding:0;text-align:center;vertical-align:middle"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/phone-round.png" style="width:24px;height:24px;display:block;margin:0 auto" /></td><td style="padding-left:4px;vertical-align:middle"><a href="${phoneLink}" style="color:#1a1a2e;text-decoration:none;font-size:12px;font-weight:500;vertical-align:middle">${data.phone}</a></td></tr></table>`
    : "";

  const bookingHtml = data.bookingLink
    ? `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-right:12px;display:inline-table;vertical-align:middle"><tr><td style="width:24px;height:24px;padding:0;text-align:center;vertical-align:middle"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/calender-round.png" style="width:24px;height:24px;display:block;margin:0 auto" /></td><td style="padding-left:4px;vertical-align:middle"><a href="${bookingHref}" target="_blank" style="color:#1a1a2e;text-decoration:none;font-size:12px;font-weight:500;vertical-align:middle">Book a Call</a></td></tr></table>`
    : "";

  const linkedinHtml = data.linkedinProfile
    ? `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;display:inline-table;vertical-align:middle"><tr><td style="width:24px;height:24px;padding:0;text-align:center;vertical-align:middle"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/linkedin-round.png" style="width:24px;height:24px;display:block;margin:0 auto" /></td><td style="padding-left:4px;vertical-align:middle"><a href="${linkedinHref}" target="_blank" style="color:#1a1a2e;text-decoration:none;font-size:12px;font-weight:500;vertical-align:middle">linkedin</a></td></tr></table>`
    : "";

  // Gradient separator - 4px height to match renderer
  const gradientSeparator = `<tr><td style="height:4px;background:linear-gradient(to right, #6366f1, #8b5cf6, #ec4899, #f97316);padding:0"></td></tr>`;

  // Calculate colspan and padding for contact links row
  const hasPhoto = data.showPhoto !== false;
  const contactColspan = hasPhoto ? "2" : "1"; // Photo + Name/Role = 2, or just Name/Role = 1

  return `<table style="font-family:system-ui,-apple-system,sans-serif;max-width:550px;width:100%;background:#fff;border-collapse:collapse">
    <tr>
      <td style="padding:16px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr>
            <td width="auto" align="center" valign="middle" style="padding-right:16px;vertical-align:top;text-align:center">
              <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png" style="height:24px;vertical-align:middle;object-fit:contain;display:block;margin:16px auto" />
            </td>
            <td width="1" style="padding-left:16px;border-left:1px solid #e5e7eb;vertical-align:middle"></td>
            <td valign="middle" style="vertical-align:middle">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                <tr>
                  ${photoHtml}
                  <td valign="top" style="vertical-align:middle">
                    <h2 style="margin:0 0 4px;font-size:18px;font-weight:500;color:#1a1a2e;line-height:1.2">${
                      data.name
                    }</h2>
                    <p style="margin:0;font-size:14px;font-weight:500;color:#6b7280;line-height:1.2">${
                      data.role
                    }</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="${contactColspan}" style="padding-top:12px;padding-left:4px">
                    ${phoneHtml || ""}${bookingHtml || ""}${linkedinHtml || ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${gradientSeparator}
    <tr>
      <td style="padding:12px 16px">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr>
            <td valign="middle" style="padding-right:16px;border-right:1px solid #e5e7eb">
              <p style="margin:0;font-size:12px;color:#4b5563;text-align:left">Trusted by <strong>400+</strong> Shopify Brands</p>
            </td>
            <td align="center" valign="middle" style="padding-left:16px">
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
                <tr>
                  <td style="padding:0 8px;border-right:1px solid #e5e7eb;vertical-align:middle;text-align:center"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png" style="height:20px;vertical-align:middle;object-fit:contain" /></td>
                  <td style="padding:0 8px;border-right:1px solid #e5e7eb;vertical-align:middle;text-align:center"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey-1.png" style="height:20px;vertical-align:middle;object-fit:contain" /></td>
                  <td style="padding:0 8px;border-right:1px solid #e5e7eb;vertical-align:middle;text-align:center"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/gnc.png" style="height:20px;vertical-align:middle;object-fit:contain" /></td>
                  <td style="padding:0 8px;vertical-align:middle;text-align:center"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/greenworks.png" style="height:20px;vertical-align:middle;object-fit:contain" /></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export const bannerTemplate: EmailSignatureTemplate = {
  id: "banner",
  metadata: {
    id: "banner",
    name: "Banner Template",
    description:
      "Professional banner-style email signature with gradient separator",
  },
  render: (data: EmailSignatureData) => <BannerTemplateRenderer data={data} />,
  generateHTML,
};
