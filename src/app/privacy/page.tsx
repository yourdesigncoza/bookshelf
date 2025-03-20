import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Augment Next.js Starter",
  description: "Privacy Policy for Augment Next.js Starter",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              <span className="font-medium">[Your Company Name]</span> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <span className="font-medium">[Your Website Name]</span> (the &ldquo;Service&rdquo;).
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Register for an account</li>
              <li>Fill out a form</li>
              <li>Make a purchase</li>
              <li>Sign up for our newsletter</li>
              <li>Communicate with us</li>
            </ul>
            <p>
              The types of information we may collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Authentication information (username, password)</li>
              <li>Billing information (billing address, payment method details)</li>
              <li>Preferences and settings</li>
              <li>Any other information you choose to provide</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Automatically Collected Information</h2>
            <p>
              When you access our Service, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (type, operating system, browser)</li>
              <li>IP address</li>
              <li>Browsing actions and patterns</li>
              <li>The pages or content you view</li>
              <li>The dates and times of your visits</li>
              <li>Referral sources</li>
            </ul>
            <p>
              We collect this information using cookies, web beacons, and other tracking technologies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Personalize your experience on our Service</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Sharing Your Information</h2>
            <p>
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who perform services on our behalf</li>
              <li>Business partners with whom we jointly offer products or services</li>
              <li>Affiliated companies within our corporate family</li>
              <li>Third parties in connection with a merger, sale, or acquisition</li>
              <li>Law enforcement or other authorities if required by law</li>
            </ul>
            <p>
              We may also share aggregated or de-identified information, which cannot reasonably be used to identify you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Your Choices</h2>
            <p>
              You have several choices regarding the information we collect and how it is used:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account Information: You may update, correct, or delete your account information at any time by logging into your account or contacting us.</li>
              <li>Cookies: Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies.</li>
              <li>Promotional Communications: You may opt out of receiving promotional emails from us by following the instructions in those emails.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Data Security</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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
