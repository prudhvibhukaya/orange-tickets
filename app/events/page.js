"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BrandLogo from "../components/brand-logo";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, slug, description, venue_name, venue_address, start_datetime, timezone, cover_image_url"
        )
        .eq("status", "published")
        .gte("start_datetime", new Date().toISOString())
        .order("start_datetime", { ascending: true });

      if (error) {
        setError("We couldn't load events. Please try again.");
      } else {
        setEvents(data ?? []);
      }

      setLoading(false);
    }

    loadEvents();
  }, []);

  function formatDate(date, timezone) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone || "Europe/Berlin",
    }).format(new Date(date));
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navigation Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Synchronized Branding Logo and Text */}
          <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-orange-600 select-none">
            <BrandLogo />
            <span className="leading-none p-0 m-0">RANGE TICKETS</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link href="/events" className="font-semibold text-orange-600">
              Events
            </Link>
            <Link href="/login" className="hover:opacity-60">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Events Stream Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Discover
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
          Upcoming events
        </h1>

        <p className="mt-5 max-w-2xl leading-7 text-gray-600">
          Find your next concert, party, club night or experience.
          Your next night out starts here.
        </p>

        {loading && (
          <p className="mt-12 text-gray-500" role="status">
            Loading events...
          </p>
        )}

        {error && (
          <div className="mt-12 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State Framework */}
        {!loading && !error && events.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed p-10 text-center">
            <h2 className="text-xl font-semibold">
              Nothing scheduled just yet
            </h2>
            <p className="mt-3 text-gray-600">
              Check back soon to discover upcoming events.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:opacity-80 transition-opacity"
            >
              Back to homepage
            </Link>
          </div>
        )}

        {/* Dynamic Card Generation Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border transition hover:-translate-y-1 hover:shadow-md bg-white"
              >
                {event.cover_image_url ? (
                  <img
                    src={event.cover_image_url}
                    alt=""
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-50 border-b">
                    <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">
                       Orange Tickets
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <p className="text-sm font-medium text-orange-600">
                    {formatDate(event.start_datetime, event.timezone)}
                  </p>

                  <h2 className="mt-3 text-xl font-bold tracking-tight">
                    {event.title}
                  </h2>

                  {event.venue_name && (
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      📍 {event.venue_name}
                    </p>
                  )}

                  {event.venue_address && (
                    <p className="mt-1 text-sm text-gray-500 pl-5">
                      {event.venue_address}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>
                  )}

                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-6 inline-block rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-80 transition-opacity"
                  >
                    View event
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
