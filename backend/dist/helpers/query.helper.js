export class QueryHelper {
    static parse(query, searchableFields = []) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.max(1, parseInt(query.limit) || 10);
        const skip = (page - 1) * limit;
        const take = limit;
        const sortBy = query.sortBy || 'id';
        const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
        const orderBy = { [sortBy]: sortOrder };
        const where = {};
        // Handle Search
        if (query.search && searchableFields.length > 0) {
            where.OR = searchableFields.map((field) => ({
                [field]: {
                    contains: query.search,
                },
            }));
        }
        // Handle Filtering (exclude page, limit, sortBy, sortOrder, search)
        const excludeKeys = ['page', 'limit', 'sortBy', 'sortOrder', 'search'];
        for (const key in query) {
            if (!excludeKeys.includes(key) && query[key] !== undefined && query[key] !== '') {
                const val = query[key];
                // Auto convert type if applicable
                if (val === 'true') {
                    where[key] = true;
                }
                else if (val === 'false') {
                    where[key] = false;
                }
                else if (!isNaN(Number(val)) && val.trim() !== '') {
                    // If it's a number, convert to bigints or standard numbers
                    where[key] = Number(val);
                }
                else {
                    where[key] = val;
                }
            }
        }
        return {
            prismaOptions: {
                skip,
                take,
                orderBy,
                where,
            },
            pagination: {
                page,
                limit,
            },
        };
    }
}
