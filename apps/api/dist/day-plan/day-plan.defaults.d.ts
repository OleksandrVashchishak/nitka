export declare const DEFAULT_DAY_PLAN: readonly [{
    readonly id: "demo-1";
    readonly title: "Пробудження і душ";
    readonly time: "08:00";
    readonly durationMin: 45;
}, {
    readonly id: "demo-2";
    readonly title: "Сніданок";
    readonly time: "08:45";
    readonly durationMin: 30;
}, {
    readonly id: "demo-3";
    readonly title: "Зачіска";
    readonly time: "09:15";
    readonly durationMin: 90;
}, {
    readonly id: "demo-4";
    readonly title: "Макіяж";
    readonly time: "10:45";
    readonly durationMin: 75;
}, {
    readonly id: "demo-5";
    readonly title: "Одягання";
    readonly time: "12:00";
    readonly durationMin: 45;
}, {
    readonly id: "demo-6";
    readonly title: "Фотосесія";
    readonly time: "13:00";
    readonly durationMin: 120;
}, {
    readonly id: "demo-7";
    readonly title: "Церемонія";
    readonly time: "16:00";
    readonly durationMin: 60;
}, {
    readonly id: "demo-8";
    readonly title: "Святкування на локації";
    readonly time: "17:30";
    readonly durationMin: 360;
}];
export type DayPlanEventPayload = {
    id: string;
    title: string;
    time: string;
    durationMin: number;
};
export declare function cloneDefaultDayPlan(): DayPlanEventPayload[];
