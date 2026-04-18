import { NextResponse } from 'next/server';
import { getAdminAccessResult } from '@/app/lib/admin-auth';

export async function GET(request: Request) {
    const access = await getAdminAccessResult(request);

    if (access.status === 'unauthenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (access.status === 'forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
        success: true,
        user: {
            email: access.context.email,
            displayName: access.context.displayName,
            actor: access.context.actor,
            role: access.context.role,
            source: access.context.source,
        },
    });
}
