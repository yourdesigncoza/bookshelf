import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Augment Next.js Starter",
  description: "Terms of Service for Augment Next.js Starter",
};

export default function TermsPage() {
  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            &larr; Back to home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to <span className="font-medium">[Your Website Name]</span>. By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Definitions</h2>
            <p>
              <strong>Service</strong> refers to the website operated by <span className="font-medium">[Your Company Name]</span>.
            </p>
            <p>
              <strong>User</strong> refers to the individual accessing or using the Service.
            </p>
            <p>
              <strong>Content</strong> refers to text, images, videos, audio, and all other forms of data or communication posted on or transmitted through the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of <span className="font-medium">[Your Company Name]</span> and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of <span className="font-medium">[Your Company Name]</span>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. User Content</h2>
            <p>
              By posting content to the Service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
            </p>
            <p>
              You agree that this license includes the right for us to make your content available to other users of the Service, who may also use your content subject to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Prohibited Uses</h2>
            <p>
              You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any &ldquo;junk mail&rdquo;, &ldquo;chain letter,&rdquo; &ldquo;spam,&rdquo; or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
            <p>
              In no event shall <span className="font-medium">[Your Company Name]</span>, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium">
              [Your Contact Email]<br />
              [Your Company Name]<br />
              [Your Company Address]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
