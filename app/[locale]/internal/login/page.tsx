import { redirect } from 'next/navigation';
import { getAdminAccessResult } from '@/app/lib/admin-auth';
import InternalLoginClient from './InternalLoginClient';

export default async function InternalLoginPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ next?: string; error?: string }>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const access = await getAdminAccessResult();

    if (access.status === 'authorized') {
        const nextPath =
            typeof resolvedSearchParams.next === 'string' && resolvedSearchParams.next.startsWith('/')
                ? resolvedSearchParams.next
                : `/${locale}/internal/recepcion`;
        redirect(nextPath);
    }

    return <InternalLoginClient locale={locale} />;
}
