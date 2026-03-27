import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import SignatureEditor from "./components/SignatureEditor";
import SignaturePreview from "./components/SignaturePreview";
import TemplateSelector from "./components/TemplateSelector";
import type { SignatureData, StyleOptions } from "./templates/types";

const defaultData: SignatureData = {
  name: "",
  jobTitle: "",
  company: "",
  phone: "",
  website: "",
  email: "",
  tagline: "",
  description: "",
  logoBase64: null,
  socials: {
    linkedin: "",
    x: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    substack: "",
  },
};

const defaultStyle: StyleOptions = {
  font: "Arial",
  primaryColor: "#2563EB",
  secondaryColor: "#111827",
  useGradient: false,
  gradientStart: "#2563EB",
  gradientEnd: "#7C3AED",
};

export default function App() {
  const [data, setData] = useState<SignatureData>(defaultData);
  const [style, setStyle] = useState<StyleOptions>(defaultStyle);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card border-b border-border shadow-xs">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#2563EB" }}
            >
              S
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">
              Signature Builder
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Build beautiful email signatures in minutes
          </span>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
        {/* Template Selector */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 tracking-wide uppercase text-xs">
            Choose a Template
          </h2>
          <TemplateSelector
            selected={selectedTemplate}
            onSelect={setSelectedTemplate}
            data={data}
            styleOptions={style}
          />
        </section>

        {/* Two-Column Workspace */}
        <section className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <SignatureEditor
            data={data}
            onChange={setData}
            style={style}
            onStyleChange={setStyle}
          />
          <SignaturePreview
            data={data}
            styleOptions={style}
            templateIndex={selectedTemplate}
          />
        </section>
      </main>

      <footer className="py-10 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()}. Built with &#10084; using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>

      <Toaster />
    </div>
  );
}
