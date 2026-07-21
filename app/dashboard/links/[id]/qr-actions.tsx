"use client";

import { useState } from "react";
import { ArrowDownTrayIcon, ShareIcon, CheckIcon } from "@heroicons/react/24/outline";

export function QRCodeActions({ dataUrl, url }: { dataUrl: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${new URL(`https://${url}`).hostname}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const targetUrl = url.startsWith("http") ? url : `https://${url}`;

    if (typeof navigator !== "undefined") {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "qrcode.png", { type: "image/png" });

        // 1. Try sharing file if supported (Mobile OS)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Share QR Code",
            text: `Check out this link: ${targetUrl}`,
            files: [file],
          });
          return;
        }

        // 2. Try sharing URL if supported
        if (navigator.share) {
          await navigator.share({
            title: "Share QR Code",
            url: targetUrl,
          });
          return;
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // User cancelled share sheet
      }

      // 3. Fallback for Desktop (PC/Mac): Copy URL to Clipboard
      try {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        handleDownload();
      }
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
        {copied ? (
          <>
            <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600">Copied!</span>
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
