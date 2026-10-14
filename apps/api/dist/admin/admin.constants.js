"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPERADMIN_ACCESS_TTL = exports.SUPERADMIN_ROLE = exports.SUPERADMIN_SUB = void 0;
exports.getSuperadminCredentials = getSuperadminCredentials;
exports.SUPERADMIN_SUB = 'superadmin';
exports.SUPERADMIN_ROLE = 'ADMIN';
exports.SUPERADMIN_ACCESS_TTL = '8h';
function getSuperadminCredentials() {
    const isDev = process.env.NODE_ENV !== 'production';
    const email = (process.env.SUPERADMIN_EMAIL || (isDev ? 'admin' : ''))
        .trim()
        .toLowerCase();
    const password = process.env.SUPERADMIN_PASSWORD || (isDev ? '1234' : '');
    return { email, password };
}
//# sourceMappingURL=admin.constants.js.map