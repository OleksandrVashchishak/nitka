"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DAY_PLAN = void 0;
exports.cloneDefaultDayPlan = cloneDefaultDayPlan;
exports.DEFAULT_DAY_PLAN = [
    { id: 'demo-1', title: 'Пробудження і душ', time: '08:00', durationMin: 45 },
    { id: 'demo-2', title: 'Сніданок', time: '08:45', durationMin: 30 },
    { id: 'demo-3', title: 'Зачіска', time: '09:15', durationMin: 90 },
    { id: 'demo-4', title: 'Макіяж', time: '10:45', durationMin: 75 },
    { id: 'demo-5', title: 'Одягання', time: '12:00', durationMin: 45 },
    { id: 'demo-6', title: 'Фотосесія', time: '13:00', durationMin: 120 },
    { id: 'demo-7', title: 'Церемонія', time: '16:00', durationMin: 60 },
    {
        id: 'demo-8',
        title: 'Святкування на локації',
        time: '17:30',
        durationMin: 360,
    },
];
function cloneDefaultDayPlan() {
    return exports.DEFAULT_DAY_PLAN.map((e) => ({ ...e }));
}
//# sourceMappingURL=day-plan.defaults.js.map