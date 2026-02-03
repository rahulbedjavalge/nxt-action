"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useTheme } from "@/components/ThemeProvider";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-blue-600 dark:text-blue-400">Nxt</span> Action
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
              Contact
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "" : ""}
            </button>
            <Button
              size="sm"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center pt-12 pb-16">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6">
             100% Private - Data in YOUR Google Drive
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Never Forget a<br />
            <span className="text-blue-600 dark:text-blue-400">Follow-Up</span> Again
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A dead-simple personal task manager for people who need to remember 
            to follow up on things. No complex features, just tasks and dates.
          </p>
          <Button
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-lg px-8 py-4"
          >
             Get Started Free
          </Button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Single-user app - Your data stays in your Google Drive
          </p>
        </div>

        {/* Problem Section */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
               The Problem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              You have been there...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                I will reply to this later
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You read an important email, think I will reply tomorrow... 
                and discover it 3 weeks later still in your inbox, unanswered.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                I need to call them back
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Someone asked you to call them next week. You make a mental note. 
                Two weeks later you suddenly remember at 11pm.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Sticky notes everywhere
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You write things on paper, in Notes app, in Slack DMs to yourself... 
                Now you have reminders everywhere and trust none of them.
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
               The Solution
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              One simple place for all your follow-ups
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Add in 5 seconds
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Press + button, type Call John about project, pick tomorrow, done. 
                No categories, no tags, no friction.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Natural dates
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Type tomorrow, next monday, in 3 days, feb 15 - 
                it understands what you mean.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Your data, your Drive
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All your tasks live in Google Drives hidden app folder. 
                No server database. Delete the app = data stays with you.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
               How to Use
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              It is embarrassingly simple
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Sign in with Google
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the button, authorize the app to store data in your Drive. 
                    That is it for setup.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Add a follow-up
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the + button. Type what you need to do, when it is due, 
                    and optionally add notes. Save.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Check your dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    See what is overdue, due today, and coming up. 
                    Mark done or snooze with one click.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Never forget again
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Open the app each morning. See your due tasks. Do them. Repeat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Host Your Own */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                   Host Your Own Copy
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  This is an open-source app. Run it yourself for complete control.
                  Click to see the full setup guide with Google OAuth instructions.
                </p>
              </div>
              <span className="text-3xl ml-4">{showSetup ? "" : "+"}</span>
            </div>
          </button>

          {showSetup && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="space-y-8">
                {/* Step 1 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Clone the Repository
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
git clone https://github.com/rahulbedjavalge/nxt-action.git
cd nxt-action
npm install</pre>
                </div>

                {/* Step 2 - Google Setup */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Set Up Google OAuth (Detailed)
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.1 Create Google Cloud Project</h4>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                        <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.cloud.google.com</a></li>
                        <li>Click the project dropdown then New Project</li>
                        <li>Name it (e.g., NxtAction) then Create</li>
                        <li>Wait for project to be created, then select it</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.2 Enable Google Drive API</h4>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                        <li>Go to APIs and Services then Library</li>
                        <li>Search for Google Drive API</li>
                        <li>Click it then Enable</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.3 Configure OAuth Consent Screen</h4>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                        <li>Go to APIs and Services then OAuth consent screen</li>
                        <li>Select External then Create</li>
                        <li>Fill in App name, User support email, Developer email</li>
                        <li>Click Add or Remove Scopes</li>
                        <li>Search and add: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">../auth/drive.appdata</code></li>
                        <li>Save and continue</li>
                        <li>On Test users page, Add your email as a test user</li>
                        <li>Save and continue then Back to dashboard</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.4 Create OAuth Credentials</h4>
                      <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                        <li>Go to APIs and Services then Credentials</li>
                        <li>Click + Create Credentials then OAuth client ID</li>
                        <li>Application type: Web application</li>
                        <li>Name: NxtAction Web</li>
                        <li>Authorized redirect URIs, Add:</li>
                      </ol>
                      <code className="block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded mt-2 text-sm">
                        http://localhost:3000/api/auth/callback/google
                      </code>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        For production, also add: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">https://yourdomain.com/api/auth/callback/google</code>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.5 Copy Your Credentials</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        After creating, you will see a popup with your Client ID and Client Secret. Copy these for the next step.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Create .env.local File
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Create a file named <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code> in your project root:
                  </p>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">{`# Google OAuth (from step 2)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# NextAuth.js
NEXTAUTH_SECRET=generate-a-random-string-here
NEXTAUTH_URL=http://localhost:3000

# Your email (ONLY this email can log in)
ALLOWED_EMAIL=your@email.com`}</pre>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                    Generate NEXTAUTH_SECRET with: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">openssl rand -base64 32</code>
                  </p>
                </div>

                {/* Step 4 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Run the App
                  </h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">npm run dev</pre>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    Open <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3000</code> and sign in!
                  </p>
                </div>

                {/* Step 5 - Hosting */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                    Deploy to Production (Free Options)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Vercel (Recommended)</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                        <li>- Free hobby tier</li>
                        <li>- Connect GitHub repo</li>
                        <li>- Auto-deploys on push</li>
                        <li>- Add env vars in dashboard</li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Netlify</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                        <li>- Free tier available</li>
                        <li>- Good Next.js support</li>
                        <li>- Easy GitHub integration</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                       <strong>Important:</strong> After deploying, update <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXTAUTH_URL</code> to your production domain 
                      and add <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">https://yourdomain.com/api/auth/callback/google</code> to Google OAuth redirect URIs.
                    </p>
                  </div>
                </div>

                {/* How single user works */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                     How Single-User Login Works
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ALLOWED_EMAIL</code> environment variable restricts who can sign in. 
                    When someone tries to log in with Google, the app checks if their email matches. 
                    If it does not match, they are rejected and see an error. Only the email you set can access the dashboard.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                    This keeps it simple - no user database, no accounts to manage, no admin panel needed. 
                    Just you and your tasks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to never forget a follow-up?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start using Nxt Action in 30 seconds.
          </p>
          <Button
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-lg px-8 py-4"
          >
             Get Started Free
          </Button>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
            <a href="https://github.com/rahulbedjavalge/nxt-action" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">
              GitHub
            </a>
          </div>
          <p>Built with Next.js - Data stored in Google Drive - No tracking</p>
        </footer>
      </main>
    </div>
  );
}
