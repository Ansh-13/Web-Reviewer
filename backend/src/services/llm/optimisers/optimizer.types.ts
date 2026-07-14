

export interface OptimizerContext {
    issue: {
        id: string;
        title: string;
        message: string;
        recommendation?: string;
        severity: string;
    };

    page: any;
}