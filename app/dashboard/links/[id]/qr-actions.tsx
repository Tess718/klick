"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  ShareIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function toAbsoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

type ShareStatus = "idle" | "shared" | "copied" | "downloaded";

export function QRCodeActions({
  dataUrl,
  url,
}: {
  dataUrl: string;
  url: string;
}) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const flash = (s: ShareStatus) => {
    setStatus(s);
    setTimeout(() => setStatus("idle"), 2000);
  };

  const handleDownload = () => {
    const targetUrl = toAbsoluteUrl(url);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${new URL(targetUrl).hostname}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flash("downloaded");
  };

 const handleShare = async () => {
   const targetUrl = toAbsoluteUrl(url);

   if (!window.isSecureContext) {
     console.warn("[QRShare] Not a secure context — falling back to download.");
     handleDownload();
     return;
   }

   const isMobile =
     typeof navigator !== "undefined" &&
     /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

   try {
     const blob = dataURItoBlob(dataUrl);
     const file = new File([blob], "qrcode.png", { type: "image/png" });

     // 1. Native share sheet — mobile only, desktop "share" often silently no-ops
     if (isMobile && navigator.canShare?.({ files: [file] })) {
       try {
         await navigator.share({
           title: "QR Code",
           text: `Scan or visit: ${targetUrl}`,
           files: [file],
         });
         console.log("[QRShare] navigator.share completed");
         flash("shared");
         return;
       } catch (err: any) {
         console.warn(
           "[QRShare] navigator.share failed/cancelled:",
           err.name,
           err.message,
         );
         if (err.name === "AbortError") return;
       }
     }

     // 2. Copy PNG image to clipboard (desktop primary path)
     if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
       try {
         const item = new ClipboardItem({ [blob.type]: blob });
         await navigator.clipboard.write([item]);
         console.log("[QRShare] Image copied to clipboard");
         flash("copied");
         return;
       } catch (imageErr) {
         console.warn("[QRShare] Clipboard image write failed:", imageErr);
       }
     }

     // 3. Copy URL text to clipboard
     if (navigator.clipboard) {
       await navigator.clipboard.writeText(targetUrl);
       console.log("[QRShare] URL text copied to clipboard");
       flash("copied");
       return;
     }

     // 4. Final fallback
     console.warn(
       "[QRShare] No share/clipboard path available, downloading instead",
     );
     handleDownload();
   } catch (err) {
     console.error("[QRShare] Unexpected failure:", err);
     handleDownload();
   }
 };

  return (
    <div className="flex items-center justify-between gap-1 mt-1.5 w-full">
      <button
        onClick={handleDownload}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
        Download
      </button>
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
      >
        {status === "copied" || status === "shared" ? (
          <>
            <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600">
              {status === "shared" ? "Shared!" : "Copied!"}
            </span>
          </>
        ) : (
          <>
            <ShareIcon className="w-3.5 h-3.5" />
            Share
          </>
        )}
      </button>
    </div>
  );
}
