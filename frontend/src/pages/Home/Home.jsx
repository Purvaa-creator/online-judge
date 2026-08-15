import { Link } from "react-router-dom";
import { Card } from "../..//components/ui/SharedComponents.jsx";

function Home() {
  return (
    <div className="bg-transparent">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-4xl">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-accent-primary">&gt; initializing judge...</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
            Ship code. Get judged.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
            Solve real problems, run them in an isolated sandbox, and get judged in milliseconds.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/problems"
              className="inline-flex items-center justify-center rounded-full bg-accent-primary px-6 py-3 font-medium text-white transition hover:bg-accent-primary-hover"
            >
              Start Solving
            </Link>
            <Link
              to="/problems"
              className="inline-flex items-center justify-center rounded-full border border-border-subtle/80 px-6 py-3 font-medium text-text-primary transition hover:border-accent-primary hover:text-accent-primary"
            >
              Explore Problems
            </Link>
          </div>

          <div className="mt-8 inline-flex items-center rounded-full border border-accent-primary/30 bg-accent-primary/10 px-3 py-1 font-display text-xs uppercase tracking-[0.3em] text-accent-primary">
            ACCEPTED · 12ms
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <h2 className="font-display text-lg text-text-primary">Docker Sandboxed Execution</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Every submission runs in an isolated container for consistent, secure execution.
            </p>
          </Card>

          <Card>
            <h2 className="font-display text-lg text-text-primary">Multi-Language Support</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Write solutions in C, C++, Java, or Python without changing your workflow.
            </p>
          </Card>

          <Card>
            <h2 className="font-display text-lg text-text-primary">Real-Time Judging</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Get fast verdicts and feedback so you can iterate with less waiting.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Home;
