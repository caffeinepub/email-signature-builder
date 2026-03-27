import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Upload, X } from "lucide-react";
import { useRef } from "react";
import type { SignatureData, StyleOptions } from "../templates/types";

interface Props {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  style: StyleOptions;
  onStyleChange: (style: StyleOptions) => void;
}

const FONTS = [
  "Arial",
  "Georgia",
  "Trebuchet MS",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "Palatino",
];

const SOCIAL_FIELDS: {
  key: keyof SignatureData["socials"];
  label: string;
  placeholder: string;
}[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/yourname",
  },
  { key: "x", label: "X (Twitter)", placeholder: "x.com/yourhandle" },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourhandle",
  },
  { key: "facebook", label: "Facebook", placeholder: "facebook.com/yourpage" },
  { key: "youtube", label: "YouTube", placeholder: "youtube.com/@yourchannel" },
  { key: "tiktok", label: "TikTok", placeholder: "tiktok.com/@yourhandle" },
  { key: "substack", label: "Substack", placeholder: "yourname.substack.com" },
];

export default function SignatureEditor({
  data,
  onChange,
  style,
  onStyleChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof SignatureData, value: string) {
    onChange({ ...data, [field]: value });
  }

  function setSocial(key: keyof SignatureData["socials"], value: string) {
    onChange({ ...data, socials: { ...data.socials, [key]: value } });
  }

  function setStyleField<K extends keyof StyleOptions>(
    key: K,
    value: StyleOptions[K],
  ) {
    onStyleChange({ ...style, [key]: value });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      onChange({ ...data, logoBase64: result });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeLogo() {
    onChange({ ...data, logoBase64: null });
  }

  function triggerFileInput() {
    fileRef.current?.click();
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden flex flex-col h-fit">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Edit Signature
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fill in your details below
        </p>
      </div>

      <ScrollArea className="flex-1 max-h-[calc(100vh-220px)]">
        <div className="px-5 py-4 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Basic Info
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium">
                Name
              </Label>
              <Input
                id="name"
                data-ocid="editor.name.input"
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Jane Smith"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobTitle" className="text-xs font-medium">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                data-ocid="editor.jobTitle.input"
                value={data.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                placeholder="Product Designer"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-medium">
                Company
              </Label>
              <Input
                id="company"
                data-ocid="editor.company.input"
                value={data.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Corp"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                data-ocid="editor.phone.input"
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-xs font-medium">
                Website
              </Label>
              <Input
                id="website"
                data-ocid="editor.website.input"
                value={data.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="yourwebsite.com"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                data-ocid="editor.email.input"
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@company.com"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline" className="text-xs font-medium">
                Tagline
              </Label>
              <Input
                id="tagline"
                data-ocid="editor.tagline.input"
                value={data.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Your memorable tagline"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-medium">
                Short Description
              </Label>
              <Textarea
                id="description"
                data-ocid="editor.description.textarea"
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A brief description about yourself..."
                rows={2}
                className="text-sm resize-none"
              />
            </div>
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Social Links
            </p>
            {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label
                  htmlFor={`social-${key}`}
                  className="text-xs font-medium"
                >
                  {label}
                </Label>
                <Input
                  id={`social-${key}`}
                  data-ocid={`editor.${key}.input`}
                  value={data.socials[key]}
                  onChange={(e) => setSocial(key, e.target.value)}
                  placeholder={placeholder}
                  className="h-9 text-sm"
                />
              </div>
            ))}
          </div>

          <Separator />

          {/* Logo Upload */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Logo
            </p>
            {data.logoBase64 ? (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md border border-border">
                <img
                  src={data.logoBase64}
                  alt="Logo preview"
                  className="h-10 w-auto max-w-[100px] object-contain"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  data-ocid="editor.logo.delete_button"
                  className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="w-full flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-border rounded-md bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={triggerFileInput}
                data-ocid="editor.logo.dropzone"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground text-center">
                  Click to upload your logo
                  <br />
                  <span className="text-[11px]">PNG, JPG, SVG up to 2MB</span>
                </span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
              data-ocid="editor.logo.upload_button"
            />
            {!data.logoBase64 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={triggerFileInput}
                data-ocid="editor.logo.button"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload Logo
              </Button>
            )}
          </div>

          <Separator />

          {/* Customization */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Customization
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Font</Label>
              <Select
                value={style.font}
                onValueChange={(v) => setStyleField("font", v)}
              >
                <SelectTrigger
                  className="h-9 text-sm"
                  data-ocid="editor.font.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Primary Color</Label>
                <div className="flex items-center gap-2 h-9 px-3 border border-border rounded-md bg-background">
                  <input
                    type="color"
                    value={style.primaryColor}
                    onChange={(e) =>
                      setStyleField("primaryColor", e.target.value)
                    }
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                    data-ocid="editor.primary_color.input"
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {style.primaryColor.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Text Color</Label>
                <div className="flex items-center gap-2 h-9 px-3 border border-border rounded-md bg-background">
                  <input
                    type="color"
                    value={style.secondaryColor}
                    onChange={(e) =>
                      setStyleField("secondaryColor", e.target.value)
                    }
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                    data-ocid="editor.secondary_color.input"
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {style.secondaryColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-medium">Gradient Accent</p>
                <p className="text-xs text-muted-foreground">
                  Apply gradient to accent areas
                </p>
              </div>
              <Switch
                checked={style.useGradient}
                onCheckedChange={(v) => setStyleField("useGradient", v)}
                data-ocid="editor.gradient.switch"
              />
            </div>

            {style.useGradient && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Gradient Start</Label>
                  <div className="flex items-center gap-2 h-9 px-3 border border-border rounded-md bg-background">
                    <input
                      type="color"
                      value={style.gradientStart}
                      onChange={(e) =>
                        setStyleField("gradientStart", e.target.value)
                      }
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                      data-ocid="editor.gradient_start.input"
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {style.gradientStart.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Gradient End</Label>
                  <div className="flex items-center gap-2 h-9 px-3 border border-border rounded-md bg-background">
                    <input
                      type="color"
                      value={style.gradientEnd}
                      onChange={(e) =>
                        setStyleField("gradientEnd", e.target.value)
                      }
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                      data-ocid="editor.gradient_end.input"
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {style.gradientEnd.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
