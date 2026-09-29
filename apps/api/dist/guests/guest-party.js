"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countYesCompanions = countYesCompanions;
exports.listCompanionNames = listCompanionNames;
const COMPANIONS_RE = /\bcompanions:(\S+)/;
function parseCompanionRows(notes) {
    const match = notes?.match(COMPANIONS_RE);
    if (!match?.[1])
        return [];
    try {
        const raw = JSON.parse(decodeURIComponent(match[1]));
        if (!Array.isArray(raw))
            return [];
        return raw.filter((item) => !!item && typeof item === 'object');
    }
    catch {
        return [];
    }
}
function countYesCompanions(notes, fallback) {
    const rows = parseCompanionRows(notes);
    if (rows.length > 0) {
        return rows.filter((row) => row.rsvpStatus === 'YES').length;
    }
    if (fallback?.plusOne && fallback.plusOneAttending === true)
        return 1;
    return 0;
}
function listCompanionNames(notes, fallbackName) {
    const match = notes?.match(COMPANIONS_RE);
    if (match?.[1]) {
        try {
            const raw = JSON.parse(decodeURIComponent(match[1]));
            if (Array.isArray(raw)) {
                return raw
                    .map((item) => {
                    if (!item || typeof item !== 'object')
                        return null;
                    const row = item;
                    const name = typeof row.name === 'string' ? row.name.trim() : '';
                    if (!name)
                        return null;
                    return {
                        name,
                        isChild: Boolean(row.isChild),
                        rsvpStatus: typeof row.rsvpStatus === 'string' ? row.rsvpStatus : 'PENDING',
                    };
                })
                    .filter((row) => row !== null);
            }
        }
        catch {
        }
    }
    if (fallbackName?.trim()) {
        return [
            {
                name: fallbackName.trim(),
                isChild: false,
                rsvpStatus: 'PENDING',
            },
        ];
    }
    return [];
}
//# sourceMappingURL=guest-party.js.map