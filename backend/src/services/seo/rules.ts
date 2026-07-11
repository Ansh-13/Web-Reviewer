export interface RuleResult {
    id: string;
    category: string;
    title: string;
    passed: boolean;
    severity: "info" | "warning" | "error";
    score: number;
    message: string;
    recommendation?: string;
    content:String;
}