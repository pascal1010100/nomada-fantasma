type RequestMetadata = {
    locale?: string;
    price?: number;
    bookingOptionId?: string;
    bookingOptionName?: string;
};

const META_PATTERN = /^\[\[meta:([a-z_]+)=([^\]]+)\]\]$/;

export function buildRequestMetadataNote(metadata: RequestMetadata): string | null {
    const lines: string[] = [];

    if (metadata.locale) {
        lines.push(`[[meta:locale=${metadata.locale}]]`);
    }

    if (typeof metadata.price === 'number' && Number.isFinite(metadata.price)) {
        lines.push(`[[meta:price=${metadata.price.toFixed(2)}]]`);
    }

    if (metadata.bookingOptionId) {
        lines.push(`[[meta:booking_option_id=${metadata.bookingOptionId.trim()}]]`);
    }

    if (metadata.bookingOptionName) {
        lines.push(`[[meta:booking_option_name=${metadata.bookingOptionName.trim()}]]`);
    }

    return lines.length > 0 ? lines.join('\n') : null;
}

export function parseRequestMetadata(note: string | null | undefined): RequestMetadata {
    const metadata: RequestMetadata = {};
    if (!note) return metadata;

    for (const line of note.split('\n')) {
        const trimmed = line.trim();
        const match = trimmed.match(META_PATTERN);
        if (!match) continue;

        const [, key, value] = match;
        if (key === 'locale') {
            metadata.locale = value;
        }
        if (key === 'price') {
            const parsed = Number.parseFloat(value);
            if (Number.isFinite(parsed)) {
                metadata.price = parsed;
            }
        }
        if (key === 'booking_option_id') {
            metadata.bookingOptionId = value;
        }
        if (key === 'booking_option_name') {
            metadata.bookingOptionName = value;
        }
    }

    return metadata;
}

export function stripRequestMetadata(note: string | null | undefined): string {
    if (!note) return '';

    return note
        .split('\n')
        .filter((line) => !META_PATTERN.test(line.trim()))
        .join('\n')
        .trim();
}
