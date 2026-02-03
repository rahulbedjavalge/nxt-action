import Link from "next/link";
import { Button } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">About Nxt Action</h1>

      {/* Why Nxt Action Exists */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Why Nxt Action Exists
        </h2>
        <div className="prose prose-gray dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We&apos;ve all been there. You meet someone interesting at an event, connect on LinkedIn,
            have a great conversation... and then life happens. A week goes by. Then two. By the
            time you remember, the momentum is gone and it feels awkward to reach out.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Or maybe you&apos;re job hunting, reaching out to dozens of people. Some respond, some don&apos;t.
            You lose track of who said what, which conversations are active, and what your next
            move should be for each person.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Scattered notes in different apps, forgotten follow-ups, lost context. It adds up to
            missed opportunities and broken connections. Nxt Action was built to solve exactly this.
          </p>
        </div>
      </section>

      {/* The Workflow */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          The Workflow
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-4">
          <p className="text-2xl font-medium text-center text-blue-800 dark:text-blue-300">
            People → Interactions → Next Action
          </p>
        </div>
        <div className="prose prose-gray dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="text-gray-900 dark:text-gray-100">People</strong> are at the center.
            Each person you&apos;re building a relationship with gets their own profile with all the
            context you need: who they are, where they work, how you connected, and any notes
            that help you remember the human behind the name.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            <strong className="text-gray-900 dark:text-gray-100">Interactions</strong> are the
            building blocks of relationships. Every message you send, every call you have, every
            coffee you grab — it all gets logged with dates, channels, and outcomes. Your
            conversation history is always one click away.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-gray-100">Next Action</strong> is the key.
            After every interaction, you decide: what&apos;s my next move and when? This creates a
            simple, powerful system where you always know who needs attention today.
          </p>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          What Makes It Different
        </h2>
        <div className="grid gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Context-First</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Most CRMs are about data entry. Nxt Action is about context. When you open a contact,
              you see their full story — not just fields to fill.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Next Action Focus</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The dashboard shows you exactly who needs attention today. No digging through lists or
              trying to remember. Your next actions surface automatically.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Your Data, Your Storage
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              All your data is stored in your own Google Drive&apos;s hidden app folder. No third-party
              databases, no data brokers, no privacy concerns. It&apos;s your data.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Lightweight & Personal
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              This isn&apos;t Salesforce. It&apos;s a lightweight personal tool designed for individuals, not
              enterprise sales teams. Fast, simple, and focused.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacy</h2>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <div className="prose prose-gray dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Your privacy is not a feature — it&apos;s the foundation. Here&apos;s how we handle your data:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                <strong>No external databases</strong> — All data is stored in your Google Drive&apos;s
                appDataFolder, a hidden folder that only this app can access.
              </li>
              <li>
                <strong>No third parties</strong> — We don&apos;t share, sell, or even see your data.
                It flows directly between your browser and your Google Drive.
              </li>
              <li>
                <strong>You own everything</strong> — Delete the app? Your data stays in your Drive.
                Want to export it? It&apos;s a simple JSON file you can access anytime.
              </li>
              <li>
                <strong>Minimal permissions</strong> — We only request the specific Google Drive
                scope needed for the hidden app folder. We can&apos;t see your regular Drive files.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who It&apos;s For */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Who It&apos;s For
        </h2>
        <div className="prose prose-gray dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Nxt Action is built for individuals who understand that relationships are built one
            follow-up at a time:
          </p>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <strong>Founders</strong> juggling investor outreach, partnership conversations, and
              potential hires
            </li>
            <li>
              <strong>Job seekers</strong> managing dozens of connections during a search, each at
              different stages
            </li>
            <li>
              <strong>Networkers</strong> who meet people at events and want to actually follow
              through on those conversations
            </li>
            <li>
              <strong>Freelancers</strong> keeping track of leads, clients, and potential
              collaborators
            </li>
            <li>
              <strong>Anyone</strong> who&apos;s ever said &quot;I should really follow up with them...&quot; and
              then forgot
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Ready to never lose a follow-up again?
        </p>
        <Link href="/">
          <Button size="lg">Get Started Free</Button>
        </Link>
      </section>
    </div>
  );
}
