"use client";

import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline";

export function QRCodeActions({ dataUrl, url }: { dataUrl: string; url: string }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${new URL(`https://${url}`).hostname}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "qrcode.png", { type: "image/png" });
        await navigator.share({
          title: "Share QR Code",
          text: `Check out this link: ${url}`,
          files: [file],
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      // Fallback if Web Share API is not supported
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
        <ShareIcon className="w-3.5 h-3.5" />
        Share
      </button>
    </div>
  );
}
