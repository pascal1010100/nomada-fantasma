'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            // Simple replacement of locale segment
            // Assumes URL structure is always /[locale]/...
            const segments = pathname.split('/');
            segments[1] = nextLocale;
            router.replace(segments.join('/'));
        });
    };

    return (
        <label className="border-2 rounded">
            <p className="sr-only">Change language</p>
            <select
                defaultValue={locale}
                className="bg-transparent py-2 px-2"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="es" className='text-black'>ES</option>
                <option value="en" className='text-black'>EN</option>
            </select>
        </label>
    );
}
