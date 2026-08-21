/**
 * Signal Desk design note: this product page is a high-clarity operator workbench.
 * It uses an asymmetric command rail, technical labels, and signal-orange actions to keep tools—not decoration—at the forefront.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Braces,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Command,
  Copy,
  Download,
  FileText,
  Globe2,
  Heart,
  Image as ImageIcon,
  Info,
  KeyRound,
  LockKeyhole,
  Moon,
  Palette,
  PanelLeft,
  ScanText,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TextCursorInput,
  Trash2,
  Type,
  WandSparkles,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { categoryCount, categories, tools, type ToolCategory, type ToolDefinition, type ToolIconName } from "@/tools/registry";

type SavedState = { favorites: string[]; recents: string[] };

const storageKey = "developerhub:operator-state";
const staticAsset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const heroImage = staticAsset("developerhub-signal-desk-hero.png");
const privacyImage = staticAsset("developerhub-privacy-local-processing.png");
const atlasImage = staticAsset("developerhub-tools-atlas.png");
const logoImage = staticAsset("developerhub-signal-gate-logo.png");

const toolIcons: Record<ToolIconName, typeof Braces> = {
  braces: Braces,
  code: Code2,
  shield: ShieldCheck,
  key: KeyRound,
  clock: CalendarClock,
  palette: Palette,
  scan: ScanText,
  type: TextCursorInput,
  image: ImageIcon,
  globe: Globe2,
  spark: WandSparkles,
  file: FileText,
};

function loadState(): SavedState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { favorites: ["json", "base64"], recents: ["json", "timestamp", "uuid"] };
  } catch {
    return { favorites: ["json", "base64"], recents: ["json", "timestamp", "uuid"] };
  }
}

function ToolGlyph({ icon, size = 16 }: { icon: ToolIconName; size?: number }) {
  const Icon = toolIcons[icon];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

function ToolCard({
  tool,
  active,
  favorite,
  onSelect,
  onToggleFavorite,
}: {
  tool: ToolDefinition;
  active: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <article className={`tool-card ${active ? "tool-card--active" : ""}`}>
      <button className="tool-card__main" onClick={onSelect} aria-current={active ? "page" : undefined}>
        <span className="tool-card__icon"><ToolGlyph icon={tool.icon} /></span>
        <span className="tool-card__content">
          <span className="tool-card__topline"><span className="tool-card__name">{tool.name}</span><span className={`status-dot ${tool.status === "Ready" ? "status-dot--ready" : ""}`} /></span>
          <span className="tool-card__description">{tool.description}</span>
        </span>
        <ChevronRight size={17} className="tool-card__arrow" />
      </button>
      <button className={`favorite-button ${favorite ? "favorite-button--selected" : ""}`} onClick={onToggleFavorite} aria-label={`${favorite ? "Remove" : "Add"} ${tool.name} ${favorite ? "from" : "to"} favorites`}>
        <Star size={14} fill={favorite ? "currentColor" : "none"} />
      </button>
    </article>
  );
}

function OutputPanel({ value, label = "OUTPUT", copyLabel = "Copy" }: { value: string; label?: string; copyLabel?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1100);
  };

  return (
    <section className="output-panel" aria-label="Tool output">
      <div className="panel-label"><span>{label}</span><button className="mini-action" onClick={copy} disabled={!value}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Copied" : copyLabel}</button></div>
      <pre>{value || "Your result will appear here."}</pre>
    </section>
  );
}

function ToolWorkspace({ tool, onUsed }: { tool: ToolDefinition; onUsed: () => void }) {
  const [input, setInput] = useState(tool.id === "json" ? '{\n  "workspace": "DeveloperHub",\n  "local": true\n}' : "");
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState("Ready for local processing.");
  const [regexPattern, setRegexPattern] = useState("\\bdev\\w*\\b");
  const [regexSample, setRegexSample] = useState("DeveloperHub keeps developer tools close to the work.");
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [color, setColor] = useState("#FF6B35");
  const [passwordLength, setPasswordLength] = useState(20);

  const run = async (operation = "format") => {
    try {
      if (tool.id === "json") {
        const parsed = JSON.parse(input);
        setOutput(operation === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
        setNotice(operation === "validate" ? "Valid JSON. Structure verified locally." : `JSON ${operation === "minify" ? "minified" : "formatted"} locally.`);
      } else if (tool.id === "base64") {
        const encoded = operation === "decode" ? decodeURIComponent(Array.prototype.map.call(atob(input), (char: string) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")) : btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))));
        setOutput(encoded);
        setNotice(`Base64 ${operation === "decode" ? "decoded" : "encoded"} in this browser.`);
      } else if (tool.id === "url") {
        setOutput(operation === "decode" ? decodeURIComponent(input) : encodeURIComponent(input));
        setNotice(`URL value ${operation === "decode" ? "decoded" : "encoded"} locally.`);
      } else if (tool.id === "jwt") {
        const [, payload] = input.trim().split(".");
        if (!payload) throw new Error("A JWT has three dot-separated sections.");
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        setOutput(JSON.stringify(JSON.parse(atob(normalized)), null, 2));
        setNotice("Payload decoded only. No signature is validated or sent anywhere.");
      } else if (tool.id === "hash") {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
        setOutput(Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join(""));
        setNotice("SHA-256 digest created with browser Web Crypto.");
      } else if (tool.id === "uuid") {
        setOutput(Array.from({ length: 5 }, () => crypto.randomUUID()).join("\n"));
        setNotice("Five UUIDs generated by this browser.");
      } else if (tool.id === "password") {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*_-";
        const bytes = new Uint32Array(passwordLength);
        crypto.getRandomValues(bytes);
        setOutput(Array.from(bytes, (value) => alphabet[value % alphabet.length]).join(""));
        setNotice(`A ${passwordLength}-character password was generated locally.`);
      } else if (tool.id === "timestamp") {
        const parsed = Number(timestamp);
        if (Number.isNaN(parsed)) throw new Error("Enter a Unix timestamp in seconds.");
        const date = new Date(parsed * 1000);
        if (Number.isNaN(date.getTime())) throw new Error("That timestamp is out of range.");
        setOutput(`ISO 8601     ${date.toISOString()}\nLocal time   ${date.toLocaleString()}\nUTC          ${date.toUTCString()}\nMilliseconds ${date.getTime()}`);
        setNotice("Timestamp converted locally.");
      } else if (tool.id === "regex") {
        const expression = new RegExp(regexPattern, "gi");
        const matches = Array.from(regexSample.matchAll(expression));
        setOutput(matches.length ? matches.map((match, index) => `${String(index + 1).padStart(2, "0")}  ${match[0]}  · index ${match.index}`).join("\n") : "No matches found.");
        setNotice(`${matches.length} match${matches.length === 1 ? "" : "es"} found locally.`);
      } else if (tool.id === "colors") {
        const value = color.trim();
        if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) throw new Error("Enter a 3- or 6-digit HEX color, such as #FF6B35.");
        const hex = value.length === 4 ? `#${value.slice(1).split("").map((part) => part + part).join("")}` : value.toUpperCase();
        const numeric = parseInt(hex.slice(1), 16);
        const rgb = [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255];
        setOutput(`HEX  ${hex}\nRGB  rgb(${rgb.join(", ")})\nCSS  color: ${hex};\n\nSignal test: ${hex === "#FF6B35" ? "DeveloperHub Signal Orange" : "Custom local value"}`);
        setNotice("Color value inspected locally.");
      } else if (tool.id === "lorem") {
        setOutput("DeveloperHub keeps the everyday workbench close at hand. Build, inspect, convert, and ship without sending routine input across the network. Every operation begins in the browser and remains under your control.");
        setNotice("A controlled sample paragraph is ready.");
      } else if (tool.id === "html") {
        const tokens = input.match(/<[^>]+>|[^<]+/g) ?? [];
        let depth = 0;
        const lines = tokens.map((token) => {
          const trimmed = token.trim();
          if (!trimmed) return "";
          if (/^<\//.test(trimmed)) depth = Math.max(0, depth - 1);
          const line = `${"  ".repeat(depth)}${trimmed}`;
          if (/^<[^/!][^>]*[^/]>$/.test(trimmed) && !/^<(meta|img|input|br|hr|link)/i.test(trimmed)) depth += 1;
          return line;
        }).filter(Boolean);
        setOutput(lines.join("\n"));
        setNotice("Markup arranged for quick review. Use a full parser before production transformation.");
      } else {
        setOutput(`${tool.name} is registered in the DeveloperHub workspace. Its dedicated local engine is the next implementation unit.\n\nThis project already includes the shared tool contract, search, favorites, history, help frame, privacy status, and extension point needed to add it without reworking navigation.`);
        setNotice("Tool framework ready for its dedicated engine.");
      }
      onUsed();
    } catch (error) {
      setOutput("");
      setNotice(error instanceof Error ? error.message : "This input could not be processed.");
    }
  };

  const download = () => {
    const file = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${tool.id}-developerhub.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const controls = () => {
    if (tool.id === "json") return <><button className="action-button" onClick={() => run("format")}>Format JSON</button><button className="ghost-action" onClick={() => run("minify")}>Minify</button><button className="ghost-action" onClick={() => run("validate")}>Validate</button></>;
    if (tool.id === "base64" || tool.id === "url") return <><button className="action-button" onClick={() => run("encode")}>Encode</button><button className="ghost-action" onClick={() => run("decode")}>Decode</button></>;
    if (tool.id === "uuid") return <button className="action-button" onClick={() => run()}>Generate 5 UUIDs</button>;
    if (tool.id === "password") return <><label className="compact-control">Length <input type="number" min="12" max="128" value={passwordLength} onChange={(event) => setPasswordLength(Number(event.target.value))} /></label><button className="action-button" onClick={() => run()}>Generate password</button></>;
    if (tool.id === "timestamp") return <><label className="compact-control">Unix seconds <input value={timestamp} onChange={(event) => setTimestamp(event.target.value)} /></label><button className="action-button" onClick={() => run()}>Convert</button></>;
    if (tool.id === "colors") return <><label className="compact-control">HEX <input value={color} onChange={(event) => setColor(event.target.value)} /></label><span className="color-chip" style={{ background: /^#[0-9a-f]{3,6}$/i.test(color) ? color : "transparent" }} /><button className="action-button" onClick={() => run()}>Inspect color</button></>;
    return <button className="action-button" onClick={() => run()}>{tool.id === "jwt" ? "Decode claims" : tool.id === "hash" ? "Generate SHA-256" : tool.id === "regex" ? "Run test" : tool.id === "html" ? "Format markup" : tool.id === "lorem" ? "Generate copy" : "Open tool"}</button>;
  };

  const usesAuxiliaryInput = ["regex", "timestamp", "colors", "uuid", "password"].includes(tool.id);
  return (
    <section className="workspace" aria-labelledby="workspace-title">
      <div className="workspace__heading">
        <div>
          <div className="eyebrow"><CircleDot size={12} /> {tool.category} / {tool.status === "Ready" ? "LOCAL ENGINE" : "EXTENSION SLOT"}</div>
          <h1 id="workspace-title">{tool.name}</h1>
          <p>{tool.description}</p>
        </div>
        <div className="workspace__trust"><LockKeyhole size={15} /><span>{tool.local ? "Runs in your browser" : "No network request"}</span></div>
      </div>

      <div className="workspace__rule" />
      {tool.id === "regex" && <div className="dual-input"><label>Pattern<input className="operator-input" value={regexPattern} onChange={(event) => setRegexPattern(event.target.value)} /></label><label>Sample text<textarea className="operator-textarea operator-textarea--compact" value={regexSample} onChange={(event) => setRegexSample(event.target.value)} /></label></div>}
      {!usesAuxiliaryInput && <label className="input-frame"><span>{tool.id === "json" ? "JSON INPUT" : tool.id === "html" ? "HTML INPUT" : "INPUT"}</span><textarea className="operator-textarea" value={input} onChange={(event) => setInput(event.target.value)} placeholder={tool.id === "jwt" ? "Paste a JWT token. It stays in this browser." : "Paste or type your working input here."} spellCheck={false} /></label>}
      <div className="workspace__actions">{controls()}<span className="workspace__notice"><Activity size={13} />{notice}</span></div>
      <OutputPanel value={output} />
      <div className="workspace__footer"><span><Info size={14} />Files and strings are processed in the browser. This tool makes no data request.</span><button className="export-action" onClick={download} disabled={!output}><Download size={14} />Export .txt</button></div>
    </section>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState<SavedState>(loadState);
  const [activeTool, setActiveTool] = useState("json");
  const [activeCategory, setActiveCategory] = useState<"All" | string>("All");
  const [view, setView] = useState<"all" | "favorites" | "recent">("all");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    setSaved((current) => ({ ...current, recents: [activeTool, ...current.recents.filter((id) => id !== activeTool)].slice(0, 6) }));
  }, [activeTool]);

  const activeDefinition = tools.find((tool) => tool.id === activeTool) ?? tools[0];
  const filteredTools = useMemo(() => tools.filter((tool) => {
    const searchable = [tool.name, tool.description, tool.category, ...tool.keywords].join(" ").toLowerCase();
    const matchesQuery = searchable.includes(query.toLowerCase().trim());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    const matchesView = view === "all" || (view === "favorites" ? saved.favorites.includes(tool.id) : saved.recents.includes(tool.id));
    return matchesQuery && matchesCategory && matchesView;
  }), [activeCategory, query, saved.favorites, saved.recents, view]);

  const chooseTool = (id: string) => {
    setActiveTool(id);
    setSidebarOpen(false);
  };

  const toggleFavorite = (id: string) => setSaved((current) => ({ ...current, favorites: current.favorites.includes(id) ? current.favorites.filter((favorite) => favorite !== id) : [id, ...current.favorites] }));
  const clearRecents = () => setSaved((current) => ({ ...current, recents: [] }));

  return (
    <div className="operator-shell">
      <aside className={`operator-rail ${sidebarOpen ? "operator-rail--open" : ""}`}>
        <div className="rail-brand"><img src={logoImage} alt="DeveloperHub signal gate" /><span>DEVELOPER<span>HUB</span><b>.</b></span><button onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><PanelLeft size={17} /></button></div>
        <nav className="rail-nav" aria-label="Tool navigation">
          <button className={`rail-nav__item ${view === "all" ? "rail-nav__item--active" : ""}`} onClick={() => { setView("all"); setActiveCategory("All"); }}><Braces size={16} /><span>All tools</span><kbd>{tools.length}</kbd></button>
          <button className={`rail-nav__item ${view === "favorites" ? "rail-nav__item--active" : ""}`} onClick={() => { setView("favorites"); setActiveCategory("All"); }}><Star size={16} /><span>Favorites</span><kbd>{saved.favorites.length}</kbd></button>
          <button className={`rail-nav__item ${view === "recent" ? "rail-nav__item--active" : ""}`} onClick={() => { setView("recent"); setActiveCategory("All"); }}><Clock3 size={16} /><span>Recent</span><kbd>{saved.recents.length}</kbd></button>
        </nav>
        <div className="rail-section-label">Collections</div>
        <nav className="collection-list" aria-label="Tool categories">
          {categories.map((category: { name: ToolCategory; description: string }) => <button key={category.name} className={`collection-list__item ${activeCategory === category.name && view === "all" ? "collection-list__item--active" : ""}`} onClick={() => { setView("all"); setActiveCategory(category.name); }}><span>{category.name}</span><b>{categoryCount(category.name)}</b></button>)}
        </nav>
        <div className="rail-bottom"><div className="local-status"><span className="status-dot status-dot--ready" /><span>PRIVACY MODE</span><small>Local processing active</small></div><a href="#documentation"><FileText size={15} />Documentation</a></div>
      </aside>
      {sidebarOpen && <button className="rail-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      <main className="operator-main">
        <header className="operator-header">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><PanelLeft size={18} /></button>
          <label className="search-field"><Search size={17} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, formats, conversions…" aria-label="Search tools" /><kbd><Command size={11} />K</kbd></label>
          <div className="header-actions"><button className="header-icon" onClick={toggleTheme} aria-label="Toggle color mode">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button><a href="#documentation" className="header-docs">Docs <ChevronRight size={14} /></a></div>
        </header>

        <div className="operator-content">
          <section className="workbench-intro">
            <div className="intro-copy"><div className="eyebrow"><CircleDot size={12} /> BROWSER-NATIVE WORKBENCH</div><h2>Useful tools.<br /><em>Kept close.</em></h2><p>Format data, generate identifiers, inspect values, and prepare technical files—without making an account or handing routine work to a remote service.</p><div className="intro-stats"><span><b>{tools.filter((tool) => tool.status === "Ready").length}</b> local engines</span><span><b>{tools.length}</b> registered tools</span></div></div>
            <div className="hero-art"><img src={heroImage} alt="Abstract DeveloperHub technical signal composition" /><div className="hero-art__stamp"><span>DEVELOPERHUB / 01</span><b>LOCAL<br />FIRST</b></div></div>
          </section>

          <section className="desk-grid">
            <div className="tool-index"><div className="index-heading"><div><span className="eyebrow">TOOL INDEX</span><h3>{view === "all" ? activeCategory : view === "favorites" ? "Favorites" : "Recent work"}</h3></div><span className="result-count">{filteredTools.length.toString().padStart(2, "0")} results</span></div><div className="tool-list">{filteredTools.length ? filteredTools.map((tool: ToolDefinition) => <ToolCard key={tool.id} tool={tool} active={tool.id === activeTool} favorite={saved.favorites.includes(tool.id)} onSelect={() => chooseTool(tool.id)} onToggleFavorite={() => toggleFavorite(tool.id)} />) : <div className="empty-index"><Heart size={22} /><p>No matching tools in this index.</p><button onClick={() => { setQuery(""); setView("all"); setActiveCategory("All"); }}>Reset filters</button></div>}</div></div>
            <ToolWorkspace key={activeTool} tool={activeDefinition} onUsed={() => setSaved((current) => ({ ...current, recents: [activeDefinition.id, ...current.recents.filter((id) => id !== activeDefinition.id)].slice(0, 6) }))} />
          </section>

          <section className="recent-strip" aria-label="Recently used tools"><div><span className="eyebrow">RECENTLY USED</span><p>{saved.recents.length ? "Your local workbench remembers tool choices—not your input." : "No tool history is stored."}</p></div><div className="recent-strip__tools">{saved.recents.map((id: string) => { const tool = tools.find((item: ToolDefinition) => item.id === id); return tool ? <button key={id} onClick={() => chooseTool(id)}><ToolGlyph icon={tool.icon} size={15} />{tool.name}</button> : null; })}{saved.recents.length > 0 && <button className="clear-history" onClick={clearRecents}><Trash2 size={14} />Clear</button>}</div></section>

          <section className="product-proof" id="documentation"><div className="proof-card proof-card--privacy"><img src={privacyImage} alt="Abstract local-processing boundary illustration" /><div className="proof-card__content"><span className="eyebrow"><LockKeyhole size={12} /> LOCAL BY DEFAULT</span><h3>Routine work should not require an upload.</h3><p>DeveloperHub is designed around tools that can complete their job inside the browser. The interface names the boundary clearly so you can decide what belongs here.</p><button onClick={() => chooseTool("jwt")}>Read privacy behavior <ChevronRight size={15} /></button></div></div><div className="proof-card proof-card--atlas"><img src={atlasImage} alt="Abstract modular developer tool atlas" /><div className="proof-card__content"><span className="eyebrow"><Sparkles size={12} /> BUILT TO EXTEND</span><h3>One consistent workbench for new capabilities.</h3><p>Each tool follows a shared contract for search, help, local-first messaging, output, exports, favorites, and history.</p><button onClick={() => chooseTool("formatters")}>Inspect tool framework <ChevronRight size={15} /></button></div></div></section>
          <footer className="operator-footer"><div><span>DEVELOPERHUB</span><p>Browser-native tools for practical developer work.</p></div><div><a href="#">Privacy</a><a href="#">Terms</a><a href="https://github.com/V1CT330" target="_blank" rel="noreferrer">GitHub</a></div></footer>
        </div>
      </main>
    </div>
  );
}
