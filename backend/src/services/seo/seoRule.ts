import {RuleResult} from "./rules"

export interface SeoRule<T> {
    analyze(data: T): RuleResult;
}