import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BrandLogo from "../../components/brand-logo";

export default async function EventPage({ params }) {
  const { slug } = await params;

  const supabase = createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      slug,
      description,
      venue_name,
      venue_address,
      start_datetime,
      end_datetime,
      timezone,
      cover_image_url,
      capacity,
      event_ticket_types (
        id,
        name,
        description,
        price_cents,
        currency,
        capacity,
        sales_start,
        sales_end,
        max_per_order,
        status
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !event) {
    notFound();
  }

  const formatDate = (date, timezone) => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone || "Europe/Berlin",
    }).format(new Date(date));
  };

  const formatPrice = (priceCents, currency) => {
    return new Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(priceCents / 100);
  };

  const ticketTypes =
    event.event_ticket_types?.filter(
      (ticket) => ticket.status === "active"
    ) || [];

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Synchronized Orange Tickets Brand Badge */}
          <Link href="/" className="flex items-center text-xl font-bold tracking-tight text-orange-600 select-none">
            <BrandLogo />
            <span className="leading-none p-0 m-0">RANGE TICKETS</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link href="/events" className="hover:text-orange-600 transition-colors">
              Events
            </Link>
            <Link href="/login" className="hover:text-orange-600 transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Event Hero Area */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link href="/events" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
            ← Back to events
          </Link>

          <div className="mt-8 overflow-hidden rounded-3xl">
            {event.cover_image_url ? (
              <img
                src={event.cover_image_url}
                alt=""
                className="h-72 w-full object-cover md:h-96"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-gray-50 border md:h-96">
                <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">
                   Orange Tickets
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Information Split Frame */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              Event
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {event.title}
            </h1>

            <div className="mt-8 space-y-3">
              <div>
                <p className="text-sm text-gray-500">
                  Date & time
                </p>
                <p className="font-medium text-gray-900">
                  {formatDate(event.start_datetime, event.timezone)}
                </p>
              </div>

              {event.venue_name && (
                <div>
                  <p className="text-sm text-gray-500">
                    Venue
                  </p>
                  <p className="font-medium text-gray-900">
                    📍 {event.venue_name}
                  </p>
                  {event.venue_address && (
                    <p className="text-sm text-gray-500 pl-5 mt-0.5">
                      {event.venue_address}
                    </p>
                  )}
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-10 border-t pt-8">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  About this event
                </h2>
                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {event.description}
                </p>
              </div>
            )}
          </div>

          {/* Ticket Purchasing Sidebar Node */}
          <aside className="h-fit rounded-2xl border bg-gray-50/50 p-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight">
              Tickets
            </h2>

            {ticketTypes.length === 0 ? (
              <p className="mt-6 text-sm text-gray-500">
                Tickets are not currently available for this selection.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {ticket.name}
                        </h3>
                        {ticket.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                      <p className="whitespace-nowrap font-bold text-orange-600">
                        {formatPrice(ticket.price_cents, ticket.currency)}
                      </p>
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                      Max {ticket.max_per_order} per order
                    </p>
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={ticketTypes.length === 0}
              className="mt-6 w-full rounded-full bg-black px-6 py-3.5 font-medium text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all"
            >
              Select tickets
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
