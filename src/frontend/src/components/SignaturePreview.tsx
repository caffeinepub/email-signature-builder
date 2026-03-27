import { Button } from "@/components/ui/button";
import { Check, Copy, Download } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { TEMPLATES } from "../templates";
import type { SignatureData, StyleOptions } from "../templates/types";

interface Props {
  data: SignatureData;
  styleOptions: StyleOptions;
  templateIndex: number;
}

export default function SignaturePreview({
  data,
  styleOptions,
  templateIndex,
}: Props) {
  const [copied, setCopied] = useState(false);

  const templateFn = TEMPLATES[templateIndex]?.fn ?? TEMPLATES[0].fn;
  const html = templateFn(data, styleOptions);

  const copySignature = useCallback(async () => {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
          }),
        ]);
      } else {
        // Fallback: insert into DOM and use execCommand
        const el = document.createElement("div");
        el.innerHTML = html;
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      toast.success("Signature copied! Paste it into your email client.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy. Try the Download button instead.");
    }
  }, [html]);

  const downloadSignature = useCallback(() => {
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Signature</title>
</head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;">
${html}
</body>
</html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("signature.html downloaded!");
  }, [html]);

  return (
    <div
      className="bg-card border border-border rounded-lg shadow-xs flex flex-col"
      data-ocid="preview.panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Preview</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {TEMPLATES[templateIndex]?.name ?? "Template"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSignature}
            data-ocid="preview.download_button"
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download
          </Button>
          <Button
            size="sm"
            onClick={copySignature}
            data-ocid="preview.copy_button"
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Signature
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview area - email context */}
      <div className="flex-1 p-5">
        {/* Email context mockup */}
        <div className="bg-muted/30 rounded-md border border-border p-4 mb-4">
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground w-10">To:</span>
              <div className="h-5 bg-border rounded w-48" />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground w-10">Re:</span>
              <div className="h-5 bg-border rounded w-72" />
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            <div className="h-3 bg-border/70 rounded w-full" />
            <div className="h-3 bg-border/70 rounded w-5/6" />
            <div className="h-3 bg-border/70 rounded w-4/6" />
          </div>
          <div className="border-t border-border/50 pt-4">
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: signature template render
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div
          className="bg-primary/5 border border-primary/15 rounded-md p-3"
          data-ocid="preview.success_state"
        >
          <p className="text-xs text-foreground font-medium mb-1">
            How to use your signature
          </p>
          <ol className="text-xs text-muted-foreground space-y-0.5 list-decimal list-inside">
            <li>Click &ldquo;Copy Signature&rdquo; above</li>
            <li>Open Gmail, Outlook, or Thunderbird settings</li>
            <li>Find the signature section and paste (Ctrl+V / Cmd+V)</li>
            <li>Save your settings</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
