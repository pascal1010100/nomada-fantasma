type EventName =
    | 'view_guide'
    | 'contact_guide_whatsapp'
    | 'open_booking_modal'
    | 'complete_booking'
    | 'click_tip'
    | 'view_map_point'
    // Reservation form events
    | 'view_reservation_form'
    | 'start_reservation_form'
    | 'submit_reservation'
    | 'complete_reservation'
    | 'reservation_validation_error'
    | 'reservation_error'
    // General form events
    | 'view_general_booking_form'
    | 'start_general_booking_form'
    | 'submit_general_booking'
    | 'general_booking_error';

interface EventProperties {
    [key: string]: string | number | boolean | undefined;
}

export const trackEvent = (name: EventName, properties?: EventProperties) => {
    // In a real app, this would send data to Google Analytics, Mixpanel, etc.
    // For now, we log to console to verify it works.
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${name}`, properties);
    }

    // Placeholder for future integration
    // window.gtag?.('event', name, properties);
};
