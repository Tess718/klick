import QRCode from "qrcode";
import { QRCodeActions } from "./qr-actions";

export async function QRCodeDisplay({ url }: { url: string }) {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 192,
      margin: 1,
      color: {
        dark: "#18181b", // zinc-900
        light: "#ffffff",
      },
    });

    return (
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-zinc-200 flex flex-col items-center">
        <img src={dataUrl} alt={`QR Code for ${url}`} width={192} height={192} className="rounded-xl" />
        <QRCodeActions dataUrl={dataUrl} url={url} />
      </div>
    );
  } catch (err) {
    console.error("Failed to generate QR code", err);
    return <div className="w-48 h-48 bg-zinc-100 flex items-center justify-center text-zinc-400 rounded-xl">Error generating QR</div>;
  }
}
