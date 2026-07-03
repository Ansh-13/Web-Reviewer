import { SeoRule } from "../seoRule";
import {RuleResult} from "../rules"
import { WebsiteInfo } from "../../types/website-info";
import { hasValue, appropiateLength, isNULL } from "../utilities";
export class TitleRule
    implements SeoRule<WebsiteInfo>
    {
        analyze(data: WebsiteInfo): RuleResult {
            
            let title = data.metadata.title;
            
            if(isNULL(title)){
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
            else if(!hasValue(title!))
            {
                return {
                id: "missing-title",
                category: "Metadata",
                title: "page title is empty",
                passed: false,
                severity: "error",
                score: -10,
                message: "The page contain empty  <title> tag.",
                }
            }
            else if(appropiateLength(title!,60,30)){
                return {
                id: "title-length",
                category: "Metadata",
                title: "Title length",
                severity: "warning",
                passed: false,
                score: -5,
                message: `The title contains ${title!.length} characters. Recommended length is 30–60 characters.`,
                }
            }
            else{
                return {
                id: "title-ok",
                category: "Metadata",
                title: "title-ok",
                passed: true,
                severity: "info",
                score: 0,
                message: "The page title is present and has an optimal length.",
                }
            }
        }
    }