import {WebsiteInfo} from "../../types/website-info"
import { SeoRule } from "../seoRule"
import { RuleResult } from "../rules"

export class Description
    implements SeoRule<WebsiteInfo>  {
        analyze(data: WebsiteInfo): RuleResult {
            return {
                id: "missing-title",
                category: "Metadata",
                title: "Missing page title",
                passed: false,
                severity: "error",
                score: -10,
                message: "The page does not contain a <title> tag.",
                }
        }
    }
