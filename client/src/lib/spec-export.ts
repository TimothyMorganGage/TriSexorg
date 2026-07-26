export interface SpecExportData {
  productName: string | null;
  balanceCode: string;
  roleBalance: string;
  contactZones: string[];
  procreativeMode: string;
  brandingPreference: string;
  affirmingCareStatus: string;
  affirmingCareNotes: string;
  activeFoldName: string | null;
  variations: {
    name: string;
    category: string;
    fittingNote: string;
    consultRequired: boolean;
  }[];
  consultRequiredCount: number;
}

interface SpecSection {
  heading: string;
  rows: [string, string][];
}

function buildSections(data: SpecExportData): SpecSection[] {
  const sections: SpecSection[] = [
    {
      heading: "Configuration",
      rows: [
        ["Product", data.productName ?? "Not selected"],
        ["Balance code", data.balanceCode],
        ["Role balance", data.roleBalance],
        ["Contact zones", data.contactZones.length > 0 ? data.contactZones.join(", ") : "None selected"],
        ["Procreative mode", data.procreativeMode],
        ["Branding preference", data.brandingPreference],
        ["Active fold", data.activeFoldName ?? "None"],
      ],
    },
  ];
  if (data.affirmingCareStatus !== "not-specified") {
    sections.push({
      heading: "Affirming care (self-attested)",
      rows: [
        ["Status", data.affirmingCareStatus],
        ...(data.affirmingCareNotes.trim()
          ? ([["Notes", data.affirmingCareNotes.trim()]] as [string, string][])
          : []),
      ],
    });
  }
  sections.push({
    heading: `Intersex variations (${data.variations.length} selected${
      data.consultRequiredCount > 0 ? `, ${data.consultRequiredCount} consult-flagged` : ""
    })`,
    rows:
      data.variations.length === 0
        ? [["Selection", "None selected (standard fit)"]]
        : data.variations.map((v) => [
            `${v.name}${v.consultRequired ? " ★ consult recommended" : ""}`,
            `${v.category} — ${v.fittingNote}`,
          ]),
  });
  return sections;
}

const HONESTY_NOTE =
  "Honesty note: this is an open-source CC BY-SA 4.0 design specification, not a purchase receipt. " +
  "No manufacturing partner has signed on yet, so nothing ships and nothing is charged. " +
  "Fitting notes are design hypotheses, not medical advice. " +
  "This document was generated in your browser — no account, upload, or tracking involved.";

const ATTRIBUTION =
  "TriSex.org Inclusive Ordering Framework — CC BY-SA 4.0. Share and adapt with attribution, share-alike.";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function exportPrintablePdf(data: SpecExportData): boolean {
  const sections = buildSections(data);
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Inclusive Ordering Spec — ${esc(data.balanceCode)}</title>
<style>
  body { font-family: Georgia, serif; max-width: 720px; margin: 2rem auto; color: #1a1a1a; padding: 0 1rem; }
  h1 { font-size: 1.6rem; border-bottom: 2px solid #1a1a1a; padding-bottom: .4rem; }
  h2 { font-size: 1.1rem; margin-top: 1.6rem; }
  table { width: 100%; border-collapse: collapse; margin-top: .5rem; }
  td { border: 1px solid #bbb; padding: .4rem .6rem; vertical-align: top; font-size: .92rem; }
  td:first-child { font-weight: bold; width: 38%; }
  .note { margin-top: 2rem; font-size: .8rem; font-style: italic; color: #444; border: 1px dashed #888; padding: .7rem; }
  .attr { margin-top: 1rem; font-size: .75rem; color: #666; }
  @media print { .noprint { display: none; } }
</style>
</head>
<body>
<p class="noprint" style="background:#fff8dc;border:1px solid #ccc;padding:.6rem;font-family:sans-serif;font-size:.85rem;">
  Use your browser's Print dialog (Ctrl/Cmd+P) and choose "Save as PDF" to keep this spec.
</p>
<h1>Inclusive Ordering — Design Specification</h1>
<p>Generated ${esc(new Date().toISOString().slice(0, 10))} · Balance code <strong>${esc(data.balanceCode)}</strong></p>
${sections
  .map(
    (s) => `<h2>${esc(s.heading)}</h2>
<table>${s.rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>`,
  )
  .join("\n")}
<div class="note">${esc(HONESTY_NOTE)}</div>
<div class="attr">${esc(ATTRIBUTION)}</div>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 300); });</script>
</body>
</html>`;
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}

export function exportOpenDocument(data: SpecExportData): void {
  const sections = buildSections(data);
  const body = sections
    .map(
      (s) =>
        `<text:h text:style-name="Heading_20_2" text:outline-level="2">${esc(s.heading)}</text:h>` +
        s.rows
          .map(([k, v]) => `<text:p text:style-name="Standard"><text:span text:style-name="Bold">${esc(k)}:</text:span> ${esc(v)}</text:p>`)
          .join(""),
    )
    .join("");

  const fodt = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
  office:version="1.2" office:mimetype="application/vnd.oasis.opendocument.text">
  <office:styles>
    <style:style style:name="Bold" style:family="text">
      <style:text-properties fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Heading_20_1" style:family="paragraph">
      <style:text-properties fo:font-size="18pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Heading_20_2" style:family="paragraph">
      <style:text-properties fo:font-size="14pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Note" style:family="paragraph">
      <style:text-properties fo:font-style="italic" fo:font-size="9pt"/>
    </style:style>
  </office:styles>
  <office:body>
    <office:text>
      <text:h text:style-name="Heading_20_1" text:outline-level="1">Inclusive Ordering — Design Specification</text:h>
      <text:p text:style-name="Standard">Generated ${esc(new Date().toISOString().slice(0, 10))} · Balance code ${esc(data.balanceCode)}</text:p>
      ${body}
      <text:p text:style-name="Note">${esc(HONESTY_NOTE)}</text:p>
      <text:p text:style-name="Note">${esc(ATTRIBUTION)}</text:p>
    </office:text>
  </office:body>
</office:document>`;

  const blob = new Blob([fodt], { type: "application/vnd.oasis.opendocument.text" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inclusive-ordering-spec-${data.balanceCode}.fodt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
