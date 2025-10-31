"use client";

import React from "react";
import type { EmailSignatureTemplate, EmailSignatureData } from "./types";

function DefaultTemplateRenderer({ data }: { data: EmailSignatureData }) {
  return (
    <div
      className="w-full max-w-[600px] bg-white font-sans"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Main content */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-4">
        {/* Profile photo with mobile logo */}
        {data.showPhoto !== false && (
          <div className="flex items-start justify-between w-full sm:w-auto sm:block">
            <div className="relative h-36 w-40 overflow-hidden">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src="https://cms-frontend-api.appmaker.xyz/api/media/file/signature-placeholder.png"
                  alt="Gradient Accent"
                  className="h-full w-full"
                />
              )}
            </div>
            {/* Mobile logo - right aligned */}
            <img
              src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png"
              alt="AppMaker"
              className="h-5 sm:hidden shrink-0 mt-2 pr-4"
            />
          </div>
        )}

        {/* Contact info */}
        <div
          className={`flex-1 w-full pt-2 sm:pt-4 pr-4 ${
            data.showPhoto === false ? "pl-4" : "pl-4 sm:pl-0"
          }`}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a2e]">
              {data.name}
            </h2>
            {/* Desktop logo - next to name */}
            <img
              src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png"
              alt="AppMaker"
              className="hidden sm:block h-5 shrink-0"
            />
          </div>
          <p className="mb-3 sm:mb-4 text-sm sm:text-md font-medium text-[#e91e63]">
            {data.role}
          </p>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              {data.phone && (
                <div className="flex items-center gap-2">
                  <img
                    src="https://cms-frontend-api.appmaker.xyz/api/media/file/phone.png"
                    alt="Phone"
                    className="h-4 w-4 shrink-0"
                  />
                  <a
                    href={`tel:${data.phone.replace(/\s/g, "")}`}
                    className="text-sm text-[#1a1a2e] underline decoration-transparent transition-colors hover:decoration-[#1a1a2e] break-all"
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
                    className="h-4 w-4 shrink-0"
                  />
                  <a
                    href={
                      data.bookingLink.startsWith("http")
                        ? data.bookingLink
                        : `https://${data.bookingLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#1a1a2e] underline transition-colors hover:decoration-[#1a1a2e] break-all"
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
                  className="h-4 w-4 shrink-0"
                />
                <a
                  href={
                    data.linkedinProfile.startsWith("http")
                      ? data.linkedinProfile
                      : `https://${data.linkedinProfile}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1a1a2e] underline transition-colors hover:decoration-[#1a1a2e] break-all"
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
      <div className="mt-4 border-t border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 sm:divide-x divide-gray-200">
        <p className="text-xs text-gray-600 sm:pr-2 text-center sm:text-left">
          Trusted by <span className="font-bold">400+</span> Shopify Brands
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-0 flex-wrap">
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png"
            alt="Levis"
            className="h-4 sm:h-5 px-2"
          />
          <img
            src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey.png"
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
        ? `<td width="144" valign="top"><div style="width:160px;height:144px;overflow:hidden"><img src="${data.photoUrl}" style="width:100%;height:100%;object-fit:cover" /></div></td>`
        : `<td width="144" valign="top"><div style="width:160px;height:144px;overflow:hidden"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/signature-placeholder.png" style="width:100%;height:100%" /></div></td>`
      : "";

  const linkedinText = data.linkedinProfile
    ? data.linkedinProfile.replace(/^https?:\/\//, "").replace(/^www\./, "")
    : "";

  const contactInfoPadding =
    data.showPhoto === false
      ? "padding-top:16px;padding-right:16px;padding-left:16px"
      : "padding-top:16px;padding-right:16px";

  return `<table style="font-family:system-ui,-apple-system,sans-serif;max-width:500px;width:100%;background:#fff"><tr><td style="padding-bottom:24px"><table width="100%"><tr>${photoHtml}<td valign="top" style="${contactInfoPadding}"><table width="100%"><tr><td valign="middle"><h2 style="margin:0;font-size:20px;font-weight:bold;color:#1a1a2e">${
    data.name
  }</h2></td><td align="right" valign="middle" style="padding-left:8px"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png" style="height:20px" /></td></tr></table><p style="margin:0 0 8px;font-size:16px;font-weight:500;color:#e91e63">${
    data.role
  }</p><table>${
    data.phone || data.bookingLink
      ? `<tr><td><table><tr>${
          data.phone
            ? `<td style="padding-right:16px"><table><tr><td width="16" valign="middle"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/phone.png" style="width:16px;height:16px;vertical-align:middle" /></td><td valign="middle"><a href="${phoneLink}" style="color:#1a1a2e;text-decoration:underline;text-decoration-color:transparent;font-size:14px;line-height:16px;vertical-align:middle">${data.phone}</a></td></tr></table></td>`
            : ""
        }${
          data.bookingLink
            ? `<td><table><tr><td width="16" valign="middle"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/calender.png" style="width:16px;height:16px;vertical-align:middle" /></td><td valign="middle"><a href="${bookingHref}" target="_blank" style="color:#1a1a2e;text-decoration:underline;font-size:14px;line-height:16px;vertical-align:middle">Book a Call</a></td></tr></table></td>`
            : ""
        }</tr></table></td></tr>`
      : ""
  }${
    data.linkedinProfile
      ? `<tr><td><table><tr><td width="16" valign="middle"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/linkedin.png" style="width:16px;height:16px;vertical-align:middle" /></td><td valign="middle"><a href="${linkedinHref}" target="_blank" style="color:#1a1a2e;text-decoration:underline;font-size:14px;line-height:16px;vertical-align:middle">${linkedinText}</a></td></tr></table></td></tr>`
      : ""
  }</table></td></tr></table></td></tr><tr><td style="border-top:1px solid #e5e7eb;padding:16px"><table width="100%"><tr><td style="padding-right:8px;border-right:1px solid #e5e7eb"><p style="margin:0;font-size:12px;color:#4b5563">Trusted by <strong>400+</strong> Shopify Brands</p></td><td width="60" align="center" style="padding-left:8px;padding-right:8px;border-right:1px solid #e5e7eb"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png" style="height:20px" /></td><td width="60" align="center" style="padding-left:8px;padding-right:8px;border-right:1px solid #e5e7eb"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey.png" style="height:20px" /></td><td width="60" align="center" style="padding-left:8px;padding-right:8px;border-right:1px solid #e5e7eb"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/gnc.png" style="height:20px" /></td><td width="60" align="center" style="padding-left:8px"><img src="https://cms-frontend-api.appmaker.xyz/api/media/file/greenworks.png" style="height:20px" /></td></tr></table></td></tr></table>`;
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
