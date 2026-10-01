export declare class DayPlanEventDto {
    id: string;
    title: string;
    time: string;
    durationMin: number;
}
export declare class UpsertDayPlanDto {
    events: DayPlanEventDto[];
}
