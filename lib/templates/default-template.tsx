"use client";

import React from "react";
import type { EmailSignatureTemplate, EmailSignatureData } from "./types";
import { Phone, Calendar } from "lucide-react";

function DefaultTemplateRenderer({ data }: { data: EmailSignatureData }) {
  return (
    <div
      className="relative w-full max-w-[600px] bg-white p-4 font-sans"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Gradient accent shape in top-left */}
      {data.showPhoto !== false && (
        <div className="absolute left-0 top-0 h-32 w-32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="95"
            viewBox="0 0 150 95"
            fill="none"
          >
            <path
              d="M150 0C149.831 1.00047 149.558 1.75609 149.399 2.15115C148.867 3.47732 148.183 4.37414 147.927 4.70029C147.346 5.43986 146.79 5.93194 146.651 6.05614C146.423 6.25913 146.228 6.41385 146.117 6.50067C145.347 7.10299 143.939 7.9661 143.352 8.33006C142.41 8.91363 141.315 9.58051 140.467 10.096C139.279 10.8175 139.164 10.8912 139.451 10.6944C116.832 26.2045 92.8785 38.6678 69.1629 50.4795C67.8186 51.1491 66.4753 51.8162 65.1337 52.4816C83.5882 46.7734 83.1531 47.0081 101.71 41.4747L102.049 41.3783C102.495 41.2595 103.249 41.09 104.157 41.0329C104.736 40.9965 106.035 40.9559 107.603 41.3918C109.238 41.8462 112.118 43.1233 113.913 46.3916C115.67 49.5897 115.241 52.6223 114.841 54.1105C114.443 55.5938 113.807 56.6412 113.503 57.1095C112.869 58.0844 112.207 58.7398 111.991 58.9517C111.106 59.8204 110.089 60.5122 109.749 60.744C109.191 61.1254 108.566 61.5217 107.975 61.8672C107.69 62.0336 106.487 62.7529 105.143 63.2021C91.3812 67.8026 76.1378 70.7741 61.9868 75.1391C41.2922 81.5227 20.7195 88.2615 0 95V36.2188C0.120165 36.1436 0.23957 36.0687 0.357796 35.9948C1.91767 35.0198 3.2772 34.1735 4.55921 33.3229C10.0883 29.6543 15.582 26.0265 21.0427 22.3925C13.9965 24.8826 6.983 27.4496 0 30.1134V7.98064C7.42999 5.22342 14.8801 2.57253 22.3454 0H91.9637C83.4228 4.94602 75.1509 10.4473 66.8077 16.1859C78.6735 11.8645 90.4926 7.60291 102.158 3.2473C105.064 2.16252 107.946 1.08801 110.787 0H150Z"
              fill="url(#paint0_linear_820_791)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_820_791"
                x1="-25.4685"
                y1="37.7514"
                x2="139.817"
                y2="37.7514"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#9EADF4" />
                <stop offset="0.317308" stopColor="#DF5E94" />
                <stop offset="0.632212" stopColor="#E5544F" />
                <stop offset="1" stopColor="#E27936" />
              </linearGradient>
            </defs>
          </svg>
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
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
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
                  <Phone className="h-4 w-4 text-[#1a1a2e]" />
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
                  <Calendar className="h-4 w-4 text-[#1a1a2e]" />
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
                <svg width="16" height="16" fill="#1a1a2e" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
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
          Trusted by 400+ Shopify Brands
        </p>
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/Levis.png"
          alt="Levis"
          className="h-6 px-2"
        />
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/jockey.png"
          alt="Jockey"
          className="h-6 px-2"
        />
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/gnc.png"
          alt="Puma"
          className="h-6 px-2"
        />
        <img
          src="https://cms-frontend-api.appmaker.xyz/api/media/file/greenworks.png"
          alt="Nike"
          className="h-6 pl-2"
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
        : `<div style="width: 112px; height: 112px; border-radius: 50%; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center;">
            <svg width="48" height="48" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>`
      : "";

  const gradientAccentHtml =
    data.showPhoto !== false
      ? ` <!-- Gradient accent shape in top-left (absolute positioned behind) -->
          <tr>
            <td style="position: absolute; left: 0; top: 0; width: 128px; height: 95px; z-index: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" width="150" height="95" viewBox="0 0 150 95" fill="none">
                <path d="M150 0C149.831 1.00047 149.558 1.75609 149.399 2.15115C148.867 3.47732 148.183 4.37414 147.927 4.70029C147.346 5.43986 146.79 5.93194 146.651 6.05614C146.423 6.25913 146.228 6.41385 146.117 6.50067C145.347 7.10299 143.939 7.9661 143.352 8.33006C142.41 8.91363 141.315 9.58051 140.467 10.096C139.279 10.8175 139.164 10.8912 139.451 10.6944C116.832 26.2045 92.8785 38.6678 69.1629 50.4795C67.8186 51.1491 66.4753 51.8162 65.1337 52.4816C83.5882 46.7734 83.1531 47.0081 101.71 41.4747L102.049 41.3783C102.495 41.2595 103.249 41.09 104.157 41.0329C104.736 40.9965 106.035 40.9559 107.603 41.3918C109.238 41.8462 112.118 43.1233 113.913 46.3916C115.67 49.5897 115.241 52.6223 114.841 54.1105C114.443 55.5938 113.807 56.6412 113.503 57.1095C112.869 58.0844 112.207 58.7398 111.991 58.9517C111.106 59.8204 110.089 60.5122 109.749 60.744C109.191 61.1254 108.566 61.5217 107.975 61.8672C107.69 62.0336 106.487 62.7529 105.143 63.2021C91.3812 67.8026 76.1378 70.7741 61.9868 75.1391C41.2922 81.5227 20.7195 88.2615 0 95V36.2188C0.120165 36.1436 0.23957 36.0687 0.357796 35.9948C1.91767 35.0198 3.2772 34.1735 4.55921 33.3229C10.0883 29.6543 15.582 26.0265 21.0427 22.3925C13.9965 24.8826 6.983 27.4496 0 30.1134V7.98064C7.42999 5.22342 14.8801 2.57253 22.3454 0H91.9637C83.4228 4.94602 75.1509 10.4473 66.8077 16.1859C78.6735 11.8645 90.4926 7.60291 102.158 3.2473C105.064 2.16252 107.946 1.08801 110.787 0H150Z" fill="url(#paint0_linear_820_791)"/>
                <defs>
                  <linearGradient id="paint0_linear_820_791" x1="-25.4685" y1="37.7514" x2="139.817" y2="37.7514" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#9EADF4"/>
                    <stop offset="0.317308" stop-color="#DF5E94"/>
                    <stop offset="0.632212" stop-color="#E5544F"/>
                    <stop offset="1" stop-color="#E27936"/>
                  </linearGradient>
                </defs>
              </svg>
            </td>
          </tr>
          `
      : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; width: 100%; background-color: #ffffff; padding: 16px; position: relative;">
${gradientAccentHtml}
  <!-- Company branding top right (absolute positioned) -->
  <tr>
    <td style="position: absolute; right: 16px; top: 20px; z-index: 1;">
      <img src="https://cms-frontend-api.appmaker.xyz/api/media/file/appmaker-logo.png" alt="AppMaker" style="height: 20px; display: block;" />
    </td>
  </tr>
  
  <!-- Main content -->
  <tr>
    <td style="padding-bottom: 24px; position: relative; z-index: 1;">
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
                        <svg width="16" height="16" fill="none" stroke="#1a1a2e" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
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
                        <svg width="16" height="16" fill="none" stroke="#1a1a2e" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
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
                        <svg width="16" height="16" fill="#1a1a2e" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
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
    <td style="padding-top: 24px; border-top: 1px solid #e5e7eb; position: relative; z-index: 1;">
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
