import { prisma } from '../config/prisma.js';
export class AuditService {
    static async log(params) {
        try {
            await prisma.audit_logs.create({
                data: {
                    user_id: params.userId || null,
                    action: params.action,
                    entity_name: params.entityName || null,
                    entity_id: params.entityId || null,
                    old_values: params.oldValues ? JSON.parse(JSON.stringify(params.oldValues)) : null,
                    new_values: params.newValues ? JSON.parse(JSON.stringify(params.newValues)) : null,
                    ip_address: params.ipAddress || null,
                    user_agent: params.userAgent || null,
                },
            });
        }
        catch (error) {
            // Console error log but do not crash the request thread if logging fails
            console.error('Lỗi ghi audit log:', error);
        }
    }
}
