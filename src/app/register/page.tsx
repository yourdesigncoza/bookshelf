import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata: Metadata = {
  title: "Register | Augment Next.js Starter",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10 px-4">
      <div className="mx-auto w-full max-w-[400px] space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-primary"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="rounded-lg border bg-card shadow-sm p-6 space-y-6">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  autoCorrect="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  autoCorrect="off"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-xs leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" fill="#4285F4" />
                <path d="M12.956 16.26c-1.788 0-3.195-.76-4.1-2.053l-2.966 2.289c1.77 2.052 4.177 3.225 7.066 3.225 3.927 0 7.302-2.053 8.932-5.28l-3.128-2.053c-.81 1.788-2.599 3.872-5.804 3.872z" fill="#34A853" />
                <path d="M5.956 14.207c-.446-.81-.689-1.72-.689-2.68 0-.96.243-1.87.689-2.68L3 6.56C2.15 8.145 1.664 9.982 1.664 11.527c0 1.545.486 3.382 1.336 4.967l2.956-2.287z" fill="#FBBC05" />
                <path d="M12.956 4.297c1.707 0 3.25.608 4.463 1.787l2.599-2.599C17.952 1.525 15.566 0 12.956 0 8.734 0 5.053 2.599 3 6.56l2.956 2.288c.892-2.72 3.452-4.551 7-4.551z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6256856,22" />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
