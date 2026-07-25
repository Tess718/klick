import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ShieldAlertIcon, ArrowLeftIcon, ExternalLinkIcon, AlertTriangleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Security Warning | Klick",
  description: "The link you are trying to visit has been flagged as potentially unsafe.",
};

function formatThreatReason(reason: string): { title: string; description: string } {
  const upper = reason.toUpperCase();
  if (upper.includes("MALWARE")) {
    return {
      title: "Malicious Software Risk",
      description: "Threat intelligence filters (URLhaus / Google Safe Browsing) detected malware on this destination site.",
    };
  }
  if (upper.includes("SOCIAL_ENGINEERING") || upper.includes("PHISHING")) {
    return {
      title: "Phishing / Social Engineering Risk",
      description: "Security filters flagged this site for attempting to trick visitors into sharing sensitive info.",
    };
  }
  if (upper.includes("UNWANTED")) {
    return {
      title: "Potentially Unwanted Software",
      description: "This destination site may attempt to install deceptive software on your browser or device.",
    };
  }
  return {
    title: "Potentially Unsafe Content",
    description: "This link destination was flagged by security intelligence filters as potentially dangerous.",
  };
}

async function WarningContent({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; reason?: string }>;
}) {
  const { destination = "#", reason = "unknown" } = await searchParams;
  const threatInfo = formatThreatReason(reason);

  return (
    <Card className="max-w-md w-full border-red-500/30 shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-600" />
      
      <CardHeader className="text-center pt-8 pb-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-500 shadow-inner">
          <ShieldAlertIcon className="w-8 h-8 stroke-[1.75]" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Warning: Unsafe Link
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          Security filters flagged this destination as potentially dangerous.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6">
        {/* Threat Reason Box */}
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertTriangleIcon className="w-4 h-4 shrink-0" />
            <span>{threatInfo.title}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {threatInfo.description}
          </p>
        </div>

        {/* Destination Inspection Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Destination URL:
          </label>
          <div className="p-3 rounded-lg bg-muted/60 border border-border text-xs font-mono text-foreground break-all select-all">
            {destination}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2.5 bg-muted/30 p-6 border-t border-border">
        <Button
          size="lg"
          className="w-full font-semibold shadow-md bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          render={
            <Link href="/">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Go Back (Recommended)
            </Link>
          }
        />

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          render={
            <a href={destination} target="_blank" rel="noreferrer noopener">
              Continue to website anyway
              <ExternalLinkIcon className="w-3 h-3 ml-1.5" />
            </a>
          }
        />
      </CardFooter>
    </Card>
  );
}

export default function LinkWarningPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; reason?: string }>;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="max-w-md w-full h-96 bg-card rounded-2xl border border-border animate-pulse" />}>
        <WarningContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
