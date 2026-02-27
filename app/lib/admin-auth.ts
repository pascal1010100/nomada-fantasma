import logger from '@/app/lib/logger';

export function isAdminRequestAuthorized(request: Request): boolean {
    const adminToken = process.env.ADMIN_API_TOKEN;
    if (!adminToken) {
        logger.error('ADMIN_API_TOKEN is not configured');
        return false;
    }

    const requestToken = request.headers.get('x-admin-token');
    return requestToken === adminToken;
}
