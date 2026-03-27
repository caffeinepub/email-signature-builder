import { useMemo } from "react";
import { TEMPLATES } from "../templates";
import type { SignatureData, StyleOptions } from "../templates/types";

interface Props {
  selected: number;
  onSelect: (index: number) => void;
  data: SignatureData;
  styleOptions: StyleOptions;
}

const DUMMY_DATA: SignatureData = {
  name: "Jane Smith",
  jobTitle: "Product Designer",
  company: "Acme Corp",
  phone: "+1 (555) 123-4567",
  website: "janesmith.com",
  email: "jane@acmecorp.com",
  tagline: "Design that works",
  description: "Award-winning designer.",
  logoBase64: null,
  socials: {
    linkedin: "https://linkedin.com/in/jane",
    x: "https://x.com/jane",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    substack: "",
  },
};

const DUMMY_STYLE: StyleOptions = {
  font: "Arial",
  primaryColor: "#2563EB",
  secondaryColor: "#111827",
  useGradient: false,
  gradientStart: "#2563EB",
  gradientEnd: "#7C3AED",
};

const INNER_W = 560;
const INNER_H = 320;
const SCALE = 0.25;
const OUTER_W = Math.round(INNER_W * SCALE);
const OUTER_H = Math.round(INNER_H * SCALE);

export default function TemplateSelector({ selected, onSelect }: Props) {
  const thumbnails = useMemo(
    () => TEMPLATES.map((t) => t.fn(DUMMY_DATA, DUMMY_STYLE)),
    [],
  );

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2"
      style={{ scrollbarWidth: "thin" }}
      data-ocid="template.list"
    >
      {TEMPLATES.map((t, i) => (
        <button
          key={t.name}
          onClick={() => onSelect(i)}
          data-ocid={`template.item.${i + 1}`}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 group focus:outline-none"
          title={t.name}
          type="button"
        >
          <div
            className={`relative overflow-hidden rounded-md border-2 transition-all duration-150 ${
              selected === i
                ? "border-primary shadow-md shadow-primary/20"
                : "border-border hover:border-primary/40 hover:shadow-sm"
            }`}
            style={{ width: OUTER_W, height: OUTER_H, background: "#fff" }}
          >
            <div
              style={{
                width: INNER_W,
                height: INNER_H,
                transform: `scale(${SCALE})`,
                transformOrigin: "top left",
                padding: "20px",
                pointerEvents: "none",
              }}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: template preview
              dangerouslySetInnerHTML={{ __html: thumbnails[i] }}
            />
            {selected === i && (
              <div
                className="absolute inset-0 border-2 border-primary rounded-[4px] pointer-events-none"
                style={{ boxSizing: "border-box" }}
              />
            )}
          </div>
          <span
            className={`text-[10px] font-medium text-center leading-tight truncate px-1 ${
              selected === i
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
            style={{ maxWidth: OUTER_W }}
          >
            {i + 1}. {t.name}
          </span>
        </button>
      ))}
    </div>
  );
}
