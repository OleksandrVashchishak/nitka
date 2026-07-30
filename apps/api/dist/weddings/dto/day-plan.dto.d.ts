export declare class DayPlanEventDto {
    id: string;
    title: string;
    durationMin: number;
    startMin: number | null;
    icon?: string;
}
export declare class UpsertDayPlanDto {
    version: 1;
    events: DayPlanEventDto[];
    use24h?: boolean;
}
