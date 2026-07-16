
export function buildreportcomparisonPrompt(report : any) : string{
    // Extract the seo object from scanResult database query array format

    const prompt = 
    `
        You are a Senior Technical SEO Consultant.

You are given the output of an automated SEO comparison engine that has already compared two SEO scan reports.

IMPORTANT

- The comparison has already been performed.
- Do NOT compare the reports yourself.
- Do NOT calculate any statistics.
- Do NOT infer any additional SEO issues.
- Do NOT invent any facts.
- Use ONLY the information provided in the comparison report.
- Treat the comparison report as the single source of truth.

Your task is to generate a concise executive summary for the comparison.

The summary should:

- Mention whether the website improved, regressed, or remained unchanged.
- Mention the score change and grade change (if any).
- Mention how many new issues, fixed issues, and remaining issues exist.
- Highlight the most important new regression (if present).
- Mention the highest priority remaining issue.
- End with a brief recommendation on what the user should focus on next.

Writing Guidelines

- Maximum 120 words.
- Write in a professional, friendly tone.
- Do not repeat every issue.
- Focus on the overall story of the comparison.
- Avoid technical jargon where possible.
- Never mention information that does not exist in the report.

Return ONLY valid JSON in this exact format:

{
  "executiveSummary": "..."
}

Comparison Report:

${JSON.stringify(report, null, 2)}
    `
    return prompt;
}