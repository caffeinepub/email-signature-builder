import type { SignatureData, StyleOptions, TemplateEntry } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function linkify(url: string): string {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const SVGS: Record<string, string> = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  tiktok: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.18 8.18 0 0 0 4.78 1.52V6.87a4.85 4.85 0 0 1-1.01-.18z"/></svg>`,
  substack: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>`,
};

function socialRow(data: SignatureData, color: string, spacing = 8): string {
  const items = (
    [
      ["linkedin", data.socials.linkedin],
      ["x", data.socials.x],
      ["instagram", data.socials.instagram],
      ["facebook", data.socials.facebook],
      ["youtube", data.socials.youtube],
      ["tiktok", data.socials.tiktok],
      ["substack", data.socials.substack],
    ] as [string, string][]
  ).filter(([, u]) => u);
  if (!items.length) return "";
  return items
    .map(
      ([k, u]) =>
        `<a href="${linkify(u)}" style="display:inline-block;margin-right:${spacing}px;color:${color};text-decoration:none;vertical-align:middle;" title="${k}">${SVGS[k]}</a>`,
    )
    .join("");
}

function socialWithLabels(data: SignatureData, color: string): string {
  const labels: Record<string, string> = {
    linkedin: "LinkedIn",
    x: "X",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
    substack: "Substack",
  };
  const items = (
    [
      ["linkedin", data.socials.linkedin],
      ["x", data.socials.x],
      ["instagram", data.socials.instagram],
      ["facebook", data.socials.facebook],
      ["youtube", data.socials.youtube],
      ["tiktok", data.socials.tiktok],
      ["substack", data.socials.substack],
    ] as [string, string][]
  ).filter(([, u]) => u);
  if (!items.length) return "";
  return `<table cellpadding="0" cellspacing="0" border="0"><tr>${items
    .map(
      ([k, u]) =>
        `<td style="padding-right:14px;white-space:nowrap;"><a href="${linkify(u)}" style="color:${color};text-decoration:none;font-size:12px;display:inline-flex;align-items:center;gap:4px;">${SVGS[k]}<span style="margin-left:3px;">${labels[k]}</span></a></td>`,
    )
    .join("")}</tr></table>`;
}

function logoImg(data: SignatureData, w = 80, h = 56): string {
  if (!data.logoBase64) return "";
  return `<img src="${data.logoBase64}" width="${w}" height="${h}" style="max-width:${w}px;max-height:${h}px;object-fit:contain;display:block;" alt="Logo" />`;
}

function initialsAvatar(
  data: SignatureData,
  size: number,
  bg: string,
  fg = "#fff",
): string {
  const name = data.name || "?";
  const parts = name.trim().split(/\s+/);
  const txt =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  const fs = Math.round(size * 0.38);
  return `<table cellpadding="0" cellspacing="0" border="0"><tr><td width="${size}" height="${size}" style="width:${size}px;height:${size}px;min-width:${size}px;background-color:${bg};border-radius:${Math.round(size / 2)}px;text-align:center;vertical-align:middle;font-size:${fs}px;font-weight:700;color:${fg};font-family:Arial,sans-serif;">${txt}</td></tr></table>`;
}

function avatarCell(data: SignatureData, size: number, bg: string): string {
  const lg = logoImg(data, size, size);
  return lg || initialsAvatar(data, size, bg);
}

function gradBg(opts: StyleOptions): string {
  return opts.useGradient
    ? `background:linear-gradient(135deg,${opts.gradientStart},${opts.gradientEnd});`
    : `background-color:${opts.primaryColor};`;
}

// ─── Template 1: Classic Horizontal ─────────────────────────────────────────
function template1(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 72, 48);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;border-collapse:collapse;">
  <tr>
    <td style="padding-right:20px;vertical-align:top;white-space:nowrap;">
      ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:4px;line-height:1.2;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;color:#6B7280;margin-bottom:2px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:13px;color:#6B7280;">${data.company}</div>` : ""}
      ${lg ? `<div style="margin-top:10px;">${lg}</div>` : ""}
    </td>
    <td style="width:2px;background-color:${c1};padding:0;">&nbsp;</td>
    <td style="padding-left:20px;vertical-align:top;">
      ${data.email ? `<div style="margin-bottom:4px;font-size:13px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="margin-bottom:4px;font-size:13px;color:${c2};">${data.phone}</div>` : ""}
      ${data.website ? `<div style="margin-bottom:4px;font-size:13px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div style="margin-top:6px;">${sr}</div>` : ""}
    </td>
  </tr>
  ${data.tagline ? `<tr><td colspan="3" style="padding-top:8px;font-size:12px;color:#9CA3AF;font-style:italic;">${data.tagline}</td></tr>` : ""}
</table>`;
}

// ─── Template 2: Stacked Minimal ─────────────────────────────────────────────
function template2(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, "#9CA3AF", 10);
  const lg = logoImg(data, 64, 40);
  const contactParts = [
    data.email
      ? `<a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a>`
      : "",
    data.phone || "",
    data.website
      ? `<a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a>`
      : "",
  ].filter(Boolean);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;text-align:center;">
  <tr><td style="text-align:center;padding:4px 0;">
    ${lg ? `<div style="margin-bottom:10px;">${lg}</div>` : ""}
    ${data.name ? `<div style="font-size:20px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
    ${data.jobTitle || data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${[data.jobTitle, data.company].filter(Boolean).join(" &middot; ")}</div>` : ""}
    ${contactParts.length ? `<div style="height:1px;background:#E5E7EB;margin:8px auto;width:180px;"></div><div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${contactParts.join(" &nbsp;&middot;&nbsp; ")}</div>` : ""}
    ${sr ? `<div style="text-align:center;">${sr}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:8px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 3: Card with Logo ──────────────────────────────────────────────
function template3(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 80, 60);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;border:1px solid #E5E7EB;border-radius:8px;border-collapse:separate;">
  <tr>
    ${lg ? `<td style="padding:16px;vertical-align:middle;border-right:1px solid #E5E7EB;">${lg}</td>` : ""}
    <td style="padding:16px;vertical-align:top;">
      ${data.name ? `<div style="font-size:17px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;color:${c1};font-weight:500;margin-bottom:1px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${data.company}</div>` : ""}
      ${data.email ? `<div style="font-size:13px;margin-bottom:2px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:2px;">${data.phone}</div>` : ""}
      ${data.website ? `<div style="font-size:13px;margin-bottom:6px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div>${sr}</div>` : ""}
    </td>
  </tr>
</table>`;
}

// ─── Template 4: Bold Name ───────────────────────────────────────────────────
function template4(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 72, 40);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr><td>
    ${data.name ? `<div style="font-size:26px;font-weight:800;color:${c1};margin-bottom:0px;letter-spacing:-0.5px;line-height:1.1;">${data.name}</div>` : ""}
    ${data.jobTitle || data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;margin-top:2px;">${[data.jobTitle, data.company].filter(Boolean).join(" &middot; ")}</div>` : ""}
    <div style="height:3px;background-color:${c1};width:100%;margin-bottom:10px;border-radius:2px;"></div>
    ${data.email ? `<span style="font-size:13px;margin-right:14px;"><a href="mailto:${data.email}" style="color:${c2};text-decoration:none;">${data.email}</a></span>` : ""}
    ${data.phone ? `<span style="font-size:13px;color:${c2};margin-right:14px;">${data.phone}</span>` : ""}
    ${data.website ? `<span style="font-size:13px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></span>` : ""}
    ${sr ? `<div style="margin-top:8px;">${sr}</div>` : ""}
    ${lg ? `<div style="margin-top:10px;">${lg}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 5: Two Column ──────────────────────────────────────────────────
function template5(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 72, 48);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr>
    <td style="padding-right:24px;vertical-align:top;min-width:180px;">
      ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:4px;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;font-weight:500;color:${c1};margin-bottom:2px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${data.company}</div>` : ""}
      ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;font-style:italic;">${data.tagline}</div>` : ""}
      ${lg ? `<div style="margin-top:10px;">${lg}</div>` : ""}
    </td>
    <td style="vertical-align:top;border-left:1px solid #E5E7EB;padding-left:24px;">
      ${data.email ? `<div style="font-size:13px;margin-bottom:4px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:4px;">${data.phone}</div>` : ""}
      ${data.website ? `<div style="font-size:13px;margin-bottom:8px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div>${sr}</div>` : ""}
    </td>
  </tr>
</table>`;
}

// ─── Template 6: Banner Bottom ───────────────────────────────────────────────
function template6(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const _c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, "#fff", 10);
  const lg = logoImg(data, 64, 40);
  const contactParts = [
    data.email
      ? `<a href="mailto:${data.email}" style="color:#fff;text-decoration:none;font-size:12px;">${data.email}</a>`
      : "",
    data.phone
      ? `<span style="color:#fff;font-size:12px;">${data.phone}</span>`
      : "",
    data.website
      ? `<a href="${linkify(data.website)}" style="color:#fff;text-decoration:none;font-size:12px;">${data.website}</a>`
      : "",
  ].filter(Boolean);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;width:380px;">
  <tr><td style="padding-bottom:10px;">
    ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
    ${data.jobTitle || data.company ? `<div style="font-size:13px;color:#6B7280;">${[data.jobTitle, data.company].filter(Boolean).join(" &middot; ")}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:4px;font-style:italic;">${data.tagline}</div>` : ""}
    ${lg ? `<div style="margin-top:8px;">${lg}</div>` : ""}
  </td></tr>
  <tr><td style="${gradBg(opts)}padding:10px 14px;border-radius:6px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td>${contactParts.map((p) => `<span style="margin-right:12px;">${p}</span>`).join("")}</td>
      ${sr ? `<td style="text-align:right;white-space:nowrap;">${sr}</td>` : ""}
    </tr></table>
  </td></tr>
</table>`;
}

// ─── Template 7: Sidebar Accent ──────────────────────────────────────────────
function template7(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 64, 40);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr>
    <td style="width:4px;background-color:${c1};padding:0;border-radius:2px;">&nbsp;</td>
    <td style="padding-left:16px;vertical-align:top;">
      ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:3px;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;font-weight:500;color:${c1};margin-bottom:1px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${data.company}</div>` : ""}
      ${data.email ? `<div style="font-size:13px;margin-bottom:3px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:3px;">${data.phone}</div>` : ""}
      ${data.website ? `<div style="font-size:13px;margin-bottom:6px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div style="margin-bottom:6px;">${sr}</div>` : ""}
      ${lg ? `<div>${lg}</div>` : ""}
      ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
    </td>
  </tr>
</table>`;
}

// ─── Template 8: Modern Dark ─────────────────────────────────────────────────
function template8(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const bg = "#1E293B";
  const sr = socialRow(data, c1, 10);
  const lg = logoImg(data, 68, 44);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;background-color:${bg};border-radius:8px;">
  <tr><td style="padding:18px 22px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="vertical-align:top;">
        ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c1};margin-bottom:2px;">${data.name}</div>` : ""}
        ${data.jobTitle ? `<div style="font-size:13px;color:#94A3B8;margin-bottom:1px;">${data.jobTitle}</div>` : ""}
        ${data.company ? `<div style="font-size:13px;color:#64748B;margin-bottom:10px;">${data.company}</div>` : ""}
        ${data.email ? `<div style="font-size:13px;margin-bottom:3px;"><a href="mailto:${data.email}" style="color:#CBD5E1;text-decoration:none;">${data.email}</a></div>` : ""}
        ${data.phone ? `<div style="font-size:13px;color:#94A3B8;margin-bottom:3px;">${data.phone}</div>` : ""}
        ${data.website ? `<div style="font-size:13px;margin-bottom:8px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
        ${sr ? `<div>${sr}</div>` : ""}
        ${data.tagline ? `<div style="font-size:12px;color:#475569;margin-top:8px;font-style:italic;">${data.tagline}</div>` : ""}
      </td>
      ${lg ? `<td style="vertical-align:top;padding-left:16px;">${lg}</td>` : ""}
    </tr></table>
  </td></tr>
</table>`;
}

// ─── Template 9: Clean Lines ─────────────────────────────────────────────────
function template9(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 64, 40);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr><td>
    ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
    <div style="height:1px;background-color:${c1};margin:6px 0;"></div>
    ${data.jobTitle || data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:6px;">${[data.jobTitle, data.company].filter(Boolean).join(" &middot; ")}</div>` : ""}
    ${data.email || data.phone || data.website ? `<div style="height:1px;background-color:#E5E7EB;margin:6px 0;"></div>` : ""}
    ${data.email ? `<span style="font-size:13px;margin-right:14px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></span>` : ""}
    ${data.phone ? `<span style="font-size:13px;color:${c2};margin-right:14px;">${data.phone}</span>` : ""}
    ${data.website ? `<span style="font-size:13px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></span>` : ""}
    ${sr ? `<div style="height:1px;background-color:#E5E7EB;margin:6px 0;"></div><div>${sr}</div>` : ""}
    ${lg ? `<div style="margin-top:8px;">${lg}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 10: Icon Row ───────────────────────────────────────────────────
function template10(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const swl = socialWithLabels(data, c1);
  const lg = logoImg(data, 72, 48);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr><td>
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding-right:12px;vertical-align:middle;">
        ${data.name ? `<div style="font-size:17px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
        ${data.jobTitle ? `<div style="font-size:13px;font-weight:500;color:${c1};">${data.jobTitle}</div>` : ""}
        ${data.company ? `<div style="font-size:13px;color:#6B7280;">${data.company}</div>` : ""}
      </td>
      ${lg ? `<td style="vertical-align:middle;padding-left:12px;border-left:1px solid #E5E7EB;">${lg}</td>` : ""}
    </tr></table>
    <div style="height:1px;background:#E5E7EB;margin:8px 0;"></div>
    ${data.email ? `<span style="font-size:13px;margin-right:14px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></span>` : ""}
    ${data.phone ? `<span style="font-size:13px;color:${c2};margin-right:14px;">${data.phone}</span>` : ""}
    ${data.website ? `<span style="font-size:13px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></span>` : ""}
    ${swl ? `<div style="margin-top:10px;">${swl}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 11: Compact ────────────────────────────────────────────────────
function template11(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1, 6);
  const bits1 = [data.name, data.jobTitle, data.company].filter(Boolean);
  const bits2 = [
    data.email
      ? `<a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a>`
      : "",
    data.phone || "",
    data.website
      ? `<a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a>`
      : "",
  ].filter(Boolean);
  const lg = logoImg(data, 48, 30);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:13px;">
  ${
    bits1.length
      ? `<tr><td style="padding-bottom:2px;">
    ${bits1
      .map((b, i) =>
        i === 0
          ? `<strong style="font-size:14px;color:${c2};">${b}</strong>`
          : `<span style="color:#6B7280;margin-left:6px;">&middot; ${b}</span>`,
      )
      .join("")}
  </td></tr>`
      : ""
  }
  ${
    bits2.length
      ? `<tr><td style="padding-bottom:2px;color:${c2};">
    ${bits2.map((b, i) => (i === 0 ? b : `<span style="margin-left:6px;">&middot; </span>${b}`)).join("")}
  </td></tr>`
      : ""
  }
  ${sr || lg ? `<tr><td style="padding-top:4px;">${sr}${lg ? `<span style="margin-left:8px;vertical-align:middle;">${lg}</span>` : ""}</td></tr>` : ""}
  ${data.tagline ? `<tr><td style="font-size:11px;color:#9CA3AF;font-style:italic;">${data.tagline}</td></tr>` : ""}
</table>`;
}

// ─── Template 12: Photo Placeholder ─────────────────────────────────────────
function template12(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const avatar = avatarCell(data, 60, c1);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr>
    <td style="padding-right:16px;vertical-align:middle;">${avatar}</td>
    <td style="vertical-align:top;border-left:1px solid #E5E7EB;padding-left:16px;">
      ${data.name ? `<div style="font-size:17px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;color:${c1};font-weight:500;margin-bottom:1px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${data.company}</div>` : ""}
      ${data.email ? `<div style="font-size:13px;margin-bottom:2px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:2px;">${data.phone}</div>` : ""}
      ${data.website ? `<div style="font-size:13px;margin-bottom:6px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div>${sr}</div>` : ""}
    </td>
  </tr>
</table>`;
}

// ─── Template 13: Gradient Header ───────────────────────────────────────────
function template13(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 72, 44);
  const grad = opts.useGradient
    ? `background:linear-gradient(135deg,${opts.gradientStart},${opts.gradientEnd});`
    : `background:linear-gradient(135deg,${c1},${c1}cc);`;
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;border-radius:8px;overflow:hidden;">
  <tr><td style="${grad}padding:14px 18px;border-radius:8px 8px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td>
        ${data.name ? `<div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:2px;">${data.name}</div>` : ""}
        ${data.jobTitle || data.company ? `<div style="font-size:13px;color:rgba(255,255,255,0.8);">${[data.jobTitle, data.company].filter(Boolean).join(" &middot; ")}</div>` : ""}
      </td>
      ${lg ? `<td style="text-align:right;vertical-align:middle;">${lg}</td>` : ""}
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:12px 18px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;">
    ${data.email ? `<span style="font-size:13px;margin-right:14px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></span>` : ""}
    ${data.phone ? `<span style="font-size:13px;color:${c2};margin-right:14px;">${data.phone}</span>` : ""}
    ${data.website ? `<span style="font-size:13px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></span>` : ""}
    ${sr ? `<div style="margin-top:8px;">${sr}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 14: Right-Aligned ──────────────────────────────────────────────
function template14(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 72, 44);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;text-align:right;">
  <tr><td style="text-align:right;">
    ${lg ? `<div style="margin-bottom:8px;text-align:right;">${lg}</div>` : ""}
    ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
    ${data.jobTitle ? `<div style="font-size:13px;color:${c1};font-weight:500;margin-bottom:1px;">${data.jobTitle}</div>` : ""}
    ${data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;">${data.company}</div>` : ""}
    <div style="height:2px;background-color:${c1};margin:8px 0;"></div>
    ${data.email ? `<div style="font-size:13px;margin-bottom:3px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
    ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:3px;">${data.phone}</div>` : ""}
    ${data.website ? `<div style="font-size:13px;margin-bottom:8px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
    ${sr ? `<div style="text-align:right;">${sr}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 15: Split Color ────────────────────────────────────────────────
function template15(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 64, 44);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="${gradBg(opts)}padding:16px 18px;vertical-align:middle;border-radius:8px 0 0 8px;min-width:140px;">
      ${data.name ? `<div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:3px;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;color:rgba(255,255,255,0.85);margin-bottom:1px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:12px;color:rgba(255,255,255,0.7);">${data.company}</div>` : ""}
      ${lg ? `<div style="margin-top:10px;">${lg}</div>` : ""}
    </td>
    <td style="background:#fff;padding:16px 18px;vertical-align:top;border:1px solid #E5E7EB;border-left:none;border-radius:0 8px 8px 0;">
      ${data.email ? `<div style="font-size:13px;margin-bottom:4px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:4px;">${data.phone}</div>` : ""}
      ${data.website ? `<div style="font-size:13px;margin-bottom:8px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div>${sr}</div>` : ""}
      ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
    </td>
  </tr>
</table>`;
}

// ─── Template 16: Elegant Serif ──────────────────────────────────────────────
function template16(data: SignatureData, opts: StyleOptions): string {
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 72, 48);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;">
  <tr><td>
    ${data.name ? `<div style="font-size:22px;font-weight:700;color:${c2};margin-bottom:2px;font-style:italic;letter-spacing:-0.3px;">${data.name}</div>` : ""}
    <div style="height:1px;background:${c1};margin:6px 0;width:100%;"></div>
    ${data.jobTitle || data.company ? `<div style="font-size:13px;color:#6B7280;margin-bottom:8px;letter-spacing:0.5px;text-transform:uppercase;font-size:11px;">${[data.jobTitle, data.company].filter(Boolean).join(" &middot; ")}</div>` : ""}
    ${data.email ? `<div style="font-size:13px;margin-bottom:3px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
    ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:3px;">${data.phone}</div>` : ""}
    ${data.website ? `<div style="font-size:13px;margin-bottom:6px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
    ${sr ? `<div style="margin-top:6px;">${sr}</div>` : ""}
    ${lg ? `<div style="margin-top:10px;">${lg}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 17: Tech Minimal ───────────────────────────────────────────────
function template17(data: SignatureData, opts: StyleOptions): string {
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1, 8);
  const lg = logoImg(data, 60, 36);
  const pairs: [string, string][] = [
    data.email
      ? [
          "email",
          `<a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a>`,
        ]
      : ["", ""],
    data.phone ? ["phone", data.phone] : ["", ""],
    data.website
      ? [
          "web",
          `<a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a>`,
        ]
      : ["", ""],
    data.company ? ["org", data.company] : ["", ""],
  ].filter(([k]) => k) as [string, string][];
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Courier New',Courier,monospace;font-size:13px;color:${c2};">
  <tr><td style="padding:2px 0;">
    ${data.name ? `<div style="font-size:16px;font-weight:700;color:${c1};margin-bottom:4px;letter-spacing:-0.5px;">&gt; ${data.name}</div>` : ""}
    ${data.jobTitle ? `<div style="font-size:12px;color:#6B7280;margin-bottom:8px;"># ${data.jobTitle}</div>` : ""}
    <div style="height:1px;background:#E5E7EB;margin:6px 0;"></div>
    ${pairs.map(([k, v]) => `<div style="margin-bottom:3px;"><span style="color:#9CA3AF;">${k.padEnd(8, "\u00a0")}:</span> ${v}</div>`).join("")}
    ${sr ? `<div style="margin-top:8px;">${sr}</div>` : ""}
    ${lg ? `<div style="margin-top:8px;">${lg}</div>` : ""}
    ${data.tagline ? `<div style="font-size:11px;color:#9CA3AF;margin-top:6px;">// ${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 18: Colorful Blocks ───────────────────────────────────────────
function template18(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 60, 40);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;">
  <tr style="vertical-align:top;">
    <td style="${gradBg(opts)}padding:12px 16px;border-radius:6px 0 0 6px;vertical-align:middle;">
      ${data.name ? `<div style="font-size:17px;font-weight:700;color:#fff;white-space:nowrap;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:2px;">${data.jobTitle}</div>` : ""}
    </td>
    <td style="background:#F8FAFC;padding:12px 16px;border:1px solid #E5E7EB;border-left:none;border-radius:0 6px 6px 0;vertical-align:top;">
      ${data.company ? `<div style="font-size:13px;color:${c2};font-weight:500;margin-bottom:4px;">${data.company}</div>` : ""}
      ${data.email ? `<div style="font-size:12px;margin-bottom:2px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
      ${data.phone ? `<div style="font-size:12px;color:${c2};margin-bottom:2px;">${data.phone}</div>` : ""}
      ${data.website ? `<div style="font-size:12px;margin-bottom:4px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
      ${sr ? `<div>${sr}</div>` : ""}
    </td>
  </tr>
  ${lg ? `<tr><td colspan="2" style="padding-top:8px;">${lg}</td></tr>` : ""}
  ${data.tagline ? `<tr><td colspan="2" style="padding-top:4px;font-size:12px;color:#9CA3AF;font-style:italic;">${data.tagline}</td></tr>` : ""}
</table>`;
}

// ─── Template 19: Rounded Card ───────────────────────────────────────────────
function template19(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 64, 44);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <tr><td style="padding:20px 24px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="vertical-align:top;">
        ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
        ${data.jobTitle ? `<div style="font-size:13px;font-weight:500;color:${c1};margin-bottom:1px;">${data.jobTitle}</div>` : ""}
        ${data.company ? `<div style="font-size:13px;color:#6B7280;">${data.company}</div>` : ""}
      </td>
      ${lg ? `<td style="text-align:right;vertical-align:top;">${lg}</td>` : ""}
    </tr></table>
    <div style="height:1px;background:#E5E7EB;margin:12px 0;"></div>
    ${data.email ? `<div style="font-size:13px;margin-bottom:3px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></div>` : ""}
    ${data.phone ? `<div style="font-size:13px;color:${c2};margin-bottom:3px;">${data.phone}</div>` : ""}
    ${data.website ? `<div style="font-size:13px;margin-bottom:10px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></div>` : ""}
    ${sr ? `<div>${sr}</div>` : ""}
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:8px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template 20: Corporate Clean ───────────────────────────────────────────
function template20(data: SignatureData, opts: StyleOptions): string {
  const f = opts.font || "Arial";
  const c1 = opts.primaryColor;
  const c2 = opts.secondaryColor;
  const sr = socialRow(data, c1);
  const lg = logoImg(data, 80, 52);
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${f},Arial,sans-serif;font-size:14px;width:420px;border-collapse:collapse;">
  <tr>
    <td style="vertical-align:bottom;padding-bottom:10px;">
      ${data.name ? `<div style="font-size:18px;font-weight:700;color:${c2};margin-bottom:2px;">${data.name}</div>` : ""}
      ${data.jobTitle ? `<div style="font-size:13px;color:${c1};font-weight:500;margin-bottom:1px;">${data.jobTitle}</div>` : ""}
      ${data.company ? `<div style="font-size:13px;color:#6B7280;">${data.company}</div>` : ""}
    </td>
    ${lg ? `<td style="text-align:right;vertical-align:bottom;padding-bottom:10px;">${lg}</td>` : ""}
  </tr>
  <tr><td colspan="2" style="border-top:2px solid ${c1};padding-top:10px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td>
        ${data.email ? `<span style="font-size:13px;margin-right:14px;"><a href="mailto:${data.email}" style="color:${c1};text-decoration:none;">${data.email}</a></span>` : ""}
        ${data.phone ? `<span style="font-size:13px;color:${c2};margin-right:14px;">${data.phone}</span>` : ""}
        ${data.website ? `<span style="font-size:13px;"><a href="${linkify(data.website)}" style="color:${c1};text-decoration:none;">${data.website}</a></span>` : ""}
      </td>
      ${sr ? `<td style="text-align:right;white-space:nowrap;">${sr}</td>` : ""}
    </tr></table>
    ${data.tagline ? `<div style="font-size:12px;color:#9CA3AF;margin-top:6px;font-style:italic;">${data.tagline}</div>` : ""}
  </td></tr>
</table>`;
}

// ─── Template Registry ───────────────────────────────────────────────────────
export const TEMPLATES: TemplateEntry[] = [
  { name: "Classic Horizontal", fn: template1 },
  { name: "Stacked Minimal", fn: template2 },
  { name: "Card with Logo", fn: template3 },
  { name: "Bold Name", fn: template4 },
  { name: "Two Column", fn: template5 },
  { name: "Banner Bottom", fn: template6 },
  { name: "Sidebar Accent", fn: template7 },
  { name: "Modern Dark", fn: template8 },
  { name: "Clean Lines", fn: template9 },
  { name: "Icon Row", fn: template10 },
  { name: "Compact", fn: template11 },
  { name: "Photo Placeholder", fn: template12 },
  { name: "Gradient Header", fn: template13 },
  { name: "Right-Aligned", fn: template14 },
  { name: "Split Color", fn: template15 },
  { name: "Elegant Serif", fn: template16 },
  { name: "Tech Minimal", fn: template17 },
  { name: "Colorful Blocks", fn: template18 },
  { name: "Rounded Card", fn: template19 },
  { name: "Corporate Clean", fn: template20 },
];
