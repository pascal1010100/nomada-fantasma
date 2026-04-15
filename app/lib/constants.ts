/**
 * Global application constants
 * 
 * Centralized contact information and configuration values.
 */

export const CONTACT_INFO = {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50242900009',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hola@nomadafantasma.com',
    whatsappLink: `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50242900009').replace(/\D/g, '')}`,
};

export const PAYMENT_METHODS = {
    bank: {
        name: process.env.BANK_BANK_NAME || 'Banrural',
        accountNumber: process.env.BANK_ACCOUNT_NUMBER || '4093219169',
        accountName: process.env.BANK_ACCOUNT_NAME || 'José Manuel Aguilar Cruz',
        currency: process.env.BANK_CURRENCY || 'GTQ',
    }
};
