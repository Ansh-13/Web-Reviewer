import {CanonicalRule} from "./rules/canonical.rule"
import {TitleRule} from "./rules/title.rule"
import {DescriptionRule} from "./rules/description.rule"
import {HeadingsRule} from "./rules/headings.rule"
import {ImagesRule} from "./rules/images.rule"
import {LinksRule} from "./rules/links.rule"
import {RobotsRule} from "./rules/robots.rule"
import {StructuredDataRule} from "./rules/structuredData.rule"
import {ViewportRule} from "./rules/viewport.rule"
import {HreflangRule} from "./rules/hreflang.rule"
import {SemanticHtmlRule} from "./rules/semanticHtml.rule"
import {ContentMetricsRule} from "./rules/contentMetrics.rule"
import {SocialMetaRule} from "./rules/socialMeta.rule"
import { WebsiteInfo } from "../types/website-info";

export async function seoScore(data : WebsiteInfo){
    const Canonical = new CanonicalRule();
    const Title = new TitleRule();
    const Description = new DescriptionRule();
    const Headings = new HeadingsRule();
    const Images = new ImagesRule();
    const Links = new LinksRule();
    const Robots = new RobotsRule();
    const StructuredData = new StructuredDataRule();
    const Viewport = new ViewportRule();
    const Hreflang = new HreflangRule();
    const SemanticHtml = new SemanticHtmlRule();
    const ContentMetrics = new ContentMetricsRule();
    const SocialMeta = new SocialMetaRule();

    const Canonical_data = Canonical.analyze(data);
    const Title_data = Title.analyze(data);
    const Description_data = Description.analyze(data);
    const Headings_data = Headings.analyze(data);
    const Images_data = Images.analyze(data);
    const Links_data = Links.analyze(data);
    const Robots_data = Robots.analyze(data);
    const StructuredData_data = StructuredData.analyze(data);
    const Viewport_data = Viewport.analyze(data);
    const Hreflang_data = Hreflang.analyze(data);
    const SemanticHtml_data = SemanticHtml.analyze(data);
    const ContentMetrics_data = ContentMetrics.analyze(data);
    const SocialMeta_data = SocialMeta.analyze(data);

    const allResults = [
        Canonical_data,
        Title_data,
        Description_data,
        Headings_data,
        Images_data,
        Links_data,
        Robots_data,
        StructuredData_data,
        Viewport_data,
        Hreflang_data,
        SemanticHtml_data,
        ContentMetrics_data,
        SocialMeta_data,
    ];

    // Group results by severity
    const errors = allResults.filter(r => r.severity === "error" && !r.passed);
    const warnings = allResults.filter(r => r.severity === "warning" && !r.passed);
    const passed = allResults.filter(r => r.passed);
    
    // Score: start at 100, deduct for failures
    const errorPenalty = 10;   // each error costs 10 points
    const warningPenalty = 5;  // each warning costs 5 points
    // const score = Math.max(0, 100 - (errors.length * errorPenalty) - (warnings.length * warningPenalty));
    let score = 0;
    allResults.map( (s) => {
        score += s.score;
    } )

    score = 100 + score;

    // Assign letter grade
    const grade = score >= 90 ? "A"
        : score >= 80 ? "B"
        : score >= 60 ? "C"
        : score >= 40 ? "D"
        : "F";

    return {
        score,
        grade,
        summary: {
            totalChecks: allResults.length,
            passed: passed.length,
            warnings: warnings.length,
            errors: errors.length,
        },
        results: {
            errors,
            warnings,
            passed,
        },
    };
}
