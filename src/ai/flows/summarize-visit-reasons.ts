'use server';
/**
 * @fileOverview This file implements a Genkit flow that takes a list of unstructured visitor reasons
 * and provides an AI-generated summary and categorized breakdown of these reasons.
 *
 * - summarizeVisitReasons - A function that processes the visitor reasons.
 * - SummarizeVisitReasonsInput - The input type for the summarizeVisitReasons function.
 * - SummarizeVisitReasonsOutput - The return type for the summarizeVisitReasons function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeVisitReasonsInputSchema = z.object({
  visitReasons: z
    .array(z.string().describe('An individual reason provided by a visitor for using the library.'))
    .describe('A list of raw, unstructured reasons visitors provided for using the library over a selected period.'),
});
export type SummarizeVisitReasonsInput = z.infer<typeof SummarizeVisitReasonsInputSchema>;

const SummarizeVisitReasonsOutputSchema = z.object({
  overallSummary: z
    .string()
    .describe('An overall summary and analysis of the common reasons for library visits, identifying key trends and patterns.'),
  categorizedReasons: z
    .array(
      z.object({
        category: z
          .string()
          .describe('A broad, concise category name for the grouped reasons (e.g., "Research", "Studying", "Computer Use", "Meetings", "Leisure Reading").'),
        reasons: z.array(z.string()).describe('A list of individual, distinct visit reasons that fall under this category.'),
      })
    )
    .describe('A categorized breakdown of visit reasons, grouping similar reasons under a common category.'),
});
export type SummarizeVisitReasonsOutput = z.infer<typeof SummarizeVisitReasonsOutputSchema>;

export async function summarizeVisitReasons(input: SummarizeVisitReasonsInput): Promise<SummarizeVisitReasonsOutput> {
  return summarizeVisitReasonsFlow(input);
}

const summarizeVisitReasonsPrompt = ai.definePrompt({
  name: 'summarizeVisitReasonsPrompt',
  input: { schema: SummarizeVisitReasonsInputSchema },
  output: { schema: SummarizeVisitReasonsOutputSchema },
  prompt: `You are an expert library data analyst. Your task is to analyze a list of raw, unstructured reasons provided by library visitors and to summarize them, identifying common patterns and trends.

Based on the following list of reasons, provide an overall summary and then categorize the reasons into logical groups. Ensure each distinct reason appears in exactly one category. If a reason is very similar to another, group them together.

Raw Visit Reasons:
{{#each visitReasons}}
- {{{this}}}
{{/each}}

Please provide your response in JSON format according to the output schema.`,
});

const summarizeVisitReasonsFlow = ai.defineFlow(
  {
    name: 'summarizeVisitReasonsFlow',
    inputSchema: SummarizeVisitReasonsInputSchema,
    outputSchema: SummarizeVisitReasonsOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeVisitReasonsPrompt(input);
    return output!;
  }
);
