import { notFound } from 'next/navigation';
import type { Route } from '../lib/types';
import RouteDetailPageClient from './RouteDetailPageClient';
import { getRecommendedToursFromDB, getTourBySlugFromDB, type SupabaseTour } from '@/app/lib/supabase/tours';
import { getActiveTownsFromDB, getTownBySlugFromDB, type TownContentRecord } from '@/app/lib/supabase/towns';
import { getEditorialRouteBySlug } from '../lib/editorialRoutes';
import { atitlanTowns } from '../lago-atitlan/data';

function toDurationDays(durationHours: number | null): number {
  if (!durationHours || durationHours <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(durationHours / 8));
}

function toWifiRating(value?: number | null): Route['wifiRating'] {
  const safeValue = Math.round(value ?? 4);
  if (safeValue <= 1) return 1;
  if (safeValue === 2) return 2;
  if (safeValue === 3) return 3;
  if (safeValue === 4) return 4;
  return 5;
}

function getPriceTier(price: number): Route['priceTier'] {
  if (price >= 900) return 'premium';
  if (price >= 450) return 'standard';
  return 'budget';
}

function mapTownToRoute(town: TownContentRecord): Route {
  const price = 350;

  return {
    id: town.id,
    entityType: 'town',
    slug: town.slug,
    title: town.title,
    summary: town.summary,
    coverImage: town.cover_image,
    region: 'america',
    durationDays: 2,
    groupSize: { min: 1, max: 12 },
    wifiRating: toWifiRating(town.wifi_rating),
    priceTier: getPriceTier(price),
    highlights: town.highlights,
    fullDescription: town.full_description,
    price,
    rating: town.rating,
    vibe: town.vibe,
    isRecommended: town.slug === 'san-pedro',
    isSubRoute: true,
  };
}

function mapTourToRoute(tour: SupabaseTour, town?: TownContentRecord | null): Route {
  const price = tour.price_min ?? tour.price ?? 0;
  const image = tour.cover_image ?? tour.cover_image_url ?? tour.images?.[0] ?? '/images/tours/default-tour.svg';

  return {
    id: tour.id,
    entityType: 'tour',
    slug: tour.slug,
    title: tour.title,
    summary: tour.description ?? '',
    coverImage: image,
    region: 'america',
    durationDays: toDurationDays(tour.duration_hours),
    groupSize: {
      min: tour.min_guests,
      max: tour.max_guests,
    },
    wifiRating: toWifiRating(town?.wifi_rating),
    priceTier: getPriceTier(price),
    highlights: tour.highlights ?? [],
    fullDescription: tour.full_description ?? tour.description ?? '',
    price,
    rating: tour.rating ?? 5,
    vibe: town?.vibe ?? tour.category ?? undefined,
  };
}

function buildTownGuides(towns: TownContentRecord[]) {
  const allGuides = towns.flatMap((town) => {
    const currentGuides = town.guides.length > 0
      ? town.guides
      : (atitlanTowns.find((legacyTown) => legacyTown.slug === town.slug)?.guides.map((guide) => ({
          name: guide.name,
          contact: guide.contact,
          languages: guide.languages,
          tours: guide.specialties,
        })) ?? []);

    return currentGuides.map((guide, index) => {
      const legacyGuide =
        atitlanTowns
          .find((legacyTown) => legacyTown.slug === town.slug)
          ?.guides.find(
            (candidate) =>
              candidate.name.toLowerCase() === guide.name.toLowerCase() ||
              candidate.contact === guide.contact
          ) ?? null;

      return {
        id: legacyGuide?.id ?? `${town.slug}-guide-${index}`,
        name: guide.name,
        photo: legacyGuide?.photo ?? '/images/guides/default-avatar.svg',
        rating: legacyGuide?.rating ?? 5,
        reviews: legacyGuide?.reviews ?? 10,
        contact: guide.contact,
        languages: guide.languages,
        tours: guide.tours,
        townName: town.title,
        bio: legacyGuide?.bio ?? 'Guia local independiente disponible para experiencias personalizadas en la zona.',
      };
    });
  });

  // Until guides are migrated to a dedicated catalog, keep the lake page curated
  // and avoid flooding the section with legacy placeholder records.
  return allGuides.slice(0, 1);
}

async function buildRelatedRoutes(currentSlug: string): Promise<Route[]> {
  const relatedTours = await getRecommendedToursFromDB(currentSlug, 3);

  return relatedTours.map((tour) => mapTourToRoute(tour));
}

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const isAtitlanPage = id === 'lago-atitlan' || id === '1';

  if (isAtitlanPage) {
    const atitlanRoute = getEditorialRouteBySlug('lago-atitlan');
    if (!atitlanRoute) {
      notFound();
    }

    const [towns, relatedRoutes] = await Promise.all([
      getActiveTownsFromDB(),
      buildRelatedRoutes(''),
    ]);

    return (
      <RouteDetailPageClient
        route={atitlanRoute}
        isAtitlanPage={true}
        pueblos={towns.map(mapTownToRoute)}
        guides={buildTownGuides(towns)}
        relatedRoutes={relatedRoutes}
        mapHref={`/${locale}/mapa`}
      />
    );
  }

  const editorialRoute = getEditorialRouteBySlug(id);
  if (editorialRoute) {
    return (
      <RouteDetailPageClient
        route={editorialRoute}
        isAtitlanPage={false}
        pueblos={[]}
        guides={[]}
        relatedRoutes={[]}
        mapHref={`/${locale}/mapa`}
      />
    );
  }

  const tour = await getTourBySlugFromDB(id);
  if (!tour) {
    notFound();
  }

  const [town, relatedRoutes] = await Promise.all([
    getTownBySlugFromDB(tour.pueblo_slug),
    buildRelatedRoutes(tour.slug),
  ]);

  return (
    <RouteDetailPageClient
      route={mapTourToRoute(tour, town)}
      isAtitlanPage={false}
      pueblos={[]}
      guides={[]}
      relatedRoutes={relatedRoutes}
      mapHref={`/${locale}/mapa?town=${tour.pueblo_slug}`}
    />
  );
}
