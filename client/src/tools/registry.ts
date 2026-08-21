/**
 * Signal Desk design note: this registry is the product's explicit tool index.
 * The interface treats every tool as a dependable work instrument, never as a novelty widget.
 */
export type ToolCategory =
  | "Development"
  | "Encoding & Security"
  | "Conversion"
  | "Productivity"
  | "Web"
  | "Images & Media";

export type ToolIconName =
  | "braces"
  | "code"
  | "shield"
  | "key"
  | "clock"
  | "palette"
  | "scan"
  | "type"
  | "image"
  | "globe"
  | "spark"
  | "file";

export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: ToolIconName;
  local: boolean;
  status: "Ready" | "Planned";
  keywords: string[];
};

export const categories: { name: ToolCategory; description: string }[] = [
  { name: "Development", description: "Format, inspect, and test source data." },
  { name: "Encoding & Security", description: "Generate and decode safely in-browser." },
  { name: "Conversion", description: "Translate data without leaving the workspace." },
  { name: "Productivity", description: "Generate reliable building blocks." },
  { name: "Web", description: "Prepare technical site essentials." },
  { name: "Images & Media", description: "Prepare visual files locally." },
];

export const readyToolIds = new Set([
  "json",
  "base64",
  "jwt",
  "uuid",
  "password",
  "hash",
  "timestamp",
  "regex",
  "colors",
  "lorem",
  "url",
  "html",
]);

const define = (
  id: string,
  name: string,
  description: string,
  category: ToolCategory,
  icon: ToolIconName,
  keywords: string[],
): ToolDefinition => ({
  id,
  name,
  description,
  category,
  icon,
  local: true,
  status: readyToolIds.has(id) ? "Ready" : "Planned",
  keywords,
});

export const tools: ToolDefinition[] = [
  define("json", "JSON Workbench", "Format, validate, minify, and inspect JSON.", "Development", "braces", ["json", "formatter", "validator", "minify"]),
  define("xml", "XML Formatter", "Indent XML documents into readable structure.", "Development", "code", ["xml", "format", "markup"]),
  define("html", "HTML Formatter", "Clean up markup with readable structure.", "Development", "code", ["html", "format", "markup"]),
  define("css", "CSS Formatter", "Normalize stylesheets for review and handoff.", "Development", "code", ["css", "styles", "format"]),
  define("javascript", "JavaScript Formatter", "Prepare JavaScript for a quick inspection.", "Development", "code", ["javascript", "js", "format"]),
  define("sql", "SQL Formatter", "Clarify query structure before execution.", "Development", "code", ["sql", "query", "format"]),
  define("regex", "Regex Tester", "Test patterns against live sample text.", "Development", "scan", ["regex", "regular expression", "match"]),
  define("markdown", "Markdown Studio", "Draft and preview portable Markdown.", "Development", "file", ["markdown", "md", "editor"]),
  define("api", "API Request Pad", "Compose and inspect safe API request drafts.", "Development", "globe", ["api", "http", "request"]),
  define("http", "HTTP Reference", "Look up status-code meaning and response classes.", "Development", "globe", ["http", "status", "codes"]),
  define("base64", "Base64 Codec", "Encode or decode text with Unicode support.", "Encoding & Security", "shield", ["base64", "encode", "decode"]),
  define("jwt", "JWT Reader", "Decode token headers and claims without sending them away.", "Encoding & Security", "shield", ["jwt", "token", "decode"]),
  define("hash", "Hash Generator", "Create a SHA-256 digest with Web Crypto.", "Encoding & Security", "key", ["hash", "sha", "security"]),
  define("uuid", "UUID Generator", "Generate unique identifiers locally.", "Encoding & Security", "key", ["uuid", "guid", "identifier"]),
  define("password", "Password Generator", "Create configurable local-use passphrases.", "Encoding & Security", "key", ["password", "generator", "security"]),
  define("url", "URL Codec", "Encode or decode URL-safe text.", "Encoding & Security", "shield", ["url", "encode", "decode", "uri"]),
  define("timestamp", "Timestamp Converter", "Translate Unix and human-readable times.", "Conversion", "clock", ["timestamp", "unix", "date", "time"]),
  define("units", "Unit Converter", "Convert common engineering and measurement units.", "Conversion", "clock", ["units", "length", "weight", "conversion"]),
  define("colors", "Color Converter", "Inspect HEX, RGB, and HSL color values.", "Conversion", "palette", ["color", "hex", "rgb", "hsl"]),
  define("text", "Text Utilities", "Transform, count, clean, and compare text.", "Conversion", "type", ["text", "case", "count"]),
  define("csv", "CSV Converter", "Move between CSV, JSON, and table data.", "Conversion", "file", ["csv", "json", "convert"]),
  define("images", "Image Converter", "Convert supported images without upload.", "Conversion", "image", ["image", "convert", "png", "jpg"]),
  define("files", "File Utilities", "Inspect and transform supported local files.", "Conversion", "file", ["file", "utility", "local"]),
  define("pdf", "PDF Utilities", "Organize basic browser-side PDF operations.", "Conversion", "file", ["pdf", "merge", "split"]),
  define("calculator", "Developer Calculator", "Evaluate quick technical arithmetic.", "Productivity", "spark", ["calculator", "math", "developer"]),
  define("lorem", "Text Generator", "Generate controlled placeholder copy.", "Productivity", "type", ["lorem", "ipsum", "text", "generator"]),
  define("formatters", "Formatter Shelf", "A unified set of source-formatting tools.", "Productivity", "code", ["formatters", "format"]),
  define("validators", "Validator Shelf", "A clear entry point for local validation tasks.", "Productivity", "scan", ["validators", "validate"]),
  define("seo", "SEO Outline", "Prepare basics for search-friendly documents.", "Web", "globe", ["seo", "meta", "search"]),
  define("meta", "Meta Tag Builder", "Create portable metadata snippets.", "Web", "globe", ["meta", "og", "social"]),
  define("sitemap", "Sitemap Builder", "Build a sitemap file structure.", "Web", "globe", ["sitemap", "xml", "seo"]),
  define("robots", "Robots.txt Builder", "Draft crawler guidance with visible rules.", "Web", "globe", ["robots", "seo", "crawler"]),
  define("performance", "Performance Checklist", "Review client-side site performance cues.", "Web", "spark", ["performance", "lighthouse", "web"]),
  define("compress", "Image Compressor", "Compress visual files within the browser.", "Images & Media", "image", ["image", "compress", "optimize"]),
  define("resize", "Image Resizer", "Resize images for practical export formats.", "Images & Media", "image", ["image", "resize", "scale"]),
  define("qr", "QR Generator", "Generate practical QR payloads locally.", "Images & Media", "image", ["qr", "code", "generator"]),
  define("screenshot", "Screenshot Utilities", "Prepare viewport and image captures.", "Images & Media", "image", ["screenshot", "capture", "image"]),
];

export const categoryCount = (category: ToolCategory) =>
  tools.filter((tool) => tool.category === category).length;
