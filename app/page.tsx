import Link from "next/link";
import { ArrowRightIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";
import { Logo } from "@/components/logo";
import { DashboardMockup } from "@/components/dashboard-mockup";
import { LandingHero } from "@/components/landing-hero";
import { LandingFeatures } from "@/components/landing-features";
import { LandingHowItWorks } from "@/components/landing-how-it-works";
import { FAQItem } from "@/components/faq-item";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink flex flex-col overflow-hidden">
      {/* Navigation */}
      <header className="absolute top-0 left-0 w-full py-6 flex items-center justify-center z-20">
        <div className="w-full max-w-[1400px] px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <Logo className="h-8 w-auto" />
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-full hover:bg-ink/90 transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center w-full">
        <section className="bg-paper w-full pt-32 px-6 md:px-12 lg:px-16 flex flex-col items-center text-center relative z-10">
          <LandingHero />

          <div className="w-full mt-16">
            <DashboardMockup />
          </div>
        </section>

        {/* Feature Highlights */}
        <div className="mt-24 max-w-[1400px] w-full flex flex-col items-center px-6 md:px-12 lg:px-16">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Everything you need to track, route, and scale.
            </h2>
            <p className="text-lg text-ink/70">
              Klick isn't just a URL shortener. It's a complete link management platform designed for speed, detailed analytics, and global reliability.
            </p>
          </div>

          {/* Alternate Rows */}
          <div className="w-full flex flex-col gap-24 md:gap-32">
            <LandingFeatures />
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 md:mt-24 max-w-[1400px] w-full px-6 md:px-12 lg:px-16">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <LandingHowItWorks />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 md:mt-24 max-w-3xl w-full text-left px-6 md:px-12">
          <h2 className="text-4xl font-bold mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-2">
            <FAQItem 
              question="Is Klick really free?" 
              answer="Yes! Currently, Klick is completely free to use. We built this platform to provide high-quality analytics for everyone without locking essential features behind a paywall."
            />
            <FAQItem 
              question="How accurate is the location tracking?" 
              answer="We use advanced IP geolocation databases that map clicks down to the city level with over 95% accuracy. However, users on VPNs or certain enterprise networks may appear in different locations."
            />
            <FAQItem 
              question="Do my short links expire?" 
              answer="By default, links never expire. However, you can set a custom expiration date for any link, which is perfect for time-sensitive campaigns or flash sales."
            />
            <FAQItem 
              question="Can I edit a link after I create it?" 
              answer="Absolutely. You can log into your dashboard at any time to change the destination URL, update the alias, or modify the expiration date without having to generate a new short link."
            />
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 md:mt-32 mb-20 text-center px-6 md:px-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Ready to start tracking?
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-10 py-5 rounded-full font-bold hover:bg-ink/80 transition-colors text-lg shadow-2xl hover:-translate-y-1 transform duration-200"
          >
            Create your free account <ArrowRightIcon className="w-6 h-6" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 py-12 text-center text-ink/50 text-sm">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 gap-6 md:gap-0">
          <Logo className="h-5 w-auto" />
          
          <div className="flex gap-6 items-center">
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms of Service</Link>
          </div>

          <div>
            <p>&copy; 2026 Klick. Built by Devtess.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
