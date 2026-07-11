import { RuleResult } from "../seo/rules";

export interface AIContext {
    score: number;
    grade: string;

    page: {
        url: string;
        title: string | null;
        description: string | null;
        h1: string | null;
    };

    summary: {
        errors: number;
        warnings: number;
        passed: number;
    };

    issues: RuleResult[];
}