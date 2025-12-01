/**
 * Z-Index System
 * 
 * Sistema de jerarquía de capas para mantener consistencia
 * en toda la aplicación y evitar conflictos de overlapping.
 */

export const Z_INDEX = {
    // Base layers
    base: 0,
    behind: -1,

    // Content layers
    content: 1,
    dropdown: 10,

    // Sticky/Fixed elements
    sticky: 20,
    stickyHeader: 25,
    fixed: 30,

    // Overlays
    modalBackdrop: 40,
    modal: 50,
    drawer: 55,

    // Floating UI
    popover: 60,
    toast: 70,
    tooltip: 80,

    // Navigation (always on top)
    navbar: 90,
    mobileMenu: 95,

    // System (accessibility)
    skipLink: 100,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;

/**
 * Helper para obtener el valor de z-index
 * @example getZIndex('navbar') // returns 90
 */
export const getZIndex = (key: ZIndexKey): number => Z_INDEX[key];
