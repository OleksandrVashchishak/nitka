export type AuthUser = {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
