/**
 * Represents a summary from Wikipedia.
 */
export interface WikiSummary {
  /**
   * A short summary from the wikipedia article.
   */
  summary: string;
}

/**
 * Asynchronously retrieves a summary from Wikipedia for a given query.
 *
 * @param query The search query.
 * @returns A promise that resolves to a WikiSummary object containing summary.
 */
export async function getWikiSummary(query: string): Promise<WikiSummary> {
  // TODO: Implement this by calling an API.

  return {
    summary: 'The query was about a notable topic.',
  };
}
