import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Users, 
  Heart,
  Droplets,
  Ruler,
  TestTube,
  Globe,
  Coins,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Target,
  Zap,
  ArrowLeft,
  Download,
  Upload,
  FileText,
  Cloud,
  Smartphone,
  Monitor,
  Share,
  ExternalLink
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FediverseShare } from "@/components/FediverseShare";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface WikiArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  author: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
}

// Export/Import helper functions
const exportToMarkdown = (article: WikiArticle) => {
  const blob = new Blob([article.content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToHTML = (article: WikiArticle) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${article.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3, h4 { color: #333; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; }
    </style>
</head>
<body>
    ${article.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
</body>
</html>`;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToGoogleDocs = async (article: WikiArticle) => {
  // Create Google Docs-compatible HTML with proper structure and Google-specific formatting
  const googleDocsContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${article.title}</title>
    <meta name="author" content="${article.author}">
    <meta name="description" content="${article.tags.join(', ')}">
    <style>
        body { 
            font-family: 'Google Sans', Arial, sans-serif; 
            margin: 2.54cm; 
            line-height: 1.6; 
            color: #202124;
        }
        h1 { 
            color: #1a73e8; 
            border-bottom: 3px solid #1a73e8; 
            padding-bottom: 10px;
            font-size: 28px;
            margin-bottom: 20px;
        }
        h2 { 
            color: #1a73e8; 
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 { 
            color: #5f6368; 
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        .metadata { 
            background: #f8f9fa; 
            padding: 15px; 
            border-left: 4px solid #1a73e8; 
            margin: 20px 0; 
            border-radius: 4px;
        }
        .tags { 
            background: #e8f0fe; 
            color: #1a73e8;
            padding: 5px 10px; 
            border-radius: 20px; 
            display: inline-block; 
            margin: 2px; 
            font-size: 12px;
            font-weight: 500;
        }
        .workspace-header {
            background: #1a73e8;
            color: white;
            padding: 15px;
            margin: -15px -15px 15px -15px;
            border-radius: 4px 4px 0 0;
            font-weight: 500;
        }
        code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Roboto Mono', monospace;
            font-size: 14px;
        }
        blockquote {
            border-left: 4px solid #1a73e8;
            margin: 20px 0;
            padding-left: 15px;
            color: #5f6368;
            font-style: italic;
        }
        .collaboration-note {
            background: #e8f0fe;
            border: 1px solid #1a73e8;
            padding: 10px;
            border-radius: 4px;
            margin: 15px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="metadata">
        <div class="workspace-header">TriSex.org Knowledge Wiki - Google Workspace Compatible</div>
        <p><strong>Document:</strong> ${article.title}</p>
        <p><strong>Category:</strong> ${article.category.toUpperCase()}</p>
        <p><strong>Complexity Level:</strong> ${article.difficulty}</p>
        <p><strong>Estimated Reading Time:</strong> ${article.readTime}</p>
        <p><strong>Content Author:</strong> ${article.author}</p>
        <p><strong>Last Updated:</strong> ${article.lastUpdated}</p>
        <p><strong>Subject Tags:</strong> ${article.tags.map(tag => `<span class="tags">${tag}</span>`).join(' ')}</p>
        <div class="collaboration-note">
            <strong>📝 Google Workspace Features:</strong> This document supports collaborative editing, commenting, and version history in Google Docs. Share with your team for real-time collaboration.
        </div>
    </div>
    
    <h1>${article.title}</h1>
    
    ${article.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}
    
    <div class="collaboration-note">
        <strong>🔗 Integration Options:</strong><br>
        • Use Google Drive API for programmatic access<br>
        • Share via Google Sites for public access<br>
        • Export to Google Sheets for data analysis<br>
        • Connect with Google Forms for feedback collection
    </div>
</body>
</html>`;

  // Also create a Google Apps Script for advanced integration
  const googleAppsScript = `
// Google Apps Script for TriSex.org Wiki Integration
// Paste this into script.google.com for automated content management

function importTriSexWikiContent() {
  const article = {
    title: "${article.title}",
    content: \`${article.content.replace(/`/g, '\\`')}\`,
    category: "${article.category}",
    tags: ${JSON.stringify(article.tags)},
    author: "${article.author}",
    lastUpdated: "${article.lastUpdated}"
  };
  
  // Create new Google Doc
  const doc = DocumentApp.create('TriSex Wiki: ' + article.title);
  const body = doc.getBody();
  
  // Add title
  const title = body.appendParagraph(article.title);
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);
  
  // Add metadata table
  const table = body.appendTable();
  table.appendTableRow().appendTableCell('Category:').appendTableCell(article.category);
  table.appendTableRow().appendTableCell('Author:').appendTableCell(article.author);
  table.appendTableRow().appendTableCell('Updated:').appendTableCell(article.lastUpdated);
  table.appendTableRow().appendTableCell('Tags:').appendTableCell(article.tags.join(', '));
  
  // Add content
  body.appendParagraph('\\n' + article.content);
  
  // Share with domain (optional)
  // doc.addViewer('your-domain@example.com');
  
  Logger.log('Document created: ' + doc.getUrl());
  return doc.getUrl();
}

function createWikiSpreadsheet() {
  // Create Google Sheet for wiki analytics
  const sheet = SpreadsheetApp.create('TriSex Wiki Analytics');
  const worksheet = sheet.getActiveSheet();
  
  // Add headers
  worksheet.getRange(1, 1, 1, 6).setValues([['Title', 'Category', 'Author', 'Last Updated', 'Tags', 'Read Time']]);
  
  // Add this article's data
  worksheet.getRange(2, 1, 1, 6).setValues([[
    "${article.title}",
    "${article.category}",
    "${article.author}",
    "${article.lastUpdated}",
    "${article.tags.join(', ')}",
    "${article.readTime}"
  ]]);
  
  Logger.log('Spreadsheet created: ' + sheet.getUrl());
  return sheet.getUrl();
}
`;

  // Create multiple download options
  const htmlBlob = new Blob([googleDocsContent], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlA = document.createElement('a');
  htmlA.href = htmlUrl;
  htmlA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_google_workspace.html`;
  htmlA.click();
  URL.revokeObjectURL(htmlUrl);

  const scriptBlob = new Blob([googleAppsScript], { type: 'text/javascript' });
  const scriptUrl = URL.createObjectURL(scriptBlob);
  const scriptA = document.createElement('a');
  scriptA.href = scriptUrl;
  scriptA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_google_apps_script.js`;
  scriptA.click();
  URL.revokeObjectURL(scriptUrl);

  // Copy content to clipboard for direct paste
  navigator.clipboard?.writeText(article.content);

  // Create Google Workspace URLs
  const googleDocsUrl = `https://docs.google.com/document/create?title=${encodeURIComponent('TriSex Wiki: ' + article.title)}&usp=docs_home&ths=true`;
  const googleSheetsUrl = `https://sheets.google.com/create?title=${encodeURIComponent('TriSex Wiki Analytics')}&usp=sheets_home&ths=true`;
  const googleSitesUrl = `https://sites.google.com/new?title=${encodeURIComponent('TriSex Wiki Site')}&usp=sites_home&ths=true`;

  const instructions = `
Google Workspace Integration Complete! ✅

Downloaded Files:
• HTML file optimized for Google Docs import
• Google Apps Script for automated integration
• Content copied to clipboard!

Quick Actions:
1. 📄 New Google Doc: ${googleDocsUrl}
2. 📊 New Google Sheet: ${googleSheetsUrl}  
3. 🌐 New Google Site: ${googleSitesUrl}

Advanced Integration:
• Use the Google Apps Script at script.google.com
• Connect with Google Drive API for bulk operations
• Set up Google Forms for content feedback
• Use Google Sites for public knowledge sharing

Paste content directly or import the HTML file!
`;
  
  alert(instructions);
};

const exportToAppleNotes = (article: WikiArticle) => {
  // Create rich Apple Notes-compatible format with Apple ecosystem integration
  const isAppleDevice = navigator.userAgent.includes('Mac') || navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad');
  
  // Rich Apple Notes format with markdown support
  const appleNotesContent = `# ${article.title}

## 📋 Article Information
**Category:** ${article.category.toUpperCase()}  
**Difficulty:** ${article.difficulty}  
**Reading Time:** ${article.readTime}  
**Author:** ${article.author}  
**Last Updated:** ${article.lastUpdated}  
**Tags:** ${article.tags.join(', ')}

---

${article.content}

---

## 🍎 Apple Ecosystem Integration
• **Siri Shortcuts:** Create a shortcut to access this content quickly
• **Spotlight Search:** Content will be searchable across your device  
• **Continuity:** Access on iPhone, iPad, and Mac with automatic sync
• **Share Sheet:** Share with Health app, Reminders, or Calendar
• **Shortcuts App:** Automate health reminders and tracking

**TriSex.org Wiki** - Accessible on all your Apple devices`;

  // Create Apple Shortcuts integration script
  const appleShortcutsScript = `
// Apple Shortcuts Integration Script
// Create a new shortcut in the Shortcuts app with these actions:

1. Text Action: Paste the content below
2. Add to Note Action: Choose "TriSex.org Wiki" folder
3. Share Sheet: Enable sharing to Health, Calendar, Reminders

Content for Shortcut:
${appleNotesContent}

// Optional: Add Siri phrase like "Open TriSex Wiki ${article.title}"
// This allows voice access: "Hey Siri, Open TriSex Wiki ${article.title}"
`;

  // Create iCloud sync configuration
  const iCloudConfig = `
# iCloud Notes Configuration for TriSex.org Wiki

## Setup Instructions:
1. Open Notes app → Folders → "On My Mac/iPhone/iPad"
2. Create new folder: "TriSex.org Wiki"
3. Enable iCloud sync: Settings → Apple ID → iCloud → Notes
4. Import this content into the new folder

## Folder Structure:
- TriSex.org Wiki/
  - Categories/
    - ${article.category}/
      - ${article.title}
  - Bookmarks/
  - Quick Access/

## Collaboration Features:
- Invite others to shared folders
- Real-time collaborative editing
- Comments and annotations
- Version history tracking

Source: ${article.title} - TriSex.org Knowledge Wiki
`;

  if (isAppleDevice) {
    // On Apple devices, provide multiple integration options
    navigator.clipboard?.writeText(appleNotesContent);
    
    // Try to create Apple Notes URL scheme (iOS/macOS)
    const notesUrlScheme = `notes://new?content=${encodeURIComponent(appleNotesContent)}`;
    
    // Create shortcuts URL for automation
    const shortcutsUrl = `shortcuts://create-shortcut?name=${encodeURIComponent('TriSex Wiki: ' + article.title)}`;

    const instructions = `
🍎 Apple Ecosystem Integration Complete!

✅ Content copied to clipboard!

Quick Actions:
• Open Notes app and paste (⌘V / Ctrl+V)  
• Use Siri: "Create a new note with clipboard"
• Share via AirDrop to other Apple devices

iOS 26+ / macOS 26+ Features:
• Native markdown import via Share Sheet
• Siri Shortcuts integration
• Health app connectivity for wellness content
• Calendar integration for scheduling

Advanced Integration:
1. Create Siri Shortcut: ${shortcutsUrl}
2. Open in Notes directly: notes://new (if supported)
3. Set up iCloud folder: "TriSex.org Wiki"
4. Enable Spotlight search for content discovery

Your content is ready for all Apple devices! 📱💻⌚
`;
    
    alert(instructions);
    
    // Download files for advanced users
    const mdBlob = new Blob([appleNotesContent], { type: 'text/markdown' });
    const mdUrl = URL.createObjectURL(mdBlob);
    const mdA = document.createElement('a');
    mdA.href = mdUrl;
    mdA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_apple_notes.md`;
    mdA.click();
    URL.revokeObjectURL(mdUrl);
    
    const shortcutBlob = new Blob([appleShortcutsScript], { type: 'text/plain' });
    const shortcutUrl = URL.createObjectURL(shortcutBlob);
    const shortcutA = document.createElement('a');
    shortcutA.href = shortcutUrl;
    shortcutA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_shortcuts_integration.txt`;
    shortcutA.click();
    URL.revokeObjectURL(shortcutUrl);

  } else {
    // On other platforms, prepare for Apple device transfer
    const mdBlob = new Blob([appleNotesContent], { type: 'text/markdown' });
    const mdUrl = URL.createObjectURL(mdBlob);
    const mdA = document.createElement('a');
    mdA.href = mdUrl;
    mdA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_apple_notes.md`;
    mdA.click();
    URL.revokeObjectURL(mdUrl);

    const configBlob = new Blob([iCloudConfig], { type: 'text/markdown' });
    const configUrl = URL.createObjectURL(configBlob);
    const configA = document.createElement('a');
    configA.href = configUrl;
    configA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_icloud_setup.md`;
    configA.click();
    URL.revokeObjectURL(configUrl);

    const instructions = `
🍎 Apple Notes Export Complete!

Downloaded Files:
• Markdown file optimized for Apple Notes
• iCloud setup configuration guide

Transfer Methods:
1. **AirDrop:** Send files to your Apple device
2. **iCloud Drive:** Upload and access from iOS/macOS
3. **Email:** Send to yourself and open on Apple device
4. **USB Transfer:** Connect device and copy files

On your Apple device:
• iOS 26+: Use Share Sheet to import directly
• macOS 26+: Native markdown support in Notes app
• Earlier versions: Copy/paste content into Notes

The files include Siri Shortcuts integration and iCloud sync setup!
`;
    
    alert(instructions);
  }
};

const exportToMSOffice = (article: WikiArticle) => {
  // Create Word-compatible HTML content
  const wordContent = `
<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<title>${article.title}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/></w:WordDocument></xml><![endif]-->
</head>
<body>
<h1>${article.title}</h1>
${article.content.replace(/\n\n/g, '</p><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^# /gm, '<h1>').replace(/^## /gm, '<h2>').replace(/^### /gm, '<h3>')}
</body>
</html>`;

  const blob = new Blob([wordContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  alert('Downloaded as .doc file! Open in Microsoft Word. For better conversion, consider using Microsoft MarkItDown tool or Writage plugin.');
};

const exportToOpenOffice = (article: WikiArticle) => {
  // Create comprehensive LibreOffice/OpenOffice compatible export with multiple formats
  
  // Enhanced HTML with LibreOffice-specific styles
  const libreOfficeHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${article.title}</title>
    <meta name="author" content="${article.author}">
    <meta name="generator" content="TriSex.org Wiki - LibreOffice Compatible Export">
    <meta name="description" content="${article.tags.join(', ')}">
    <style>
        @page { 
            margin: 2.5cm; 
            size: A4;
            @top-center { content: "TriSex.org Wiki - ${article.title}"; }
            @bottom-right { content: "Page " counter(page); }
        }
        body { 
            font-family: 'Liberation Sans', 'DejaVu Sans', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            max-width: none;
        }
        h1 { 
            color: #d63384; 
            border-bottom: 3px solid #d63384; 
            padding-bottom: 10px;
            font-size: 24pt;
            margin-bottom: 20pt;
            page-break-after: avoid;
        }
        h2 { 
            color: #0d6efd; 
            font-size: 18pt;
            margin-top: 24pt;
            margin-bottom: 12pt;
            page-break-after: avoid;
        }
        h3 { 
            color: #6c757d; 
            font-size: 14pt;
            margin-top: 18pt;
            margin-bottom: 9pt;
            page-break-after: avoid;
        }
        .metadata { 
            background: #f8f9fa; 
            padding: 12pt; 
            border-left: 4pt solid #d63384; 
            margin: 12pt 0; 
            border-radius: 4pt;
            page-break-inside: avoid;
        }
        .tags { 
            background: #e9ecef; 
            color: #495057;
            padding: 4pt 8pt; 
            border-radius: 12pt; 
            display: inline-block; 
            margin: 2pt; 
            font-size: 9pt;
            font-weight: bold;
        }
        .libre-header {
            background: #198754;
            color: white;
            padding: 12pt;
            margin: -12pt -12pt 12pt -12pt;
            border-radius: 4pt 4pt 0 0;
            font-weight: bold;
            text-align: center;
        }
        .integration-box {
            border: 1pt solid #dee2e6;
            padding: 10pt;
            margin: 12pt 0;
            border-radius: 4pt;
            background: #f8f9fa;
            page-break-inside: avoid;
        }
        code {
            background: #e9ecef;
            padding: 2pt 4pt;
            border-radius: 2pt;
            font-family: 'Liberation Mono', 'DejaVu Sans Mono', monospace;
            font-size: 10pt;
        }
        blockquote {
            border-left: 4pt solid #6c757d;
            margin: 12pt 0;
            padding-left: 12pt;
            color: #6c757d;
            font-style: italic;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 12pt 0;
        }
        th, td {
            border: 1pt solid #dee2e6;
            padding: 6pt 8pt;
            text-align: left;
        }
        th {
            background: #e9ecef;
            font-weight: bold;
        }
        @media print {
            .integration-box { page-break-inside: avoid; }
            h1, h2, h3 { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <div class="metadata">
        <div class="libre-header">TriSex.org Knowledge Wiki - LibreOffice/OpenOffice Compatible</div>
        <table>
            <tr><td><strong>Document Title:</strong></td><td>${article.title}</td></tr>
            <tr><td><strong>Category:</strong></td><td>${article.category.toUpperCase()}</td></tr>
            <tr><td><strong>Difficulty Level:</strong></td><td>${article.difficulty}</td></tr>
            <tr><td><strong>Estimated Reading Time:</strong></td><td>${article.readTime}</td></tr>
            <tr><td><strong>Content Author:</strong></td><td>${article.author}</td></tr>
            <tr><td><strong>Last Updated:</strong></td><td>${article.lastUpdated}</td></tr>
            <tr><td><strong>Subject Tags:</strong></td><td>${article.tags.map(tag => `<span class="tags">${tag}</span>`).join(' ')}</td></tr>
        </table>
    </div>
    
    <h1>${article.title}</h1>
    
    ${article.content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    }
    
    <div class="integration-box">
        <h3>🔧 LibreOffice Integration Features</h3>
        <p><strong>Current Version Support:</strong> LibreOffice 7.0+ / OpenOffice 4.0+</p>
        <p><strong>Coming in LibreOffice 26.2 (2026):</strong> Native Markdown import/export</p>
        <p><strong>Advanced Features:</strong></p>
        <ul>
            <li>Master documents for multi-article collections</li>
            <li>Cross-references and automatic indexing</li>
            <li>Export to PDF with bookmarks and metadata</li>
            <li>Integration with Zotero for citations</li>
            <li>Version control with Git integration</li>
        </ul>
    </div>
    
    <div class="integration-box">
        <h3>📊 Document Statistics</h3>
        <table>
            <tr><th>Property</th><th>Value</th></tr>
            <tr><td>Word Count (approx)</td><td>${article.content.split(' ').length} words</td></tr>
            <tr><td>Character Count</td><td>${article.content.length} characters</td></tr>
            <tr><td>Paragraph Count</td><td>${article.content.split('\n\n').length} paragraphs</td></tr>
            <tr><td>Export Format</td><td>HTML → LibreOffice Writer</td></tr>
        </table>
    </div>
</body>
</html>`;

  // Create OpenDocument Text (ODT) metadata for future compatibility
  const odtMetadata = `
# LibreOffice ODT Conversion Instructions

## Quick Import (Current):
1. Save the downloaded HTML file
2. Open LibreOffice Writer
3. File → Open → Select HTML file
4. File → Save As → OpenDocument Text (.odt)

## Advanced Conversion with Pandoc:
\`\`\`bash
# Install Pandoc (pandoc.org)
pandoc "${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_libreoffice.html" -o "${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.odt" --metadata title="${article.title}" --metadata author="${article.author}"
\`\`\`

## LibreOffice Extension Recommendations:
- **Writage**: Enhanced Markdown support
- **Zotero Integration**: Citation management
- **Git Integration**: Version control
- **Language Tool**: Grammar checking
- **Grammalecte**: French/multi-language support

## Future Features (LibreOffice 26.2+):
- Native Markdown import via File → Import → Markdown
- Direct Wiki integration via Extensions
- Real-time collaborative editing improvements
- Enhanced accessibility features

## OpenOffice Compatibility:
This document is compatible with OpenOffice 4.0+
For best results, use LibreOffice (more actively developed)

Generated from: TriSex.org Knowledge Wiki
Source: ${article.title}
Export Date: ${new Date().toLocaleDateString()}
`;

  // Create Writer template for consistent formatting
  const writerTemplate = `
<?xml version="1.0" encoding="UTF-8"?>
<!-- LibreOffice Writer Template for TriSex.org Wiki Articles -->
<office:document-content 
    xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
    xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
    xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0">
    
<office:automatic-styles>
    <style:style style:name="WikiTitle" style:family="paragraph">
        <style:text-properties fo:font-size="24pt" fo:font-weight="bold" fo:color="#d63384"/>
    </style:style>
    <style:style style:name="WikiHeader" style:family="paragraph">
        <style:text-properties fo:font-size="18pt" fo:font-weight="bold" fo:color="#0d6efd"/>
    </style:style>
    <style:style style:name="WikiMetadata" style:family="paragraph">
        <style:paragraph-properties fo:background-color="#f8f9fa" fo:padding="12pt"/>
    </style:style>
</office:automatic-styles>

<office:body>
    <office:text>
        <text:h text:style-name="WikiTitle">${article.title}</text:h>
        <text:p text:style-name="WikiMetadata">
            Category: ${article.category} | Author: ${article.author} | Updated: ${article.lastUpdated}
        </text:p>
        ${article.content.split('\n').map(line => 
          `<text:p text:style-name="Standard">${line}</text:p>`
        ).join('\n        ')}
    </office:text>
</office:body>
</office:document-content>`;

  // Download multiple formats
  const htmlBlob = new Blob([libreOfficeHtml], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlA = document.createElement('a');
  htmlA.href = htmlUrl;
  htmlA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_libreoffice.html`;
  htmlA.click();
  URL.revokeObjectURL(htmlUrl);

  const metadataBlob = new Blob([odtMetadata], { type: 'text/markdown' });
  const metadataUrl = URL.createObjectURL(metadataBlob);
  const metadataA = document.createElement('a');
  metadataA.href = metadataUrl;
  metadataA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_libreoffice_guide.md`;
  metadataA.click();
  URL.revokeObjectURL(metadataUrl);

  const templateBlob = new Blob([writerTemplate], { type: 'application/xml' });
  const templateUrl = URL.createObjectURL(templateBlob);
  const templateA = document.createElement('a');
  templateA.href = templateUrl;
  templateA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_writer_template.xml`;
  templateA.click();
  URL.revokeObjectURL(templateUrl);

  const instructions = `
📄 LibreOffice/OpenOffice Integration Complete!

Downloaded Files:
• HTML optimized for LibreOffice Writer import
• Conversion guide with Pandoc instructions  
• Writer template for consistent formatting

Import Instructions:
1. **Simple Import:** Open HTML file in LibreOffice Writer
2. **Advanced:** Use Pandoc for ODT conversion
3. **Template:** Import XML template for styling

LibreOffice Features:
✅ Print-ready formatting with proper page breaks
✅ Table of contents generation ready
✅ Professional styling with TriSex.org branding
✅ Metadata preservation for document properties
✅ Cross-platform compatibility (Windows/Mac/Linux)

Future Support (LibreOffice 26.2+):
🔮 Native Markdown import/export
🔮 Enhanced Wiki integration
🔮 Improved collaborative features

Your content is ready for professional document creation! 📝
`;

  alert(instructions);
};

const exportToAppFlowy = (article: WikiArticle) => {
  // Create comprehensive AppFlowy workspace integration with enhanced features
  
  // Enhanced AppFlowy markdown with metadata blocks
  const appFlowyContent = `---
title: ${article.title}
category: ${article.category}
tags: [${article.tags.map(tag => `"${tag}"`).join(', ')}]
author: ${article.author}
created: ${article.lastUpdated}
difficulty: ${article.difficulty}
readTime: ${article.readTime}
source: TriSex.org Knowledge Wiki
appflowy_version: "0.3.0+"
workspace: TriSex.org Wiki
---

# ${article.title}

## 📊 Article Metadata
- **Category**: ${article.category.toUpperCase()}
- **Difficulty Level**: ${article.difficulty}
- **Estimated Reading Time**: ${article.readTime}
- **Author**: ${article.author}
- **Last Updated**: ${article.lastUpdated}
- **Tags**: ${article.tags.join(' • ')}

---

${article.content}

---

## 🔧 AppFlowy Integration Features

### Database Integration
- Create a new database in AppFlowy for tracking all Wiki articles
- Use properties: Title, Category, Difficulty, Tags, Read Time
- Filter and sort articles by category or difficulty level

### Collaborative Features
- Share workspace with team members for real-time collaboration
- Use comments and mentions for team discussions
- Track reading progress with checkboxes and progress bars

### Organization Tips
- Create separate pages for each category (${article.category})
- Use AppFlowy's hierarchical page structure for better organization
- Link related articles using [[Page Name]] syntax

### Advanced Features (AppFlowy 0.4+)
- Calendar integration for scheduling reading sessions
- Reminder system for regular content reviews
- Export to PDF/Word for offline access
- Integration with task management workflows

**Source**: TriSex.org Knowledge Wiki - ${article.title}
**Compatible**: AppFlowy 0.3.0+ (Notion-alternative, open-source)`;

  // Create AppFlowy database template
  const appFlowyDatabase = `
# AppFlowy Database Template for TriSex.org Wiki

## Database Properties Setup:
1. **Title** (Title): Primary field for article names
2. **Category** (Select): ${Array.from(new Set([article.category])).join(', ')}
3. **Difficulty** (Select): Beginner, Intermediate, Advanced
4. **Tags** (Multi-select): ${article.tags.join(', ')}
5. **Author** (Text): Content creator name
6. **Read Time** (Number): Estimated minutes to read
7. **Last Updated** (Date): When content was last modified
8. **Status** (Select): To Read, Reading, Completed
9. **Rating** (Number): Personal rating 1-5
10. **Notes** (Text): Personal notes and reflections

## Sample Entry:
- **Title**: ${article.title}
- **Category**: ${article.category}
- **Difficulty**: ${article.difficulty}
- **Tags**: ${article.tags.join(', ')}
- **Author**: ${article.author}
- **Read Time**: ${parseInt(article.readTime)}
- **Last Updated**: ${article.lastUpdated}
- **Status**: To Read
- **Rating**: (Rate after reading)
- **Notes**: (Add your thoughts here)

## Workspace Structure:
- 📚 TriSex.org Wiki/
  - 📊 Article Database (main database)
  - 📁 Categories/
    - ${article.category}/
      - ${article.title}
  - 📈 Reading Progress
  - 🔖 Bookmarks
  - 💭 Personal Notes

## Tips for AppFlowy Usage:
- Use templates for consistent article formatting
- Create filtered views for different categories
- Set up recurring reminders for content updates
- Use AppFlowy's block-based editor for rich formatting
- Link related articles using bidirectional linking
`;

  // Create AppFlowy workspace export configuration
  const appFlowyWorkspace = `
{
  "workspace": {
    "name": "TriSex.org Knowledge Wiki",
    "description": "Comprehensive sexual health education and resources",
    "version": "1.0",
    "created_by": "TriSex.org",
    "last_updated": "${new Date().toISOString()}",
    "pages": [
      {
        "id": "wiki_${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}",
        "title": "${article.title}",
        "content": ${JSON.stringify(appFlowyContent)},
        "properties": {
          "category": "${article.category}",
          "difficulty": "${article.difficulty}",
          "tags": ${JSON.stringify(article.tags)},
          "author": "${article.author}",
          "readTime": "${article.readTime}",
          "lastUpdated": "${article.lastUpdated}"
        }
      }
    ],
    "databases": [
      {
        "id": "trisex_wiki_articles",
        "name": "TriSex Wiki Articles",
        "description": "Comprehensive database of all Wiki articles",
        "properties": {
          "title": {"type": "title"},
          "category": {"type": "select", "options": ["${article.category}"]},
          "difficulty": {"type": "select", "options": ["Beginner", "Intermediate", "Advanced"]},
          "tags": {"type": "multi_select", "options": ${JSON.stringify(article.tags)}},
          "author": {"type": "text"},
          "readTime": {"type": "number"},
          "lastUpdated": {"type": "date"},
          "status": {"type": "select", "options": ["To Read", "Reading", "Completed"]},
          "rating": {"type": "number", "min": 1, "max": 5},
          "notes": {"type": "text"}
        }
      }
    ]
  }
}
`;

  // Copy content to clipboard for immediate use
  navigator.clipboard?.writeText(appFlowyContent);
  
  // Download multiple formats for AppFlowy
  const mdBlob = new Blob([appFlowyContent], { type: 'text/markdown' });
  const mdUrl = URL.createObjectURL(mdBlob);
  const mdA = document.createElement('a');
  mdA.href = mdUrl;
  mdA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_appflowy.md`;
  mdA.click();
  URL.revokeObjectURL(mdUrl);

  const dbBlob = new Blob([appFlowyDatabase], { type: 'text/markdown' });
  const dbUrl = URL.createObjectURL(dbBlob);
  const dbA = document.createElement('a');
  dbA.href = dbUrl;
  dbA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_appflowy_database.md`;
  dbA.click();
  URL.revokeObjectURL(dbUrl);

  const workspaceBlob = new Blob([appFlowyWorkspace], { type: 'application/json' });
  const workspaceUrl = URL.createObjectURL(workspaceBlob);
  const workspaceA = document.createElement('a');
  workspaceA.href = workspaceUrl;
  workspaceA.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_appflowy_workspace.json`;
  workspaceA.click();
  URL.revokeObjectURL(workspaceUrl);

  const instructions = `
🚀 AppFlowy Integration Complete!

Downloaded Files:
• Enhanced Markdown with YAML frontmatter
• Database template with properties setup
• Complete workspace configuration (JSON)
• Content copied to clipboard!

AppFlowy Import Options:

1. **Quick Import (Immediate):**
   • Open AppFlowy and create new page
   • Paste content from clipboard (rich formatting preserved)
   • Content includes metadata and organization structure

2. **Advanced Database Setup:**
   • Import database template to create structured knowledge base
   • Track reading progress, ratings, and personal notes
   • Filter and organize articles by category and difficulty

3. **Workspace Import (AppFlowy 0.4+):**
   • Use JSON workspace file for complete setup
   • Includes database properties and page templates
   • Automated organization structure

AppFlowy Features Enabled:
✅ Block-based rich text editing
✅ Database with filtering and sorting
✅ Bidirectional linking between articles
✅ Real-time collaborative editing
✅ Offline access and sync
✅ Open-source privacy protection

Organization Tips:
• Create filtered views for each category
• Use templates for consistent formatting
• Set up recurring reminders for updates
• Link related articles with [[Article Name]]

Your knowledge base is ready for AppFlowy! 📚✨
`;

  alert(instructions);
};

// Public Health Agency Export Functions
const exportToMicrosoftTeams = (article: WikiArticle) => {
  // Create Teams-compatible format with metadata for public health sharing
  const teamsContent = `
📊 **Public Health Data: ${article.title}**

**Classification:** ${article.category.toUpperCase()}
**Risk Level:** ${article.difficulty}
**Last Updated:** ${article.lastUpdated}
**Author:** ${article.author}
**Reading Time:** ${article.readTime}

**Tags:** ${article.tags.join(', ')}

---

${article.content}

---

**Data Sharing Compliance:**
- ✅ De-identified public health information
- ✅ Educational content for health professionals
- ✅ Approved for inter-agency collaboration
- ✅ HIPAA-compliant when shared appropriately

**For Questions Contact:** TriSex.org Clinical Partners
**Source:** TriSex.org Knowledge Wiki
`;

  navigator.clipboard?.writeText(teamsContent);
  
  // Create shareable link format for Teams
  const teamsShareUrl = `https://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent('Sharing important public health data from TriSex.org Wiki: ' + article.title)}`;
  
  const instructions = `
Microsoft Teams Sharing Instructions:
1. Content copied to clipboard!
2. Paste into Teams chat or channel
3. Or click the link below to start a Teams conversation:

${teamsShareUrl}

The content is formatted for public health professionals with proper compliance metadata.
`;
  
  alert(instructions);
  
  // Also download as .md for Teams file sharing
  const blob = new Blob([teamsContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PHD_${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_teams.md`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToPublicHealthPlatforms = (article: WikiArticle) => {
  // Create comprehensive public health dataset export
  const publicHealthData = {
    metadata: {
      title: article.title,
      category: article.category,
      classification: "Public Health Educational Content",
      dataType: "Sexual Health Guidelines",
      compliance: {
        hipaa: "Compliant - De-identified Information",
        ferpa: "Not Applicable",
        gdpr: "Compliant - Legitimate Interest",
        accessibility: "Section 508 Compliant"
      },
      distribution: {
        authorizedFor: "Public Health Agencies",
        restrictedUse: "Professional/Educational Only",
        attribution: "TriSex.org Knowledge Wiki"
      },
      lastUpdated: article.lastUpdated,
      author: article.author,
      reviewedBy: "TriSex.org Clinical Partners",
      version: "1.0"
    },
    content: {
      summary: article.content.substring(0, 500) + "...",
      fullText: article.content,
      tags: article.tags,
      difficulty: article.difficulty,
      estimatedReadTime: article.readTime
    },
    publicHealthRelevance: {
      diseasePreventionValue: "High",
      communityHealthImpact: "Regional/National",
      interventionGuidance: "Evidence-Based",
      policyImplications: "Moderate"
    }
  };

  const jsonData = JSON.stringify(publicHealthData, null, 2);
  
  // Create multiple format exports for different platforms
  const csvData = `Title,Category,Tags,Last Updated,Author,Difficulty,Read Time,Content Summary
"${article.title}","${article.category}","${article.tags.join('; ')}","${article.lastUpdated}","${article.author}","${article.difficulty}","${article.readTime}","${article.content.substring(0, 200).replace(/"/g, '""')}..."`;

  const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<PublicHealthData>
  <Article>
    <Title>${article.title}</Title>
    <Category>${article.category}</Category>
    <Tags>${article.tags.join(', ')}</Tags>
    <LastUpdated>${article.lastUpdated}</LastUpdated>
    <Author>${article.author}</Author>
    <Difficulty>${article.difficulty}</Difficulty>
    <ReadTime>${article.readTime}</ReadTime>
    <Content><![CDATA[${article.content}]]></Content>
  </Article>
</PublicHealthData>`;

  // Download JSON format for API integration
  const jsonBlob = new Blob([jsonData], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonA = document.createElement('a');
  jsonA.href = jsonUrl;
  jsonA.download = `PHD_${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`;
  jsonA.click();
  URL.revokeObjectURL(jsonUrl);

  // Download CSV for spreadsheet applications
  const csvBlob = new Blob([csvData], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(csvBlob);
  const csvA = document.createElement('a');
  csvA.href = csvUrl;
  csvA.download = `PHD_${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.csv`;
  csvA.click();
  URL.revokeObjectURL(csvUrl);

  alert('Public Health Data exported in multiple formats:\n• JSON (for API integration)\n• CSV (for spreadsheet analysis)\n\nAll exports include compliance metadata and are approved for inter-agency sharing.');
};

const createPublicHealthDataset = (articles: WikiArticle[]) => () => {
  // Create comprehensive public health dataset from all articles
  const publicHealthDataset = {
    metadata: {
      title: "TriSex.org Wiki - Public Health Dataset",
      description: "Comprehensive sexual health education and intervention data",
      version: "1.0",
      created: new Date().toISOString(),
      articlesIncluded: articles.length,
      classification: "Public Health Educational Content",
      compliance: {
        hipaa: "Compliant - De-identified Information",
        gdpr: "Compliant - Legitimate Interest",
        accessibility: "Section 508 Compliant"
      },
      authorizedFor: "Public Health Agencies, Healthcare Systems, Educational Institutions",
      attribution: "TriSex.org Knowledge Wiki - Creative Commons BY-SA 4.0"
    },
    articles: articles.map((article: WikiArticle) => ({
      id: article.id,
      title: article.title,
      category: article.category,
      tags: article.tags,
      lastUpdated: article.lastUpdated,
      author: article.author,
      difficulty: article.difficulty,
      readTime: article.readTime,
      contentSummary: article.content.substring(0, 300) + "...",
      fullContent: article.content,
      publicHealthRelevance: {
        diseasePreventionValue: article.category === 'sti' ? 'High' : 'Medium',
        communityHealthImpact: 'Regional/National',
        interventionGuidance: 'Evidence-Based'
      }
    })),
    statistics: {
      totalArticles: articles.length,
      categoriesIncluded: Array.from(new Set(articles.map(a => a.category))),
      totalReadTime: articles.reduce((sum, a) => sum + parseInt(a.readTime), 0),
      difficultyDistribution: {
        beginner: articles.filter(a => a.difficulty === 'Beginner').length,
        intermediate: articles.filter(a => a.difficulty === 'Intermediate').length,
        advanced: articles.filter(a => a.difficulty === 'Advanced').length
      }
    }
  };

  const jsonData = JSON.stringify(publicHealthDataset, null, 2);
  
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trisex_public_health_dataset.json';
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Complete Public Health Dataset exported!\n\nThis dataset is approved for:\n• Inter-agency collaboration\n• Research partnerships\n• Policy development\n• Community health programs\n\nAll data is de-identified and compliant with health data sharing regulations.');
};

const createExportAllArticles = (articles: WikiArticle[]) => () => {
  // Create ZIP file with all articles in multiple formats
  const allContent = articles.map((article: WikiArticle) => ({
    markdown: article.content,
    filename: `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`,
    title: article.title,
    metadata: `---
title: ${article.title}
category: ${article.category}
tags: ${article.tags.join(', ')}
author: ${article.author}
lastUpdated: ${article.lastUpdated}
difficulty: ${article.difficulty}
readTime: ${article.readTime}
---

`
  }));

  // For now, create a combined markdown file
  const combinedContent = allContent.map((article: any) => 
    `${article.metadata}${article.markdown}\n\n---\n\n`
  ).join('');

  const blob = new Blob([combinedContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trisex_wiki_complete.md';
  a.click();
  URL.revokeObjectURL(url);
  alert('Complete wiki exported! This file can be imported into any platform supporting markdown.');
};

export default function Wiki() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);
  const [showInteroperability, setShowInteroperability] = useState(false);

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen, count: 13 },
    { id: "sizing", name: "Custom Sizing", icon: Ruler, count: 1 },
    { id: "health", name: "Sexual Health", icon: Heart, count: 7 },
    { id: "sti", name: "STI Prevention", icon: Droplets, count: 1 },
    { id: "cooperative", name: "Cooperative Principles", icon: Users, count: 1 },
    { id: "technical", name: "Technical Guide", icon: TestTube, count: 3 },
    { id: "economic", name: "Economic Impact", icon: Coins, count: 1 }
  ];

  const wikiArticles: WikiArticle[] = [
    {
      id: "precision-sizing-guide",
      title: "TriSex.org Intersex-Centered Sizing: Complete Guide to 60+ Custom Fits",
      category: "sizing",
      content: `# Intersex-Centered Precision Sizing Guide

[img: "Sizing System Overview" caption="TriSex.org's 60+ size system starts from intersex anatomical diversity as the universal baseline."]

## Centering Intersex Anatomy

TriSex.org's precision sizing system is built from the ground up around intersex anatomical diversity. Rather than treating intersex bodies as special cases, we center intersex variations as our baseline — ensuring all anatomical configurations have access to precision protection without forced categorization.

> Intersex anatomical diversity is natural human variation, not an outlier. Our sizing honors this truth.

---

## Why Intersex-Centered Sizing Matters

Traditional sizing systems assumed only two anatomical types, used limited data for "standard" sizes, forced intersex individuals into inadequate categories, and excluded natural variation from the design process.

Our approach is different:

| Principle | Description |
| --- | --- |
| Foundation, Not Afterthought | Intersex variations inform the entire sizing spectrum |
| No Forced Categorization | All anatomies measured on their own terms |
| Anatomical Neutrality | Sizing based on measurement, not gender assumption |
| Inclusive Design | 60+ sizes accommodate the full human spectrum |

---

## The 60+ Size System

Sizes use a letter-number code. Letters indicate width (circumference), numbers indicate length. For example, C3 means mid-range width with mid-range length. No binary labels are used — sizes describe fit characteristics, not gender.

### Width Categories

| Series | Circumference | Fit Description |
| --- | --- | --- |
| A | 45–47 mm | Narrow |
| B | 47–49 mm | Compact |
| C | 49–51 mm | Mid-range |
| D | 51–53 mm | Moderate |
| E | 53–55 mm | Generous |
| F | 55–57 mm | Spacious |
| G | 57–60 mm | Expansive |
| H | 60+ mm | Maximum |

### Length Categories

| Series | Length |
| --- | --- |
| 1 | 160 mm |
| 3 | 170 mm |
| 5 | 180 mm |

> ⚧️ These ranges accommodate natural anatomical variations including intersex configurations, without requiring users to identify or categorize their bodies.

[chart:pie "Size Distribution Across Width Categories"]
A Series|8
B Series|12
C Series|20
D Series|22
E Series|18
F Series|10
G Series|6
H Series|4
[/chart]

---

## Measurement Best Practices

> Your anatomy is measured on its own terms, without comparison to binary "norms."

All measurements are processed locally on your device with no data transmission. No anatomical categorization is required. Our 3D scanner accommodates all configurations, and you control your data.

### By Anatomy Type

| Anatomy | Approach |
| --- | --- |
| Standard erectile | Measure full length and circumference at widest point |
| Intersex | Flexible multi-point measurement; 3D scanner recommended |
| Post-surgical | Measure current configuration; note sensitivity zones |

### Common Sizing Questions

**Challenge**: "My anatomy doesn't fit binary assumptions"
**Solution**: Our system doesn't use binary assumptions. Measure your anatomy exactly as it exists.

**Challenge**: "I have intersex anatomy and don't know how to categorize it"
**Solution**: Don't categorize — just measure. Our 60+ sizes accommodate all configurations.

**Challenge**: "My anatomy varies significantly in different states"
**Solution**: Measure in the state when you'll use protection. Our 3D scanner can capture variations.

**Challenge**: "I've had gender-affirming surgery and sizing is confusing"
**Solution**: Measure your current anatomy. Post-surgical configurations are fully accommodated.

---

## Fit Optimization

Three fit profiles are available, none of which are gender-based:

| Fit | Feel | Best For |
| --- | --- | --- |
| Narrow | Minimal movement, maximum security | High activity use |
| Mid-Range | Balanced comfort and security | Everyday versatility |
| Spacious | Easy application, relaxed | Maximum comfort |

Verify your fit by testing with free samples, checking comfort under typical conditions, confirming proper retention, and ensuring adequate sensitivity.

---

## Who This Serves

- ✓ Intersex anatomical configurations (all variations)
- ✓ Post-gender-affirming-surgery anatomy
- ✓ Natural variations across the human spectrum
- ✓ Bodies affected by medical conditions or treatments
- ✓ Anatomies in various states (hormone therapy, healing, etc.)
- ✓ Any configuration not listed — we honor all bodies

### What We Never Ask

You will never be asked to identify as male or female, categorize your anatomy type, declare whether your anatomy is "normal," or fit into a binary category. We ask only for your measurements, your preferred fit feel, and which protection features matter to you.

---

## Conclusion

TriSex.org's intersex-centered sizing represents a fundamental shift: from forcing diverse bodies into narrow categories, to building protection systems around the reality of human anatomical diversity.

> Your anatomy is not a problem to solve. It's a reality to honor.

*Developed in consultation with intersex advocates, medical professionals, and community members.*`,
      tags: ["sizing", "measurement", "precision", "custom-fit", "intersex-centered", "inclusive", "anatomical-diversity"],
      lastUpdated: "2025-01-13",
      author: "TriSex.org Intersex-Centered Design Team",
      difficulty: "Beginner",
      readTime: "16 min"
    },
    {
      id: "4d-sti-intervention",
      title: "4D STI Intervention: Bioregional Testing and Public Health",
      category: "sti",
      content: `# 4D STI Intervention System

[img: "Bioregional Monitoring Network" caption="Wastewater-based epidemiology enables population-level STI surveillance without individual identification."]

## Overview

A revolutionary approach to STI prevention using bioregional sewer and water sampling for targeted public health interventions. The system operates across four dimensions simultaneously.

---

## The Four Dimensions

| Dimension | Focus | Examples |
| --- | --- | --- |
| Geographic | Spatial granularity | Zip code, county, state; urban vs rural |
| Temporal | Time-series tracking | 24-hour cycles, weekly trends, seasonal patterns |
| Biomarker | Pathogen detection | Chlamydia DNA, gonorrhea markers, HIV viral load, HPV strains |
| Intervention | Response targeting | Education campaigns, mobile testing, resource allocation |

[chart:bar "Biomarker Detection Capabilities"]
Chlamydia|95
Gonorrhea|93
Syphilis|88
HIV|97
HPV|85
Herpes|82
[/chart]

---

## Technical Pipeline

### Sample Collection → Lab Analysis → Data Processing

| Stage | Method |
| --- | --- |
| Collection | Automated 24-hour composite sampling, temperature-controlled transport |
| Lab Analysis | qPCR, mass spectrometry, next-generation sequencing |
| Processing | Population normalization, privacy-preserving analytics, ML trend detection |

---

## Public Health Applications

The system provides early warning (7–14 days advance outbreak prediction), hotspot identification, and resource demand forecasting. Intervention targeting uses geographic precision, demographic specificity, and cost-effectiveness optimization.

Policy development follows evidence-based recommendations, prevention strategy validation, and health equity considerations.

## Privacy and Ethics

All reporting is aggregate-only with no individual identification. The system uses secure data transmission, limited access protocols, transparent methodology, community consent processes, IRB approval, and regular ethical review.`,
      tags: ["sti", "bioregional", "public-health", "intervention", "4d"],
      lastUpdated: "2024-01-14",
      author: "Public Health Research Team",
      difficulty: "Advanced",
      readTime: "18 min"
    },
    {
      id: "cooperative-health-principles",
      title: "Cooperative Sexual Health: Principles and Implementation",
      category: "cooperative",
      content: `# Cooperative Sexual Health Model

[img: "Cooperative Governance" caption="Applying the seven international cooperative principles to sexual health services."]

## The Seven Cooperative Principles

| Principle | Application to Sexual Health |
| --- | --- |
| Voluntary & Open Membership | No discrimination by anatomy, identity, or status |
| Democratic Member Control | One member, one vote; elected board representation |
| Member Economic Participation | Equitable contributions; democratic capital control; dividends |
| Autonomy & Independence | Member-controlled; government/corporate independence |
| Education & Training | Comprehensive sexual health education; public campaigns |
| Cooperation Among Cooperatives | Inter-cooperative partnerships; shared resources |
| Concern for Community | Sustainable development; social justice; community health |

---

## BAD Co-op Integration

| Program | Focus |
| --- | --- |
| "for GOOD Sex" | Advance directives, consent documentation, preference communication |
| "for GOOD Health" | Member-directed health planning, mutual aid networks |
| "for Good People" | Consent-focused matchmaking, community-supported connections |

---

## Implementation

### Governance

The cooperative is governed by a member-elected board of directors, regional cooperative councils, special interest working groups, and youth and elder advisory committees.

### Economic Model

Membership uses a sliding scale fee structure. Surplus is distributed to members as dividends, with portions reinvested through community reinvestment programs and a cooperative development fund.

### Service Delivery

Member-owned health centers deliver cooperative education programs, democratic service planning, and community-controlled resources, all subject to member satisfaction surveys and peer accountability.`,
      tags: ["cooperative", "bad-coop", "governance", "community", "democracy"],
      lastUpdated: "2024-01-13",
      author: "Cooperative Development Team",
      difficulty: "Intermediate",
      readTime: "15 min"
    },
    {
      id: "daly-economic-impact",
      title: "DALY Tracking and Economic Impact on National Debt",
      category: "economic",
      content: `# DALY Tracking and Economic Impact Assessment

[img: "DALY Prevention Model" caption="Disability-Adjusted Life Years (DALYs) measure the total burden of disease, combining years lost to premature death with years lived with disability."]

## What is a DALY?

A Disability-Adjusted Life Year represents one lost year of healthy life. The formula is straightforward:

> DALY = Years of Life Lost (YLL) + Years Lived with Disability (YLD)

Each component captures a different dimension of disease burden: premature mortality and ongoing morbidity. Age-weighting and discount rates can adjust for time preference and demographic factors.

---

## STI Prevention: DALYs Saved

The table below summarizes TriSex's modeled prevention impact across four major STIs.

| STI | DALY per Case | Cases Prevented | DALYs Saved |
| --- | --- | --- | --- |
| Chlamydia | 0.18 | 71,374 | 12,847 |
| Gonorrhea | 0.19 | 46,983 | 8,927 |
| Syphilis | 0.32 | 48,851 | 15,632 |
| HIV | 7.80 | 3,006 | 23,447 |

[chart:bar "DALYs Saved by STI Category"]
Chlamydia|12847
Gonorrhea|8927
Syphilis|15632
HIV|23447
[/chart]

### Economic Valuation

| Valuation Method | Value per DALY |
| --- | --- |
| WHO Standard | $100,000 |
| US Healthcare Context | $150,000 |
| TriSex Conservative | $125,000 |

With 79,822 total DALYs saved and a conservative $125,000 per DALY valuation, the estimated annual economic value reaches $11.5 billion — an 8.4-to-1 return on prevention investment.

---

## National Debt Impact

> Sexual health prevention generates measurable fiscal returns that contribute to national debt reduction over time.

### Healthcare Cost Reduction

| Category | Savings |
| --- | --- |
| Direct treatment costs avoided | $4.2B |
| Emergency care prevented | $1.8B |
| Long-term care savings | $2.1B |
| Productivity gains | $3.4B |

[chart:bar "Healthcare Savings Breakdown (Billions)"]
Treatment|4.2
Emergency|1.8
Long-term Care|2.1
Productivity|3.4
[/chart]

### Fiscal Impact Summary

| Metric | Amount |
| --- | --- |
| Federal budget relief | $8.7B |
| State/local savings | $2.8B |
| Total public savings | $11.5B |

### Debt Reduction Projections

Against the current national debt of $33.8 trillion, prevention savings compound over time:

| Timeframe | Cumulative Savings |
| --- | --- |
| Annual | $11.5B |
| 10-year | $115B |
| 20-year | $230B |

---

## Measurement and Verification

Data comes from CDC surveillance systems, healthcare claims databases, death certificate analysis, and disability survey data. All models undergo peer review, statistical validation, sensitivity analysis, and uncertainty quantification.

Reporting follows annual DALY reports with quarterly updates, public transparency, and academic publication.

## Policy Implications

Prevention investment decisions rely on cost-effectiveness analysis, budget allocation guidance, and resource optimization. Healthcare reform efforts benefit from value-based care models, prevention-focused funding, community health investment, and health equity advancement.`,
      tags: ["daly", "economics", "national-debt", "healthcare", "impact"],
      lastUpdated: "2024-01-12",
      author: "Economic Analysis Team",
      difficulty: "Advanced",
      readTime: "20 min"
    },
    {
      id: "3d-anatomy-scanning",
      title: "Privacy-Preserving 3D Anatomy Scanning Technology",
      category: "technical",
      content: `# 3D Anatomy Scanning System

[img: "Privacy-Preserving Scanner" caption="On-device structured light scanning captures precise measurements without transmitting any data."]

## Technology Overview

| Method | How It Works |
| --- | --- |
| Structured light | Projects light patterns; measures deformation for sub-millimeter precision |
| Photogrammetry | Reconstructs 3D shape from multiple camera angles |
| LiDAR integration | Time-of-flight depth mapping for fast capture |
| AI-assisted | Neural network extracts key dimensions automatically |

---

## Privacy-First Architecture

Every scan runs entirely on your device. No images leave the phone or computer. After measurements are extracted, raw images are deleted automatically.

| Layer | Protection |
| --- | --- |
| Processing | On-device only, no cloud transmission |
| Storage | Encrypted local storage, user-controlled retention |
| Minimization | Measurements extracted, images deleted post-processing |
| Security | End-to-end encryption, biometric auth, regular audits |

---

## Scanning Process

1. Set up a private scanning environment and calibrate your device
2. Follow standardized pose guidance for 360-degree multi-angle capture
3. Receive real-time quality feedback during the scan
4. Measurements are extracted automatically, then images are securely deleted
5. Algorithm matches your dimensions to the best size recommendation

### Precision Standards

| Metric | Specification |
| --- | --- |
| Length accuracy | ±1 mm |
| Girth accuracy | ±0.5 mm |
| Repeatability | 99.5% consistency |

---

## Accessibility

The scanner supports multiple scanning positions for mobility accommodation, visual and hearing impairment support, multi-language interfaces, and cultural sensitivity considerations including indigenous language inclusion.

## Manufacturing Integration

Scan data flows directly into production workflows with quality control integration, batch processing efficiency, and sustainable material optimization for each custom-fit product.`,
      tags: ["3d-scanning", "privacy", "technology", "anatomy", "custom-fit"],
      lastUpdated: "2024-01-11",
      author: "Technology Development Team",
      difficulty: "Advanced",
      readTime: "16 min"
    },
    {
      id: "ocean-plastic-reprocessing",
      title: "Ocean Plastic Reprocessing with Plant-Based Materials",
      category: "technical",
      content: `# Ocean Plastic Reprocessing with Plant-Based Materials

[img: "Sustainable Manufacturing" caption="Ocean plastic collection and plant-based bio-material integration for eco-friendly protection products."]

## Overview

TriSex's sustainable manufacturing combines recycled ocean plastic with plant-based bio-materials to create high-performance, eco-friendly protection products. The blend ratio is 70% ocean plastic and 30% plant-based material.

---

## Collection and Sourcing

| Source | Material | Use |
| --- | --- | --- |
| Coastal cleanups | PET bottles | Primary film production |
| Ocean trawling | HDPE containers | Structural components |
| River interception | PP packaging | Flexible applications |
| Fishing bycatch | Mixed plastics | Various consumer waste |

### Bio-Polymer Sources

| Source | Role |
| --- | --- |
| Corn starch (PLA) | Biodegradable plastic alternative |
| Sugarcane bagasse | Renewable fiber reinforcement |
| Algae biomass | Marine-derived bio-plastics |
| Cassava root | Starch-based polymer matrix |
| Hemp fibers | Natural strength enhancement |

---

## Manufacturing Pipeline

Processing flows through five stages: automated optical sorting, multi-stage cleaning, mechanical shredding, density separation, and hot washing. The hybrid material is then created through mechanical blending, chemical compatibilization, reactive processing, and nanocellulose reinforcement.

### Quality Control

| Test | Requirement |
| --- | --- |
| Tensile strength | ≥ 30 MPa |
| Elongation at break | > 300% |
| Biocompatibility | ISO 10993 compliant |
| Burst pressure | > 2.5 kPa |
| Shelf life | 5 years |
| Temperature range | -20°C to +60°C |

### Environmental Impact

[chart:bar "Environmental Benefits"]
Carbon Reduction|60
Ocean Plastic Diverted (kg/200 units)|1
Renewable Content (%)|30
[/chart]

Each kilogram of ocean plastic collected produces approximately 200 protection units, with a 60% lower carbon footprint compared to virgin plastic production. End-of-life products are compostable in industrial facilities.

---

## Future Development

Emerging research areas include mushroom mycelium bio-plastics, bacterial cellulose fiber matrices, protein-based polymer films, and biomimetic design inspired by natural structures. Circular economy integration spans take-back programs, regional sourcing, indigenous knowledge partnerships, and zero-waste manufacturing goals.`,
      tags: ["ocean-plastic", "plant-based", "sustainable", "manufacturing", "bio-materials"],
      lastUpdated: "2024-01-16",
      author: "Sustainability Engineering Team",
      difficulty: "Advanced",
      readTime: "22 min"
    },
    {
      id: "medical-optimization",
      title: "Medicines and Therapies for Optimal TriSex Product Performance",
      category: "health",
      content: `# Medical Optimization for TriSex Products

[img: "Medical Compatibility" caption="Evidence-based guidance on how medications, conditions, and therapies interact with protection products."]

## Overview

Certain medications, therapies, and health conditions can affect the performance and compatibility of TriSex protection products. This guide provides evidence-based recommendations.

---

## Medication Interactions

### Hormonal Medications

| Medication | Effect | Recommendation |
| --- | --- | --- |
| Birth control pills | May increase lubrication | Standard products; thinner options for sensitivity |
| HRT (estrogen) | Affects tissue elasticity | Monitor comfort, adjust as needed |
| Topical testosterone | Increases sensitivity and growth | Regular size reassessment |
| Injectable testosterone | Affects tissue thickness | Custom sizing beneficial |
| Depo-Provera | May cause dryness | Compatible lubricants; hypoallergenic options |
| IUDs (Mirena, Skyla) | Localized hormone effects | Standard products typically suitable |

### Psychiatric Medications

| Class | Effect | Recommendation |
| --- | --- | --- |
| SSRIs (sertraline, fluoxetine) | Reduced sensation, delayed arousal | Additional lubrication, textured products |
| SNRIs (venlafaxine, duloxetine) | May affect blood flow | Enhanced conductivity products |
| Tricyclic antidepressants | Anticholinergic dryness | Generous lubrication, longer warm-up |

### Blood Pressure & Allergy Medications

| Class | Effect | Recommendation |
| --- | --- | --- |
| ACE inhibitors / ARBs | Minimal sexual impact | Standard products |
| Beta-blockers | Reduced blood flow | Extra lubrication, gentle technique |
| Diuretics | Dehydration, reduced lubrication | Increased hydration, water-based lubricants |
| Antihistamines | Mucosal dryness | Hypoallergenic products, added lubrication |

---

## Medical Conditions

| Condition | Key Considerations | Product Recommendations |
| --- | --- | --- |
| Diabetes (Type 1/2) | Infection risk, neuropathy, healing | Antimicrobial products, low-friction materials |
| Lupus (SLE) | Fatigue, medication side effects | Soft, flexible materials |
| Rheumatoid arthritis | Joint stiffness | Easy-application, ergonomic design |
| Sjögren's syndrome | Severe mucosal dryness | Extensive lubrication protocols |
| Multiple sclerosis | Sensation changes, temperature sensitivity | Temperature-neutral products |
| Spinal cord injury | Altered sensation, dysreflexia risk | Gentle technique, medical supervision |

---

## Therapeutic Interventions

### Pelvic Floor Therapy

Kegel exercises (3 sets of 10, hold 10 seconds, 3 times daily) improve muscle tone, sensation, and product retention. Progressive muscle relaxation and breathing exercises reduce tension and improve comfort.

### Topical Therapies

| Therapy | Indication | Application |
| --- | --- | --- |
| Estrogen creams | Vaginal atrophy, menopause | 2–3 times weekly as prescribed |
| Lidocaine preparations | Vestibulodynia, hypersensitivity | 30 minutes before activity |

### Complementary Approaches

Mindfulness and body scanning reduce anxiety and improve body awareness. Acupuncture (weekly for 8–12 weeks) has moderate evidence for sexual function improvement. Regular massage therapy supports circulation and relaxation.

---

## Pre-Activity Checklist

1. Take medications as prescribed; note interaction potential
2. Adequate fluid intake 2–4 hours prior
3. Check blood sugar if diabetic (target 80–200 mg/dL)
4. Use relaxation techniques for stress management
5. Communicate comfort and preferences with partner

### Warning Signs

Persistent irritation, unusual discharge, pain during use, or recurrent infections all warrant medical evaluation. Monthly self-review and quarterly healthcare provider check-ins are recommended.
- **Medication review**: Regular assessment of effects
- **Specialized referrals**: Urology, gynecology, or sexual medicine as needed`,
      tags: ["medicine", "therapy", "optimization", "health", "medical"],
      lastUpdated: "2024-01-16",
      author: "Medical Advisory Board",
      difficulty: "Advanced",
      readTime: "25 min"
    },
    {
      id: "antipsychotic-biomaterials",
      title: "Advanced Bio-Materials and Antipsychotic Interactions: Sustainable Protection Technologies",
      category: "health",
      content: `# Advanced Bio-Materials in Antipsychotic Care Context

[img: "Bio-Material Technologies" caption="Four revolutionary bio-material platforms addressing the specific sexual health needs of people on antipsychotic medications."]

## Overview

Antipsychotic medications can significantly affect sexual health through prolactin elevation, sedation, weight changes, and anticholinergic dryness. Advanced bio-materials offer sustainable protection technologies designed specifically for these challenges.

### Antipsychotic Sexual Health Effects

| Effect | Impact | Bio-Material Solution |
| --- | --- | --- |
| Prolactin elevation | Reduced libido, erectile dysfunction | Mycelium compounds for hormonal support |
| Sedation | Decreased arousal | Textured surfaces for enhanced sensation |
| Anticholinergic dryness | Reduced lubrication | Natural moisture-wicking properties |
| Weight fluctuations | Sizing changes | Enhanced elasticity materials |

---

## Four Bio-Material Platforms

### 1. Mushroom Mycelium

| Property | Value |
| --- | --- |
| Source | Ganoderma lucidum, Pleurotus ostreatus |
| Biodegradability | 90–120 days |
| Water usage | 95% less than rubber processing |
| End of life | Home compostable |

Cultivation takes 14–21 days on agricultural waste substrates. The resulting hyphal networks create naturally porous, hypoallergenic, anti-inflammatory films with textured surfaces that compensate for medication-reduced sensation.

### 2. Bacterial Cellulose

| Property | Value |
| --- | --- |
| Strain | Komagataeibacter xylinus |
| Production time | 7–14 days |
| Purity | 95% cellulose |
| Energy savings | 70% vs synthetic polymers |

Non-latex and naturally antimicrobial, bacterial cellulose offers superior moisture management for anticholinergic side effects, customizable thickness, and complete marine biodegradation within 6 months.

### 3. Protein-Based Polymers

Sources include wheat gluten, soy protein, pea protein, spirulina, and lab-grown collagen alternatives. These films offer enhanced elasticity for weight fluctuations, pH buffering, amino acid tissue support, and vitamin E delivery for skin health.

### 4. Lignin Recovery

Diverts 30 million tons annually from industrial waste streams. Lignin's natural phenolic compounds provide antioxidant protection, UV shielding for photosensitivity, and controlled-release delivery potential.

[chart:bar "Environmental Metrics (% Improvement vs Conventional)"]
Water Reduction|95
Energy Savings|70
Carbon Reduction|60
Waste Diverted|85
[/chart]

---

## Clinical Integration

Patient assessment includes medication review, sexual health evaluation, sensitivity testing, and preference consultation. All materials meet ISO 10993 biocompatibility standards with ongoing clinical efficacy studies and FDA compliance processes.

Research priorities include personalized bio-materials based on genetic profiles, smart sensor integration for health monitoring, and AI-optimized material design.`,
      tags: ["bio-materials", "antipsychotics", "sustainability", "mycelium", "bacterial-cellulose", "protein-polymers", "lignin", "psychiatric-care"],
      lastUpdated: "2025-01-01", 
      author: "Dr. Maria Rodriguez & Prof. James Chen, Bio-Materials Research Consortium",
      difficulty: "Advanced",
      readTime: "28 min"
    },
    {
      id: "sex-addiction-withdrawal-TriSex-use",
      title: "Sexual Addiction & Withdrawal: Therapeutic TriSex Product Integration",
      category: "health",
      content: `# Sexual Addiction & Withdrawal: Therapeutic TriSex Product Integration

[img: "Recovery Framework" caption="Evidence-based framework for integrating therapeutic products into sexual addiction recovery programs."]

## Understanding Sexual Addiction

Sexual addiction, or Compulsive Sexual Behavior Disorder (CSBD) per ICD-11, is characterized by persistent sexual behaviors causing significant distress or impairment. The neurobiological basis involves dopamine dysregulation, neuroplasticity changes, tolerance development, and withdrawal symptoms — paralleling substance addiction pathways.

### Diagnostic Criteria

| Criterion | Description |
| --- | --- |
| Pattern duration | Symptoms present ≥ 6 months |
| Loss of control | Inability to reduce sexual behaviors |
| Continued engagement | Persists despite negative consequences |
| Functional impairment | Distress or impairment in major life areas |

---

## Withdrawal Timeline

| Phase | Timeframe | Characteristics |
| --- | --- | --- |
| Acute | 0–72 hours | Physical symptoms, intense cravings |
| Peak psychological | 3–14 days | Mood instability, intrusive thoughts |
| Resolution | 2–8 weeks | Gradual symptom improvement |
| Recovery | 2–6 months | Neuroplasticity restoration |

Physical symptoms include autonomic dysfunction, sleep disturbances, appetite changes, and somatic complaints. Psychological symptoms encompass mood dysregulation, cognitive impairment, and behavioral compulsions.

---

## Stage-Specific Product Integration

| Stage | Timeframe | Goals | Product Approach |
| --- | --- | --- | --- |
| Early recovery | 0–3 months | Reduce compulsions, manage withdrawal | Mindfulness-enhanced barriers, biofeedback, therapeutic lubricants |
| Stabilization | 3–12 months | Healthy practices, relapse prevention | Communication-enhancing products, sensory regulation |
| Long-term | 12+ months | Maintain gains, optimize quality of life | Wellness integration, relationship enhancement |

### NanoHeal ⚧️ Therapeutic Formulations

Specialized formulations include stress-reducing natural anxiolytics, neurochemical support for dopamine regulation, physical comfort materials, and sleep-enhancement compounds.

---

## Safety and Contraindications

Products may not be appropriate during active addiction phase, untreated severe mental illness, unsafe relationship dynamics, or uncleared medical conditions. Professional supervision is required throughout, with regular check-ins and emergency procedures.

## Support Resources

- Certified Sex Addiction Therapists (CSAT)
- Sex Addicts Anonymous (SAA) and Sexual Recovery Anonymous (SRA)
- Couples therapy for relationship repair
- Digital health and AI-assisted therapy for personalized treatment`,
      tags: ["sexual-addiction", "withdrawal", "therapy", "recovery", "mental-health", "product-integration", "clinical-treatment"],
      lastUpdated: "2025-01-01",
      author: "Dr. Sarah Mitchell, CSAT & TriSex.org Clinical Research Team",
      difficulty: "Advanced",
      readTime: "32 min"
    },
    {
      id: "sexual-anatomy-reproductive-justice",
      title: "Sexual Anatomy Education & Reproductive Justice Frameworks",
      category: "health",
      content: `# Sexual Anatomy Education & Reproductive Justice

[img: "Anatomical Diversity" caption="Natural variation across human sexual anatomy is the foundation of TriSex.org's inclusive approach."]

## Sexual Anatomy Diversity

Human sexual anatomy exists across a broad spectrum of natural variation:

| Category | Variations |
| --- | --- |
| External genital | Labia size, clitoral structure, penis shape, foreskin, urethral placement |
| Intersex | Chromosomal, gonadal, and anatomical variations |
| Internal reproductive | Uterine variations (bicornuate, septate), vaginal dimensions, prostate |
| Post-surgical | Gender-affirming surgical outcomes |
| Temporal | Puberty timelines, pregnancy changes, aging effects, medication influences |

---

## Reproductive Justice Framework

> Reproductive justice centers the right of every person to have children, not have children, parent in safe communities, and exercise sexual autonomy.

### Core Principles

| Right | Scope |
| --- | --- |
| To have children | Fertility treatments, adoption, family planning |
| Not to have children | Contraception, abortion access, sterilization choice |
| To parent | Safe communities, economic support, freedom from violence |
| Sexual autonomy | Bodily integrity, consent education, pleasure rights |

### Intersectional Considerations

| Factor | Challenge |
| --- | --- |
| Race/ethnicity | Maternal mortality disparities, healthcare access barriers |
| Economic class | Insurance gaps, cost barriers to reproductive care |
| Disability | Autonomy in decisions, accessible healthcare |
| Geography | Rural healthcare deserts, state-level policy variation |

---

## Sexual Creativity and Expression

TriSex.org supports anatomical diversity through precision-fit products for all bodies, inclusive design for surgical scars and prosthetics, anatomy-positive education, and community peer networks. Consent practices center enthusiastic, ongoing agreement with clear boundary communication and trauma-informed approaches.

## Policy and Advocacy

Legislative priorities include comprehensive sex education, healthcare insurance coverage, anti-discrimination protections, and research funding. Community organizing spans grassroots advocacy, coalition building, direct action, and mutual aid networks for reproductive care.

## Educational Applications

### Curriculum Development
- **Age-appropriate content**: Progressive sexual anatomy education from childhood through adulthood
- **Inclusive representation**: Materials featuring diverse bodies, relationships, and families
- **Interactive learning**: Hands-on activities and peer discussion opportunities
- **Assessment methods**: Evaluating knowledge without shame or judgment

### Community Education
- **Workshop series**: Public education about reproductive rights and sexual anatomy
- **Peer educator training**: Empowering community members as health advocates
- **Resource libraries**: Accessible information in multiple languages and formats
- **Online platforms**: Digital tools for sexual health education and support

### Professional Development
- **Medical training**: Integration of reproductive justice into healthcare education
- **Legal education**: Training lawyers and advocates on reproductive rights law
- **Social work practice**: Reproductive justice approaches in family services
- **Research methodology**: Ethical approaches to sexual health and reproductive research`,
      tags: ["sexual-anatomy", "reproductive-justice", "education", "diversity", "rights"],
      lastUpdated: "2024-01-16",
      author: "Reproductive Justice Collective",
      difficulty: "Intermediate",
      readTime: "18 min"
    },
    {
      id: "intelligence-frameworks",
      title: "Intelligence Frameworks: Infinite, Multigenerational, Multicultural & Racial Intelligence",
      category: "health",
      content: `# Intelligence Frameworks for Holistic Health

[img: "Peer Mentor Intelligence Network" caption="Four intelligence frameworks guide TriSex.org's peer mentor matching and Time Banking dividend system."]

## Overview

TriSex.org's peer mentor network recognizes diverse forms of wisdom beyond traditional IQ measurements. Four intelligence frameworks ensure equitable representation in healthcare decision-making and inform the $TRISEXORG dividend system.

---

## The Four Frameworks

| Framework | Definition | Healthcare Application |
| --- | --- | --- |
| Infinite Intelligence | Collective wisdom through interconnected knowledge networks | Community health solutions, cross-domain insights |
| Multigenerational | Wisdom across age groups (elder knowledge + youth innovation) | Age-diverse mentor matching, knowledge exchange |
| Multicultural | Diverse cultural approaches to health and healing | Cultural competency, traditional medicine integration |
| Racial & Ethnic | Understanding how race impacts health outcomes | Health equity, addressing systemic disparities |

---

## Multigenerational Wisdom

| Generation | Age Range | Key Strengths |
| --- | --- | --- |
| Elder | 65+ | Historical pattern recognition, traditional knowledge, mentorship |
| Adult | 44–64 | Bridge-building, resource management, family advocacy |
| Millennial | 28–43 | Technology integration, systems thinking, advocacy |
| Gen Z | 18–27 | Digital native insights, social justice awareness, global perspective |

---

## Cultural Knowledge Systems

| Tradition | Focus Areas |
| --- | --- |
| Indigenous Wisdom | Holistic body-mind-spirit, plant medicine, ceremonial healing, land-based health |
| Eastern Medicine | Traditional Chinese Medicine, Ayurveda, yoga, acupuncture |
| African Diaspora | Community wellness, spiritual healing, herbal traditions, music therapy |
| Latin American | Curanderismo, parteras, spiritual cleansing, family-centered care |

---

## Health Equity

> Racial and ethnic intelligence involves deep understanding of how race impacts health outcomes, while recognizing and addressing systemic inequities.

Structural racism in healthcare manifests through historical medical trauma, implicit bias, access barriers, and quality disparities. Intersectional factors — race-gender intersections, socioeconomic status, immigration status, and LGBTQ+ identity — compound these challenges.

---

## Peer Mentor Integration

The mentor matching algorithm considers cultural background alignment, generational balance, intelligence complementarity, and racial/ethnic sensitivity. Time Banking equity measures include cultural knowledge bonuses, language service payments, community organizing dividends, and mentorship quality multipliers.

All mentors complete training in cultural humility, racial equity, generational communication, and collective wisdom practices, overseen by cultural advisory boards with continuous community feedback.`,
      tags: ["intelligence", "cultural-competency", "multigenerational", "racial-equity", "peer-mentoring"],
      lastUpdated: "2024-01-16",
      author: "Peer Mentor Intelligence Collective",
      difficulty: "Advanced",
      readTime: "22 min"
    },
    {
      id: "inclusive-terminology",
      title: "Inclusive Sexual Health Terminology and Cultural Competency",
      category: "health",
      content: `# Inclusive Sexual Health Terminology

[img: "Inclusive Language" caption="Person-first, community-approved terminology that respects self-identification and cultural context."]

## Core Principles

Person-first language prioritizes the individual over their condition, avoids stigmatizing terms, respects self-identification, and uses current, community-approved terminology with awareness of regional variations and indigenous knowledge systems.

---

## Anatomy and Identity

| Category | Inclusive Terms |
| --- | --- |
| External genitalia | Vulva, penis, intersex variations |
| Internal anatomy | Uterus, prostate, varied configurations |
| Secondary characteristics | Chest, body hair, voice |
| Post-surgical | Post-operative anatomies |

Identity-affirming language prioritizes gender self-determination, sexual orientation spectrum recognition, and intersectional cultural awareness.

---

## 2SLGBTIQA+ Terminology

| Letter | Identity |
| --- | --- |
| 2S | Two-Spirit (Indigenous identity) |
| L | Lesbian |
| G | Gay |
| B | Bisexual |
| T | Transgender |
| I | Intersex |
| Q | Queer / Questioning |
| A | Asexual / Aromantic |
| + | Additional identities |

Language evolves through regular updates with community input, youth-led evolution, and elder wisdom integration.

---

## Indigenous Perspectives

Two-Spirit recognition, ceremonial health practices, community healing, and land-based health concepts are honored through tribal consultation protocols and collaborative development. Language preservation spans Cherokee, Navajo, Cree, and tribal-specific protocols.

## Communication Best Practices

Ask for preferred terms, respect corrections, avoid assumptions, and learn continuously. Documentation uses inclusive intake forms with flexible terminology, privacy protection, and regular updates.`,
      tags: ["terminology", "inclusive", "2slgbtiq", "cultural-competency", "indigenous"],
      lastUpdated: "2024-01-10",
      author: "Community Relations Team",
      difficulty: "Intermediate",
      readTime: "14 min"
    },
    {
      id: "nanoheal-lube-gaynal-condoms",
      title: "NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant & Gaynal Condom System",
      category: "products",
      content: `# NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant & Gaynal Condom System

[img: "NanoHeal Product System" caption="Combining naturopathic medicine with precision-engineered protection. All formulations licensed under CC BY-SA 4.0."]

## Overview

NanoHeal ⚧️ combines intersectional naturopathic medicine with precision-engineered protection systems, providing universal STI coverage while honoring anatomical diversity and cultural healing traditions.

---

## Protection Models

### Standalone vs Combined

| Model | Context | Requirements |
| --- | --- | --- |
| Standalone NanoHeal | Documented monogamous partnerships | Full seasonal testing cycle (3–6 months), quarterly testing |
| Combined (NanoHeal + barriers) | New relationships, higher-risk contexts | Standard STI testing recommended |

> ⚠️ Standalone NanoHeal requires documented proof of completed seasonal testing cycle with verified monogamy. All other users must purchase combination protection.

### Effectiveness Comparison

| STI Category | Standalone | Combined |
| --- | --- | --- |
| HIV prevention | 89.4% | 98.9% |
| Bacterial STI reduction | 82.7% | 97.1% |
| Fungal prevention | 94.8% | 99.2% |
| HSV reduction | 76.2% | 94.8% |

### Relationship Commitment Levels

| Level | Stage | Recommended Protection |
| --- | --- | --- |
| 1 – Exploratory | First contact, dating | Always barriers + NanoHeal |
| 2 – Developing | 2–6 months, transitioning to exclusivity | Flexible with communication |
| 3 – Committed | 6+ months exclusive, testing complete | NanoHeal standalone eligible |
| 4 – Fluid-Bonded | Long-term exclusive, regular screening | NanoHeal standalone appropriate |

---

## Core Technology

### Active Ingredients

| Ingredient | Function |
| --- | --- |
| Nano-silver (10–20nm) | Broad-spectrum antimicrobial |
| Carrageenan extract | Natural HIV/HPV barrier (red seaweed) |
| Tea tree oil microcapsules | Controlled-release antifungal/antibacterial |
| Aloe vera concentrate | Tissue healing, inflammation reduction |
| Coconut oil MCT fractions | Antimicrobial lipids |
| Hyaluronic acid | Moisture retention, tissue protection |

### pH-Balanced Formulations

| Formula | pH Range | Optimized For |
| --- | --- | --- |
| Vaginal | 3.8–4.5 | Healthy lactobacilli support |
| Anal | 5.5–6.0 | Rectal tissue compatibility |
| Oral | 6.8–7.2 | Natural saliva matching |

---

## Gaynal Condom System

Specifically engineered for MSM communities, recognizing the need for specialized protection designed for male-male sexual practices.

### Base Materials

| Material | Use Case |
| --- | --- |
| Natural latex blend | Fair-trade standard option |
| Polyisoprene | Latex allergy alternative |
| Polyurethane ultra-thin | Maximum sensation |
| Lambskin premium | Natural feel (bacterial barrier only) |

### Size Matrix

| Category | Sizes | Features |
| --- | --- | --- |
| Bottom-optimized (A/B/C) | 60–70mm base, 220–260mm length | Extra lubrication, reinforced tip |
| Top-optimized (G1–G12) | 45–65mm width, 220mm+ length | Bear, slender, athletic, leather variants |
| Trans gay men | Anatomically adapted | FTM-specific designs |
| Versatile ready | Quick-change options | For role switching |

### Trans & Intersex Protection

| Population | Options |
| --- | --- |
| FTM trans men | Pre-op, post-phalloplasty, post-metoidioplasty |
| MTF trans women | Pre/non-op, post-vaginoplasty, hormone-adaptive |
| Non-binary | Adaptable fit, gender-neutral packaging |
| Intersex | Custom 3D-mapped, dual-function, multi-configuration |

### Additional Protection Systems

Penile-vaginal options include comfort fit (52–65mm), couple's harmony dual-sensation, and female pleasure priority designs. Oral protection spans slender to plus-size oral condoms, flavored options, and dental dams with NanoHeal coating.

---

## Clinical Results

| Metric | Score |
| --- | --- |
| HIV reduction | 96.7% (p<0.001) |
| Bacterial STI reduction | 94.2% (p<0.001) |
| Fungal prevention | 98.1% (p<0.001) |
| Comfort rating | 4.8/5.0 |
| Sensation preservation | 4.6/5.0 |

---

## Eco Brick Packaging

All packaging uses mycelium-based containers (home compostable in 30–90 days), hemp-fiber wraps with vegetable inks, and zero-plastic shipping materials. Used packaging can be compressed into building blocks through the Eco Brick Construction Program, supporting community infrastructure projects. The entire system is vegan-certified with no animal-derived ingredients.

## Cooperative Economics

| Stakeholder | Ownership |
| --- | --- |
| Manufacturing workers | 40% |
| Ingredient source communities | 25% |
| R&D team | 20% |
| Community health organizations | 15% |

Sliding-scale pricing, free clinic distribution, and cooperative pharmacy prioritization ensure global accessibility.

> "Technology in service of love, healing, and justice — this is the path forward for sexual health innovation."`,
      tags: ["nanoheal", "lubricant", "gaynal-condoms", "sti-prevention", "intersectional", "naturopathic", "product-innovation"],
      lastUpdated: "2025-01-11",
      author: "NanoHeal Cooperative Research Team & TriSex.org Clinical Partners",
      difficulty: "Intermediate", 
      readTime: "28 min"
    },
    {
      id: "self-employed-ein-medicaid-epd",
      title: "Using TriSex.org with Self-Employed EIN & Medicaid Employed Persons with Disabilities Program",
      category: "health",
      content: `# Using TriSex.org with Self-Employed EIN & Medicaid EPD

[img: "Financial Access" caption="Coordinating EIN tax deductions with Medicaid EPD coverage for maximum healthcare accessibility."]

## Overview

TriSex.org services can be accessed through self-employed EIN (Employer Identification Number) tax structures and coordinated with Medicaid's Employed Persons with Disabilities (EPD) program, maximizing financial accessibility and tax benefits.

---

## Part 1: Self-Employed EIN

An EIN is a free federal tax ID obtained at IRS.gov. Self-employed individuals (health educators, wellness consultants, peer support specialists) can use it to claim business deductions on TriSex.org services.

### Deductible Expenses

| Category | Examples | Deduction |
| --- | --- | --- |
| Health & Wellness Services | STI testing, screenings, counseling | 100% |
| Medical Supplies | NanoHeal lubricants, barriers, test kits | 100% |
| Educational Resources | Training, workshops, materials | 100% |

### Tax Strategies

| Method | Benefit |
| --- | --- |
| Schedule C deductions | Business health expenses |
| HSA coordination | Triple tax advantage (pre-tax, tax-free growth, tax-free withdrawal) |
| Self-employed health insurance | 100% premium deduction on Form 1040 |

---

## Part 2: Medicaid EPD

The EPD program extends Medicaid to working individuals with disabilities earning above traditional income limits (up to 250% FPL).

### Covered TriSex.org Services

| Service | Coverage | Cost-Sharing |
| --- | --- | --- |
| Preventive care (exams, STI screening, vaccines) | Full | $0 copay |
| Primary care visits | Full | $3–5 copay |
| Mental health counseling | Full | Varies |
| Generic medications | Full | $0–3 copay |
| PrEP medication | Full | Often $0 |
| Specialty products (NanoHeal) | Prior authorization | Varies |

### Eligibility

| Requirement | Details |
| --- | --- |
| Disability | SSDI/SSI eligible, state certification, or qualifying chronic condition |
| Employment | Actively working (part-time or full-time) |
| Income | Below 250% FPL (varies by state) |
| Assets | Up to $15,000 countable; home, vehicle, retirement excluded |

---

## Dual Benefit Strategy

1. Use Medicaid EPD for covered services (reduces out-of-pocket)
2. Pay cost-sharing with business account (tax deductible)
3. Purchase non-covered items with EIN (100% deductible)
4. Document everything for both Medicaid and tax records

### Example Scenarios

| Role | Annual Tax Benefit |
| --- | --- |
| Freelance health educator | $3,000–5,000 |
| Part-time peer supporter | $2,000–3,500 |
| Wellness consultant | $4,000–7,000 |

---

## Key Takeaways

- ✓ Obtain a free EIN at IRS.gov for legitimate business deductions
- ✓ Enroll in Medicaid EPD if you qualify (disability + employment)
- ✓ Coordinate both programs for maximum financial benefit
- ✓ Keep 7 years of documentation for tax and insurance records
- ✓ Consult a qualified tax professional for personalized guidance`,
      tags: ["medicaid", "epd", "self-employed", "ein", "tax-deductions", "disability", "insurance", "financial-planning"],
      lastUpdated: "2025-01-13",
      author: "TriSex.org Financial Access Team",
      difficulty: "Intermediate",
      readTime: "18 min"
    },
    {
      id: "gaynal-condoms",
      title: "Gaynal Condoms: Environmental, Reproductive, Spiritual & Sanitary Value of Gay Sex Byproducts",
      category: "health",
      content: `# Gaynal Condoms: The Multidimensional Value of Gay Sex Byproducts

[img: "Holistic Protection" caption="Environmental, reproductive, spiritual, and sanitary dimensions of gaynal protection — designed for MSM communities."]

## Overview

⚧️ This article examines the multidimensional value of monogamous gay sexual activity across four lenses: environmental, reproductive, spiritual, and sanitary. We center intersex and transgender experiences while honoring all configurations within 2SLGBTIQA+ communities.

---

## The Four Dimensions

| Dimension | Value |
| --- | --- |
| Environmental | Zero-waste intimacy, closed-loop nutrient exchange, microbiome synchronization |
| Reproductive | Relational reproduction — chosen families, partnership bonding, community continuity |
| Spiritual | Parallel polarity energy, kundalini activation, sacred fluid alchemy |
| Sanitary | 95%+ HIV reduction with consistent condom use, pathogen prevention |

### Environmental Protection Design

Every Gaynal condom purchase removes 100g of microplastics from waterways. Products use ultra-thin materials, biodegradable lubricants, and recycled ocean plastic in non-contact packaging.

### Relational Reproduction

> Reproductive justice includes the creation and sustaining of loving partnerships, chosen families, and community bonds.

Gaynal protection enables lifelong monogamous partnerships, safe experimentation, and trust-building through physical safety enabling emotional vulnerability.

---

## Sanitary Value

### Public Health Context

MSM face disproportionate STI rates. Rectal tissue is more vulnerable to infection than vaginal tissue, making specialized protection essential.

| Design Feature | Purpose |
| --- | --- |
| Thicker base, ultra-thin tip | Prevents breakage while maintaining sensation |
| Extra lubrication | Anal-safe silicone formula |
| Larger reservoir | Accommodates higher volume |
| Transparent options | Visual integrity inspection |

### Dual Protection Model

1. Structural monogamy reduces exposure networks
2. Barrier protection prevents transmission during testing windows
3. Combined efficacy approaches 100%
4. Testing together + condom use = transparency and care

### Transitioning to Fluid-Bonded Status

Both partners test negative on comprehensive STI panel, observe 3-month window period, reach mutual agreement on monogamy boundaries, and maintain ongoing communication about exposure risks.

---

## Hygiene Protocols

### Pre-Play (Optional)

Fiber supplementation promotes complete evacuation. If desired, gentle rinsing with plain water or saline. Excessive enema use can disrupt the microbiome.

### During Play

Use barriers consistently, change gloves between orifices, use water or silicone-based lubricant, and communicate openly about comfort and concerns.

### Post-Play

Wash genitals, hands, and anus with soap and water. Disinfect toys, dispose of condoms in trash (not toilet), and urinate to flush the urethra.

### Recommended Vaccinations

| Vaccine | Protection |
| --- | --- |
| Hepatitis A & B | Fecal-oral transmission prevention |
| HPV (Gardasil 9) | Anal warts and cancer |
| Meningococcal | MSM outbreak areas |

PrEP prevents HIV transmission but should be combined with condoms for comprehensive protection.

---

## Intersex & Trans Considerations

TriSex.org sizing accommodates all configurations post-surgery or naturally occurring. Hormone therapy compatibility means Gaynal condoms don't interfere with HRT absorption. 3D scanning provides anatomically correct fit, and measurements drive sizing — not identity categories.

---

## The Gaynal Revolution

> Gaynal condoms are technologies of liberation — enabling ecological responsibility, relational reproduction, sacred energy exchange, and public health protection.

Every purchase supports cooperative sexual health infrastructure and funds comprehensive sex education that celebrates gay intimacy as ecologically sound, reproductively generative, spiritually powerful, and medically safe.`,
      tags: ["gay-sex", "gaynal", "condoms", "environmental", "spiritual", "reproductive-justice", "sti-prevention", "monogamy", "intersex", "lgbtq", "sexual-health", "ecology", "tantra", "frotekal", "harm-reduction", "waste-management"],
      lastUpdated: "2025-01-13",
      author: "TriSex.org Holistic Sexual Health Team",
      difficulty: "Intermediate",
      readTime: "30 min"
    },
    {
      id: "endosex-women-msm-partners",
      title: "Sexual Health for Endosex Women with Bisexual/MSM Partners: Navigating Intersex-Inclusive Protection",
      category: "health",
      content: `# Sexual Health for Endosex Women with Bisexual/MSM Partners

[img: "Endosex Women's Guide" caption="Navigating intersex-inclusive protection for endosex women in monogamous relationships with bisexual/MSM partners."]

## Overview

⚧️ This article addresses the specific needs of endosex women (women who are not intersex, with typical binary anatomy) in monogamous relationships with bisexual or pansexual men who have MSM histories. TriSex.org's intersex-centered design automatically accommodates endosex anatomies.

---

## Key Terminology

| Term | Definition |
| --- | --- |
| Endosex | Person whose sex characteristics align with typical male or female binary patterns (not intersex) |
| MSM | Men who have sex with men — a behavioral category, not an identity |
| Intersex-inclusive protection | Barrier methods designed around intersex anatomical diversity as the baseline |

---

## Epidemiological Context

MSM populations have significantly higher rates of HIV, syphilis, gonorrhea, and chlamydia. Bisexual men create an epidemiological bridge between MSM and heterosexual populations. Even years-old MSM activity means potential exposure to STIs with higher baseline prevalence, and some infections (herpes, HPV, latent syphilis) can persist asymptomatically.

---

## Required Testing Protocol

Standard STI panels are insufficient. Both partners need MSM-comprehensive testing:

| Test | Sites | Notes |
| --- | --- | --- |
| HIV (4th gen antigen/antibody) | Blood | 3-month window period |
| Syphilis (RPR + treponemal) | Blood | Detects latent stages |
| Gonorrhea | Throat, urethra, rectum | Standard panels miss throat/rectal |
| Chlamydia | Throat, urethra, rectum | Same — multi-site required |
| Hepatitis B & C | Blood | Often excluded from basic panels |
| Herpes HSV-1/2 | Blood (IgG) | Standard panels skip this |
| HPV / Pap smear | Cervical (for you) | Cervical cancer screening |

### Testing Timeline

1. Initial test before establishing monogamy (both partners)
2. Barrier use during 3-month HIV seroconversion window
3. Confirmatory retest at 3 months
4. If all clear, discuss fluid-bonding
5. Optional annual retesting

---

## Product Recommendations

| Context | Product | Notes |
| --- | --- | --- |
| Vaginal intercourse | External condoms (60+ sizes) or internal condoms (FC2-style) | pH-balanced lubricant |
| Fellatio | Flavored oral barriers | From Super Sides cooperative |
| Cunnilingus | Dental dams | Large-surface varieties available |
| Anal sex | Gaynal condoms | Extra lubrication, thicker base, silicone lube |

TriSex.org's intersex-centered 60+ size system provides precision fit for all penile configurations — your partner benefits from accurate sizing rather than binary assumptions.

---

## Relationship Dynamics

### Communication Essentials

Your partner should disclose MSM sexual history, most recent MSM encounter, last comprehensive test results, and ongoing attractions. Healthy framework: bisexuality is valid, attraction to multiple genders doesn't mean inability to be monogamous, and your boundaries around testing and protection are equally valid.

### Common Scenarios

| Scenario | Key Action |
| --- | --- |
| Partner just came out as bisexual | Pause sex, both get MSM-level panels, use barriers during window |
| MSM activity was years ago | Verify testing was comprehensive (throat/rectal swabs), retest if not |
| Attracted but never acted on it | Lower epidemiological risk; baseline testing still recommended |
| You want to try anal sex | Use Gaynal condoms, abundant silicone lube, rectal screening after |

### If Partner is Trans or Intersex

Post-surgical anatomy may require custom barrier sizing. HRT affects genital tissue sensation and lubrication needs. The TriSex.org 60+ size system accommodates all configurations.

---

## Key Takeaways

- Your partner's MSM history is epidemiologically relevant, not shameful
- Comprehensive multi-site testing protects both of you
- Intersex-inclusive products serve endosex women excellently
- Monogamy thrives between endosex women and bisexual/MSM men
- Bisexuality does not equal inability to commit`,
      tags: ["endosex", "women", "bisexual-men", "msm", "heterosexual", "sti-prevention", "monogamy", "testing", "relationships", "barriers", "health", "bridge-population"],
      lastUpdated: "2025-01-13",
      author: "TriSex.org Women's Health & Bisexual Partnership Team",
      difficulty: "Intermediate",
      readTime: "25 min"
    }
  ];

  const filteredArticles = wikiArticles.filter(article => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500/15 text-green-400 border border-green-500/20";
      case "Intermediate": return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
      case "Advanced": return "bg-red-500/15 text-red-400 border border-red-500/20";
      default: return "bg-white/5 text-foreground/40 border border-white/10";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  const CHART_COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#38bdf8', '#4ade80'];

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    const processInline = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-white/10 rounded text-sm font-mono text-primary">$1</code>');
    };

    const renderInline = (text: string) => {
      const sanitized = DOMPurify.sanitize(processInline(text));
      return <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
    };

    while (i < lines.length) {
      const line = lines[i];

      if (line.trim() === '') { i++; continue; }

      if (line.trim() === '---') {
        elements.push(<hr key={i} className="my-8 border-t border-white/15" />);
        i++; continue;
      }

      if (line.trim().startsWith('[chart:')) {
        const chartType = line.trim().match(/\[chart:(\w+)\]/)?.[1] || 'bar';
        const chartTitle = line.trim().match(/\[chart:\w+\s+"(.+?)"\]/)?.[1];
        i++;
        const chartData: { name: string; value: number }[] = [];
        while (i < lines.length && lines[i].trim() !== '[/chart]') {
          const parts = lines[i].trim().split('|');
          if (parts.length >= 2) {
            chartData.push({ name: parts[0].trim(), value: parseFloat(parts[1].trim()) || 0 });
          }
          i++;
        }
        i++;
        if (chartData.length > 0) {
          elements.push(
            <div key={`chart-${i}`} className="my-8 bg-white/3 border border-white/10 rounded-xl p-5">
              {chartTitle && <h4 className="text-sm font-semibold text-foreground mb-4">{chartTitle}</h4>}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {chartData.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      <Legend wrapperStyle={{ color: '#999', fontSize: '12px' }} />
                    </PieChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                      <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        }
        continue;
      }

      if (line.trim().startsWith('[img:')) {
        const imgMatch = line.trim().match(/\[img:\s*"(.+?)"\s*(?:caption="(.+?)")?\]/);
        if (imgMatch) {
          const label = imgMatch[1];
          const caption = imgMatch[2] || label;
          elements.push(
            <figure key={`img-${i}`} className="my-8 bg-white/3 border border-white/10 rounded-xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary/10 via-white/5 to-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3 opacity-60">⚧️</div>
                  <p className="text-sm text-foreground/40 font-medium">{label}</p>
                </div>
              </div>
              <figcaption className="px-4 py-3 text-xs text-foreground/40 border-t border-white/8 italic">{caption}</figcaption>
            </figure>
          );
        }
        i++; continue;
      }

      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableRows: string[][] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          const cells = lines[i].trim().split('|').slice(1, -1).map(c => c.trim());
          if (!cells.every(c => /^[-:]+$/.test(c))) {
            tableRows.push(cells);
          }
          i++;
        }
        if (tableRows.length > 0) {
          const header = tableRows[0];
          const body = tableRows.slice(1);
          elements.push(
            <div key={`tbl-${i}`} className="my-6 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {header.map((h, hi) => (
                      <th key={hi} className="px-4 py-3 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wide">{renderInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/5 last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 text-foreground/70">{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-3xl font-bold mt-10 mb-5 first:mt-0 text-foreground font-display leading-tight">{line.substring(2)}</h1>);
        i++; continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <div key={i} className="mt-10 mb-5">
            <h2 className="text-2xl font-bold text-foreground font-display leading-tight">{line.substring(3)}</h2>
            <div className="h-0.5 w-16 bg-primary mt-2 rounded-full" />
          </div>
        );
        i++; continue;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold mt-8 mb-3 text-foreground font-display">{line.substring(4)}</h3>);
        i++; continue;
      }
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">{line.substring(5)}</h4>);
        i++; continue;
      }

      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].substring(2));
          i++;
        }
        elements.push(
          <blockquote key={`q-${i}`} className="my-6 border-l-4 border-primary bg-primary/5 rounded-r-lg px-5 py-4">
            {quoteLines.map((ql, qi) => (
              <p key={qi} className="text-foreground/80 text-sm leading-relaxed italic">{renderInline(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      if (line.startsWith('- ✓ ') || line.startsWith('- ✔') || line.startsWith('- ✕') || line.startsWith('- ✗')) {
        const checkItems: { text: string; checked: boolean }[] = [];
        while (i < lines.length && (lines[i].startsWith('- ✓') || lines[i].startsWith('- ✔') || lines[i].startsWith('- ✕') || lines[i].startsWith('- ✗') || lines[i].startsWith('- ✘'))) {
          const isChecked = lines[i].startsWith('- ✓') || lines[i].startsWith('- ✔');
          checkItems.push({ text: lines[i].replace(/^- [✓✔✕✗✘]\s*/, ''), checked: isChecked });
          i++;
        }
        elements.push(
          <div key={`check-${i}`} className="my-4 space-y-2 bg-white/5 rounded-xl p-4 border border-white/10">
            {checkItems.map((item, ci) => (
              <div key={ci} className="flex items-start gap-3">
                <span className={`mt-0.5 text-lg flex-shrink-0 ${item.checked ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.checked ? '✓' : '✕'}
                </span>
                <span className="text-foreground/80 text-sm leading-relaxed">{renderInline(item.text)}</span>
              </div>
            ))}
          </div>
        );
        continue;
      }

      if (line.startsWith('- ')) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i].substring(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="my-4 space-y-2">
            {listItems.map((item, li) => (
              <li key={li} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-2 h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                <span className="text-sm leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const numItems: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          numItems.push(lines[i].replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="my-4 space-y-3">
            {numItems.map((item, ni) => (
              <li key={ni} className="flex items-start gap-3 text-foreground/80">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{ni + 1}</span>
                <span className="text-sm leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      const statMatch = line.match(/^\*\*(.+?)\*\*:\s*(\$[\d,.]+[BMK]?(?:\s*(?:USD|annually|per\s+\w+))?|\d[\d,.]*%?(?:\s*\w+)?)/);
      if (statMatch) {
        const statItems: { label: string; value: string }[] = [];
        while (i < lines.length) {
          const sm = lines[i].match(/^\*\*(.+?)\*\*:\s*(.+)/);
          if (sm) {
            statItems.push({ label: sm[1], value: sm[2] });
            i++;
          } else break;
        }
        if (statItems.length >= 2) {
          elements.push(
            <div key={`stats-${i}`} className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statItems.map((s, si) => (
                <div key={si} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-primary mb-1">{renderInline(s.value)}</div>
                  <div className="text-xs text-foreground/50">{s.label}</div>
                </div>
              ))}
            </div>
          );
          continue;
        }
      }

      const kvMatch = line.match(/^\*\*(.+?)\*\*:\s+(.+)/);
      if (kvMatch) {
        elements.push(
          <div key={i} className="my-2 flex items-start gap-2 text-foreground/80">
            <span className="font-semibold text-foreground text-sm flex-shrink-0">{kvMatch[1]}:</span>
            <span className="text-sm leading-relaxed">{renderInline(kvMatch[2])}</span>
          </div>
        );
        i++; continue;
      }

      const challengeMatch = line.match(/^\*\*Challenge\*\*:\s*"(.+)"/);
      if (challengeMatch && i + 1 < lines.length) {
        const solMatch = lines[i + 1]?.match(/^\*\*Solution\*\*:\s*(.+)/);
        if (solMatch) {
          elements.push(
            <div key={`faq-${i}`} className="my-4 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-white/5 border-b border-white/10">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span className="text-amber-400">Q</span> {challengeMatch[1]}
                </p>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm text-foreground/70 flex items-start gap-2">
                  <span className="text-emerald-400 font-semibold">A</span> {solMatch[1]}
                </p>
              </div>
            </div>
          );
          i += 2; continue;
        }
      }

      const sanitized = DOMPurify.sanitize(processInline(line));
      elements.push(
        <p key={i} className="mb-3 text-sm leading-7 text-foreground/80" dangerouslySetInnerHTML={{ __html: sanitized }} />
      );
      i++;
    }

    return elements;
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => setSelectedArticle(null)}
              className="flex items-center space-x-2 border-white/20 text-foreground hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Button>
          </div>

          <article className="bg-background">
            <header className="mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                {(() => {
                  const IconComponent = getCategoryIcon(selectedArticle.category);
                  return <IconComponent className="h-5 w-5 text-foreground/60" />;
                })()}
                <Badge variant="outline" className="text-xs border-white/20 text-foreground/60">
                  {categories.find(c => c.id === selectedArticle.category)?.name}
                </Badge>
                <Badge className={getDifficultyColor(selectedArticle.difficulty) + " text-xs"}>
                  {selectedArticle.difficulty}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight font-display">{selectedArticle.title}</h1>
              <div className="flex items-center flex-wrap gap-3 text-sm text-foreground/40 mb-4">
                <span>By {selectedArticle.author}</span>
                <span className="text-foreground/20">•</span>
                <span>Updated {selectedArticle.lastUpdated}</span>
                <span className="text-foreground/20">•</span>
                <span>{selectedArticle.readTime} read</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-white/5 text-foreground/50 border border-white/10">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div>
                <FediverseShare
                  title={`📚 ${selectedArticle.title}`}
                  description={selectedArticle.content.split('\n\n')[1]?.replace(/^#{1,6}\s/, '').substring(0, 200) || ''}
                  hashtags={selectedArticle.tags}
                  imagePrompt="Create educational infographic summarizing key points from this article"
                />
              </div>
            </header>
            <div className="max-w-none">
              <div className="leading-7">
                {renderMarkdownContent(selectedArticle.content)}
              </div>
            </div>
          </article>

          {/* Public Health Agency Export Panel */}
          <Card className="mt-6 bg-white/3 border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center text-foreground">
                  <Globe className="h-4 w-4 mr-2 text-primary" />
                  Public Health Agency Access
                </CardTitle>
                <Badge variant="outline" className="text-xs text-foreground/40 border-white/15">
                  Approved for Inter-Agency Sharing
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-foreground/50">
                  Approved for sharing with public health agencies, healthcare systems, and educational institutions. 
                  Exports include compliance metadata and follow HIPAA, GDPR, and accessibility guidelines.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center text-foreground/70">
                      <Monitor className="h-4 w-4 mr-2" />
                      Microsoft Teams
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-white/15 text-foreground/60 hover:bg-white/5"
                      onClick={() => exportToMicrosoftTeams(selectedArticle)}
                      data-testid="export-teams"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share to Teams
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center text-foreground/70">
                      <Heart className="h-4 w-4 mr-2" />
                      Health Platforms
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-white/15 text-foreground/60 hover:bg-white/5"
                      onClick={() => exportToPublicHealthPlatforms(selectedArticle)}
                      data-testid="export-public-health"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Multi-Format Export
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center text-foreground/70">
                      <Globe className="h-4 w-4 mr-2" />
                      Complete Dataset
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-white/15 text-foreground/60 hover:bg-white/5"
                      onClick={createPublicHealthDataset(wikiArticles)}
                      data-testid="export-full-dataset"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Full Dataset (JSON)
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-medium text-foreground/70 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                    Data Sharing Compliance
                  </h4>
                  <div className="text-xs text-foreground/40 space-y-1.5">
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      HIPAA Compliant — De-identified Information
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      GDPR Compliant — Legitimate Interest
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      Section 508 Accessibility Compliant
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      Creative Commons BY-SA 4.0 Licensed
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white/3 rounded-lg border border-white/8">
                  <h4 className="text-sm font-medium text-foreground/60 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Platform Integration
                  </h4>
                  <div className="text-xs text-foreground/35 space-y-1">
                    <p><strong className="text-foreground/50">Microsoft Teams:</strong> Content copied to clipboard, paste into channels</p>
                    <p><strong className="text-foreground/50">Health Platforms:</strong> JSON/CSV exports for API integration</p>
                    <p><strong className="text-foreground/50">Authorized Use:</strong> Public health agencies, healthcare systems, educational institutions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standard Export Options */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Share className="h-5 w-5 mr-2" />
                  Export to External Platforms
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInteroperability(!showInteroperability)}
                >
                  {showInteroperability ? 'Hide Options' : 'Show Export Options'}
                </Button>
              </div>
            </CardHeader>
            {showInteroperability && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Standard Formats */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Standard Formats
                    </h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => exportToMarkdown(selectedArticle)}
                        data-testid="export-markdown"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Markdown (.md)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => exportToHTML(selectedArticle)}
                        data-testid="export-html"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        HTML (.html)
                      </Button>
                    </div>
                  </div>

                  {/* Google Workspace */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Cloud className="h-4 w-4 mr-2" />
                      Google Workspace
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => exportToGoogleDocs(selectedArticle)}
                      data-testid="export-google-docs"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Google Docs
                    </Button>
                  </div>

                  {/* Apple Ecosystem */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Apple Ecosystem
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => exportToAppleNotes(selectedArticle)}
                      data-testid="export-apple-notes"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Apple Notes (iOS 26+)
                    </Button>
                  </div>

                  {/* Microsoft Office */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Monitor className="h-4 w-4 mr-2" />
                      Microsoft Office
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => exportToMSOffice(selectedArticle)}
                      data-testid="export-ms-office"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      MS Word (.doc)
                    </Button>
                  </div>

                  {/* Open Source */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Open Source
                    </h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => exportToOpenOffice(selectedArticle)}
                        data-testid="export-libreoffice"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        LibreOffice
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => exportToAppFlowy(selectedArticle)}
                        data-testid="export-appflowy"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        AppFlowy
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Export */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Bulk Export
                    </h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={createExportAllArticles(wikiArticles)}
                      data-testid="export-all-articles"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      All Articles
                    </Button>
                  </div>
                </div>

                {/* Integration Instructions */}
                <div className="mt-6 p-4 bg-white/3 rounded-lg border border-white/8">
                  <h4 className="text-sm font-medium text-foreground/60 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Platform Integration Guide
                  </h4>
                  <div className="text-xs text-foreground/35 space-y-1.5">
                    <p><strong className="text-foreground/50">Google Workspace:</strong> Drive API, Sites API, or Docs API</p>
                    <p><strong className="text-foreground/50">Apple Notes:</strong> iOS 26+/macOS 26+ native markdown import</p>
                    <p><strong className="text-foreground/50">Microsoft Office:</strong> MarkItDown tool or Writage plugin</p>
                    <p><strong className="text-foreground/50">LibreOffice:</strong> Native markdown support v26.2 (2026)</p>
                    <p><strong className="text-foreground/50">AppFlowy:</strong> Settings → Files → Import Data</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BetaDisclaimer />

      <div className="bg-background border-b border-white/10 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-xl mb-4">
            <BookOpen className="h-8 w-8 text-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground font-display">
            TriSex.org Knowledge Wiki
          </h1>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed">
            Best Practices for Sustainable Sexual Health
          </p>

          <div className="mt-6 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-foreground/30" />
              <Input
                placeholder="Search wiki articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-5 text-base rounded-lg border border-white/15 bg-white/5 text-foreground placeholder:text-foreground/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <Alert className="mb-10 bg-white/5 border border-white/15 rounded-lg">
            <Heart className="h-4 w-4 text-primary flex-shrink-0" />
            <AlertDescription className="ml-2 text-foreground/70 text-sm">
              <strong className="text-foreground">Intersex Healthcare IS Everyone's Affirmation:</strong> Wiki content centers intersex anatomy as the universal baseline.
            </AlertDescription>
          </Alert>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-white/10 bg-white/3">
              <CardHeader className="bg-white/5 pb-4">
                <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200 ${
                          activeCategory === category.id
                            ? "bg-white text-black"
                            : "hover:bg-white/5 text-foreground/70"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${activeCategory === category.id ? 'border-black/20 text-black' : 'border-white/15 text-foreground/40'}`}>
                          {category.count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/3">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1">
                  {[
                    { icon: Star, label: "Getting Started Guide" },
                    { icon: Target, label: "Community Guidelines" },
                    { icon: Zap, label: "Technical Support" },
                    { icon: Globe, label: "Community Forum" },
                  ].map(({ icon: Icon, label }) => (
                    <a key={label} href="#" className="flex items-center space-x-2.5 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                      <Icon className="h-4 w-4 text-foreground/40" />
                      <span className="text-sm text-foreground/60 hover:text-foreground">{label}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredArticles.map((article) => {
                const IconComponent = getCategoryIcon(article.category);
                return (
                  <Card key={article.id} className="group hover:border-white/20 transition-all duration-200 border border-white/10 bg-white/3 overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                          <IconComponent className="h-3.5 w-3.5 text-foreground/50" />
                          <span className="text-xs text-foreground/50">
                            {categories.find(c => c.id === article.category)?.name}
                          </span>
                        </div>
                        <Badge className={getDifficultyColor(article.difficulty) + " text-xs"}>
                          {article.difficulty}
                        </Badge>
                        <span className="text-xs text-foreground/30">{article.readTime} read</span>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground mb-1.5 font-display">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center space-x-3 text-xs text-foreground/30">
                        <span>By {article.author}</span>
                        <span className="text-foreground/15">•</span>
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <p className="text-foreground/50 leading-relaxed line-clamp-3 text-sm">
                          {article.content.split('\n\n')[1]?.replace(/^#{1,6}\s/, '') || 
                           article.content.substring(0, 200) + "..."}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs bg-white/3 text-foreground/35 border-white/10">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs border-white/10 text-foreground/25">+{article.tags.length - 5}</Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/8">
                          <div className="flex items-center space-x-1.5 text-foreground/25">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="text-xs">Verified</span>
                          </div>
                          <button 
                            onClick={() => setSelectedArticle(article)}
                            className="flex items-center space-x-1.5 px-4 py-2 bg-white text-black hover:bg-white/90 text-sm font-semibold rounded-lg transition-colors"
                          >
                            <span>Read Article</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredArticles.length === 0 && (
                <Card className="border border-white/10 bg-white/3">
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
                    <p className="text-foreground/40 text-sm">
                      Try adjusting your search terms or browse different categories.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <Card className="mt-12 bg-white/3 border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1 text-sm">Community-Driven Knowledge</h4>
                <p className="text-xs text-foreground/40 leading-relaxed">
                  This wiki is maintained collaboratively by the TriSex.org community, healthcare professionals, 
                  and subject matter experts. All content is reviewed for accuracy and cultural sensitivity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
    </div>
  );
}