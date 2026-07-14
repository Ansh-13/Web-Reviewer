import { RuleResult } from "../seo/rules";
export interface OptimizationRequest {

    ruleId: string;

    page: {

        url: string;

        title?: string;

        description?: string;

        h1?: string;

        language?: string;

    };

    issue: RuleResult;
}

export interface OptimizationResponse {

    title: string;

    explanation: string;

    implementation: string;

    code?: string;

}