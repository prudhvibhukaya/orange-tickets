import BrandLogo from "./components/brand-logo";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Flex Row container to make text match logo height perfectly */}
          <a href="/" className="flex items-center text-xl font-bold tracking-tight text-orange-600 select-none">
            <BrandLogo />
            <span className="leading-none p-0 m-0">RANGE TICKETS</span>
          </a>

          <nav className="flex items-center gap-6 text-sm">
            <a href="/events" className="hover:opacity-60">
              Events
            </a>

            <a href="/login" className="hover:opacity-60">
              Login
            </a>

            <a
              href="/signup"
              className="rounded-full bg-black px-5 py-2.5 text-white hover:opacity-80"
            >
              Sign up
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Berlin · Germany
          </p>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Discover your next night out.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Discover concerts, parties, club nights and experiences.
            Buy your tickets and keep them all in one place.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/events"
              className="rounded-full bg-black px-7 py-3.5 font-medium text-white hover:opacity-80"
            >
              Explore events
            </a>

            <a
              href="/signup"
              className="rounded-full border border-black px-7 py-3.5 font-medium hover:bg-gray-100"
            >
              Create account
            </a>
          </div>
        </div>
      </section>

      {/* Event categories */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Explore
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Find something happening
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Concerts",
              "Club Nights",
              "Parties",
              "Experiences",
            ].map((category) => (
              <div
                key={category}
                className="rounded-2xl border p-8 transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <h3 className="text-xl font-semibold">
                  {category}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Discover upcoming {category.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizer CTA */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              For organizers
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Bring your event to Orange Tickets.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Create events, manage ticket types, track sales and
              handle your guest list from one place.
            </p>

            <a
              href="/signup"
              className="mt-7 inline-block rounded-full bg-black px-6 py-3 font-medium text-white hover:opacity-80"
            >
              Get started
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Orange Tickets</p>

          <p>Berlin · Germany</p>
        </div>
      </footer>
    </main>
  );
}
