import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function TermsOfService() {
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
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="prose prose-lg text-ink/80 space-y-8">
          <p>
            Last updated: July 20, 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using Klick, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily use the materials (information or software) on Klick's website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on Klick's website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">3. Prohibited Uses</h2>
            <p>
              You may not use Klick to create short links that redirect to malicious, illegal, or harmful content. This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Phishing sites or malware distribution.</li>
              <li>Spam or bulk unsolicited emails.</li>
              <li>Content that infringes on intellectual property rights.</li>
              <li>Any other activity that violates applicable laws.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to disable any links or suspend any accounts found to be in violation of these rules without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">4. Disclaimer</h2>
            <p>
              The materials on Klick's website are provided on an 'as is' basis. Klick makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">5. Limitations</h2>
            <p>
              In no event shall Klick or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
              or due to business interruption) arising out of the use or inability to use the materials on Klick's website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
