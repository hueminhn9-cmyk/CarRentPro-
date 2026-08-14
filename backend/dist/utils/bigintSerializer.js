import { Prisma } from '@prisma/client';
export const serializeBigInt = (obj) => {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === 'bigint') {
        // If it fits in JavaScript standard number, convert to Number, else keep as string
        const num = Number(obj);
        return Number.isSafeInteger(num) ? num : obj.toString();
    }
    // Handle Prisma Decimal - convert to number
    if (obj instanceof Prisma.Decimal) {
        return Number(obj.toString());
    }
    if (obj instanceof Date)
        return obj;
    if (Array.isArray(obj))
        return obj.map(serializeBigInt);
    if (typeof obj === 'object') {
        // Additional check: if object has Decimal.js internal structure {s, e, d}
        // This handles cases where Decimal might not be detected as instanceof
        if (typeof obj.s === 'number' && typeof obj.e === 'number' && Array.isArray(obj.d) && typeof obj.toFixed === 'function') {
            return Number(obj.toFixed());
        }
        const serialized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                serialized[key] = serializeBigInt(obj[key]);
            }
        }
        return serialized;
    }
    return obj;
};
