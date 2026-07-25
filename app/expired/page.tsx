import { Metadata } from "next";
import Link from "next/link";
import { ClockIcon, ArrowLeftIcon, LayoutDashboardIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Link Expired | Klick",
  description: "The link you are trying to visit has expired and is no longer active.",
};

export default function ExpiredLinkPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full border-amber-500/30 shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-500 shadow-inner">
            <ClockIcon className="w-8 h-8 stroke-[1.75]" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Link Expired
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            This short link has reached its configured expiration date and is no longer active.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6 text-center">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
            If you are the link owner, you can log into your Klick dashboard to update or remove the expiration time for this link.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2.5 bg-muted/30 p-6 border-t border-border">
          <Button
            size="lg"
            className="w-full font-semibold shadow-md cursor-pointer"
            render={
              <Link href="/">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Return to Homepage
              </Link>
            }
          />

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            render={
              <Link href="/dashboard">
                <LayoutDashboardIcon className="w-3.5 h-3.5 mr-1.5" />
                Go to Dashboard
              </Link>
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
