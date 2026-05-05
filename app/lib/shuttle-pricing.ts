export type ShuttleCustomerPriceDetails = {
  price?: number;
  priceText?: string;
  priceBreakdown?: string[];
  priceLabelOverride?: string;
};

export function calculateShuttleTotal(
  unitOrTotalPrice: number | null | undefined,
  passengers: number | null | undefined,
  type: string | null | undefined
): number | null {
  if (typeof unitOrTotalPrice !== 'number' || Number.isNaN(unitOrTotalPrice) || unitOrTotalPrice <= 0) {
    return null;
  }

  const safePassengers = Math.max(1, passengers || 1);
  return type === 'private' ? unitOrTotalPrice : unitOrTotalPrice * safePassengers;
}

export function getShuttleCustomerPriceDetails(
  unitOrTotalPrice: number | undefined,
  passengers: number,
  type: string | null | undefined,
  locale: string
): ShuttleCustomerPriceDetails {
  const total = calculateShuttleTotal(unitOrTotalPrice, passengers, type);
  if (total === null || typeof unitOrTotalPrice !== 'number') return {};

  const isEnglish = locale.startsWith('en');
  const safePassengers = Math.max(1, passengers || 1);
  const isShared = type !== 'private';

  if (isShared && safePassengers > 1) {
    return {
      price: total,
      priceText: isEnglish
        ? `Q${total.toFixed(2)}`
        : `Q${total.toFixed(2)}`,
      priceBreakdown: [
        isEnglish
          ? `Q${unitOrTotalPrice.toFixed(2)} per person x ${safePassengers} passengers`
          : `Q${unitOrTotalPrice.toFixed(2)} por persona x ${safePassengers} pasajeros`,
      ],
      priceLabelOverride: isEnglish ? 'Total to pay' : 'Total a pagar',
    };
  }

  return {
    price: total,
    priceLabelOverride: isEnglish ? 'Total to pay' : 'Total a pagar',
  };
}
