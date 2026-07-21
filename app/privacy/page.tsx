import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-ink/60 hover:text-ink transition-colors mb-12"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-lg text-ink/80 space-y-8">
          <p>
            Last updated: July 20, 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">1. Introduction</h2>
            <p>
              Welcome to Klick. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website 
              and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Identity Data:</strong> includes email address, first name, and last name.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services (such as link clicks).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide and maintain our service.</li>
              <li>Notify you about changes to our service.</li>
              <li>Provide customer support.</li>
              <li>Gather analysis or valuable information so that we can improve our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used, or accessed in an unauthorized way, altered, or disclosed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@klick.devtess.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
