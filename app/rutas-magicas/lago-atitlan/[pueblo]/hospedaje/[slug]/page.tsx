import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    ArrowLeft, MapPin, Star, Check, Share2, Heart, Calendar, Users, MessageCircle,
    Wallet, Moon, ChevronLeft, ChevronRight, Wifi, Coffee, Home, Sparkles, X, Compass
} from 'lucide-react';
import { pueblosAtitlan } from '../../../../mocks/atitlanData';
import type { Accommodation } from '../../../../mocks/atitlanData';
import BookingForm from '../../../../components/BookingForm';

import ClientParticles from '../../../../../components/ClientParticles';

interface PageProps {
    params: Promise<{
        pueblo: string;
        slug: string;
    }>;
}

export default async function AccommodationPage({ params }: PageProps) {
    const { pueblo: puebloSlug, slug: accommodationSlug } = await params;

    // Find the town
    const town = pueblosAtitlan.find(t => t.slug === puebloSlug);
    if (!town) notFound();

    // Find the accommodation
    const accommodation = town.accommodations?.find(a => {
        // Create slug from accommodation name
        const accSlug = a.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9-]/g, '');
        return accSlug === accommodationSlug;
    });

    if (!accommodation) notFound();

    const { name, type, priceRange, rating, description, amenities, image, gallery, vibeMetrics, contact, bookingUrl, reviews, pricePerNight } = accommodation;
    const images = gallery && gallery.length > 0 ? gallery : [image];

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
            {/* Global Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 nf-grid opacity-[0.03] dark:opacity-20" />
                <div className="absolute inset-0 nf-vignette opacity-50 dark:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
            </div>

            <div className="fixed inset-0 -z-5 pointer-events-none opacity-50 dark:opacity-100">
                <ClientParticles />
            </div>

            {/* HERO CARD SECTION */}
            <section className="px-4 sm:px-6 pt-6 pb-12">
                <div className="relative mx-auto mt-4 max-w-6xl overflow-hidden rounded-[28px] border bg-card/70 hero-halo min-h-[600px] shadow-2xl group">

                    {/* Background Layers for Card */}
                    <div className="nf-grid pointer-events-none absolute inset-0 z-0 opacity-30" />
                    <div className="nf-vignette pointer-events-none absolute inset-0 z-10" />

                    {/* Main Image as Background */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={images[0]}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                        />
                        {/* Gradient Overlays for Text Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Navigation (Inside Card) */}
                    <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-start">
                        <Link
                            href={`/rutas-magicas/lago-atitlan/${puebloSlug}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Volver</span>
                        </Link>
                        <div className="flex gap-2">
                            <button className="p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all text-white">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all text-white">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-40">
                        <div className="max-w-4xl">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20 shadow-sm backdrop-blur-md">
                                    <span className="relative flex h-2 w-2 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <span className="text-primary font-semibold tracking-wide uppercase text-xs">{type}</span>
                                </div>
                                <div className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-accent/20 shadow-sm backdrop-blur-md">
                                    <MapPin className="w-3 h-3 mr-2 text-accent" />
                                    <span className="text-accent font-semibold tracking-wide uppercase text-xs">{town.title}</span>
                                </div>
                            </div>

                            {/* Title - EXACT Brand Gradient (Animated) */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                                <span className="block font-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] drop-shadow-lg">
                                    {name}
                                </span>
                            </h1>

                            {/* Rating & Price */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-lg border-l-4 border-primary pl-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                        ))}
                                    </div>
                                    <span className="font-bold text-white text-xl">5.0</span>
                                </div>
                                <p className="text-gray-300 max-w-lg text-base leading-relaxed font-medium">
                                    Una experiencia única en el corazón de {town.title}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 pb-24 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Vibe Metrics */}
                        {vibeMetrics && (
                            <VibeMetrics metrics={vibeMetrics} />
                        )}

                        {/* Description */}
                        <section className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display text-foreground">
                                <span className="w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></span>
                                Sobre este lugar
                            </h2>
                            <p className="text-muted-foreground leading-loose font-light tracking-wide">{description}</p>
                        </section>

                        {/* Elite Amenities Grid */}
                        <section>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-display text-foreground">
                                <span className="w-8 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></span>
                                Amenidades Premium
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center gap-3 p-4 rounded-2xl card-glass hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 bg-card/40"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-primary/80">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews */}
                        {reviews && reviews.length > 0 && (
                            <ReviewsSection reviews={reviews} />
                        )}
                    </div>

                    {/* Right Column - Booking Widget (Sticky) */}
                    <div className="lg:col-span-1">
                        <BookingWidget
                            accommodation={accommodation}
                            contact={contact}
                            bookingUrl={bookingUrl}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Brand-Aligned Vibe Metrics
function VibeMetrics({ metrics }: { metrics: any }) {
    return (
        <section className="py-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight font-display">
                    Vibe Analysis
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(metrics).map(([key, value]) => (
                    <div
                        key={key}
                        className="group relative p-4 rounded-2xl card-glass hover:border-primary/50 transition-all duration-500 overflow-hidden bg-card/40"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
                                    {key}
                                </span>
                                <span className="text-xl font-black text-foreground tabular-nums">
                                    {value as number}
                                </span>
                            </div>

                            {/* Brand Gradient Bar */}
                            <div className="flex gap-1 h-1">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-full transition-all duration-300 ${i < (value as number)
                                            ? 'bg-gradient-to-t from-primary to-accent shadow-[0_0_8px_rgba(var(--primary),0.5)]'
                                            : 'bg-muted/20'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Reviews Section
function ReviewsSection({ reviews }: { reviews: any[] }) {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-display text-foreground">
                <span className="w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]"></span>
                Reseñas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-6 rounded-2xl card-glass hover:bg-card/60 transition-all duration-300 bg-card/40">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">{review.user}</p>
                                    <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed italic">"{review.comment}"</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Brand-Aligned Booking Widget
function BookingWidget({ accommodation, contact, bookingUrl }: {
    accommodation: Accommodation;
    contact?: string;
    bookingUrl?: string;
}) {
    return (
        <div className="sticky top-28">
            <div className="relative p-1 rounded-[24px] bg-gradient-to-b from-border/50 to-border/20 backdrop-blur-xl shadow-xl">
                <div className="bg-card/80 dark:bg-[#0a0a0f]/80 rounded-[20px] p-6 border border-white/5 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 blur-[50px] pointer-events-none" />

                    <div className="relative z-10">
                        <BookingForm
                            pricePerNight={accommodation.pricePerNight}
                            contact={contact}
                            bookingUrl={bookingUrl}
                            accommodationName={accommodation.name}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
