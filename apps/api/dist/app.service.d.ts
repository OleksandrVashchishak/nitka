export declare class AppService {
    getHealth(): {
        status: string;
        service: string;
        revision: string;
        features: {
            content: boolean;
            guests: boolean;
            budget: boolean;
        };
        timestamp: string;
    };
}
