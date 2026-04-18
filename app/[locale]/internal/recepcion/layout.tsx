import { redirect } from 'next/navigation';
import { getAdminAccessResult } from '@/app/lib/admin-auth';

export default async function RecepcionLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const access = await getAdminAccessResult();

    if (access.status === 'authorized') {
        return children;
    }

    const nextPath = encodeURIComponent(`/${locale}/internal/recepcion`);
    const error = access.status === 'forbidden' ? 'not-allowed' : 'auth-required';
    redirect(`/${locale}/internal/login?next=${nextPath}&error=${error}`);
}
