// This file is responsible for saving the stock analysis to a file.
'use server';

/**
 * @fileOverview A flow to save the stock analysis to a file.
 *
 * - saveStockAnalysis - A function that handles saving the stock analysis.
 * - SaveStockAnalysisInput - The input type for the saveStockAnalysis function.
 * - SaveStockAnalysisOutput - The return type for the saveStockAnalysis function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import { saveAnalysis } from '@/services/save-analysis';

const SaveStockAnalysisInputSchema = z.object({
  analysis: z.string().describe('The complete stock analysis in JSON format.'),
});
export type SaveStockAnalysisInput = z.infer<typeof SaveStockAnalysisInputSchema>;

const SaveStockAnalysisOutputSchema = z.object({
  message: z.string().describe('The message indicating the status of saving the analysis.'),
});
export type SaveStockAnalysisOutput = z.infer<typeof SaveStockAnalysisOutputSchema>;

export async function saveStockAnalysis(input: SaveStockAnalysisInput): Promise<SaveStockAnalysisOutput> {
  return saveStockAnalysisFlow(input);
}

const saveStockAnalysisFlow = ai.defineFlow<
  typeof SaveStockAnalysisInputSchema,
  typeof SaveStockAnalysisOutputSchema
>(
  {
    name: 'saveStockAnalysisFlow',
    inputSchema: SaveStockAnalysisInputSchema,
    outputSchema: SaveStockAnalysisOutputSchema,
  },
  async input => {
    const message = await saveAnalysis(input.analysis);
    return { message };
  }
);
