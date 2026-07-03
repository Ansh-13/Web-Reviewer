export interface WebsiteInfo {
     url: string,
  metadata: {
    title: string | null,
    description: string | null,
    charset: string | null,
    language: string | null,
    viewport: string | null,
    canonical: string | null,
    robots: string | null,
    keywords: string | null,
    author: string | null,
    favicon: string | null,
    metaDescription: { exists: boolean | null, content: string | null}
  },
}