import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-ink">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="font-display text-sm text-signal">&gt; initializing judge...</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-paper sm:text-6xl">
            Ship code. Get judged.
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-paper/70 sm:text-xl">
            Solve real problems, run them in an isolated sandbox, and get judged in milliseconds.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/problems"
              className="inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 font-sans font-semibold text-ink transition-colors hover:bg-signal-dark"
            >
              Start Solving
            </Link>
            <Link
              to="/problems"
              className="inline-flex items-center justify-center rounded-full border border-paper/20 px-6 py-3 font-sans font-semibold text-paper transition-colors hover:border-signal"
            >
              Explore Problems
            </Link>
          </div>

          <div className="mt-8 inline-flex items-center rounded-full border border-signal px-3 py-1 font-display text-xs uppercase tracking-widest text-signal">
            ACCEPTED · 12ms
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-lg text-paper">Docker Sandboxed Execution</h2>
            <p className="mt-3 font-sans text-sm leading-6 text-paper/60">
              Every submission runs in an isolated container for consistent, secure execution.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-lg text-paper">Multi-Language Support</h2>
            <p className="mt-3 font-sans text-sm leading-6 text-paper/60">
              Write solutions in C, C++, Java, or Python without changing your workflow.
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-lg text-paper">Real-Time Judging</h2>
            <p className="mt-3 font-sans text-sm leading-6 text-paper/60">
              Get fast verdicts and feedback so you can iterate with less waiting.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
