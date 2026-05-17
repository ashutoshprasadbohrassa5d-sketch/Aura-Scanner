'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized daily affirmations.
 *
 * - personalizedAffirmation - A function that generates a personalized affirmation based on identified strengths.
 * - PersonalizedAffirmationInput - The input type for the personalizedAffirmation function.
 * - PersonalizedAffirmationOutput - The return type for the personalizedAffirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAffirmationInputSchema = z.object({
  positiveTraits: z
    .array(z.string())
    .describe(
      'A list of positive facial traits or personality strengths identified from the face scan. For example: radiant smile, expressive eyes, confident posture.'
    ),
});
export type PersonalizedAffirmationInput = z.infer<
  typeof PersonalizedAffirmationInputSchema
>;

const PersonalizedAffirmationOutputSchema = z.object({
  affirmation: z.string().optional().describe('A personalized, uplifting daily affirmation.'),
  success: z.boolean().describe('Whether the generation was successful.'),
  errorType: z.string().optional().describe('Type of error if generation failed.'),
});
export type PersonalizedAffirmationOutput = z.infer<
  typeof PersonalizedAffirmationOutputSchema
>;

export async function personalizedAffirmation(
  input: PersonalizedAffirmationInput
): Promise<PersonalizedAffirmationOutput> {
  return personalizedAffirmationFlow(input);
}

const affirmationPrompt = ai.definePrompt({
  name: 'affirmationPrompt',
  input: {schema: PersonalizedAffirmationInputSchema},
  output: {schema: PersonalizedAffirmationOutputSchema},
  prompt: `You are a compassionate AI dedicated to uplifting individuals. Your goal is to generate a personalized, encouraging, and uplifting daily affirmation.
The affirmation should be inspiring and focus on self-worth, inner beauty, and confidence, without directly mentioning physical appearance or specific facial features.
It should be a single, concise statement.

Here are some positive qualities and strengths identified:
{{#each positiveTraits}}- {{this}}
{{/each}}

Based on these, craft a powerful and positive affirmation for the user.`,
});

const personalizedAffirmationFlow = ai.defineFlow(
  {
    name: 'personalizedAffirmationFlow',
    inputSchema: PersonalizedAffirmationInputSchema,
    outputSchema: PersonalizedAffirmationOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await affirmationPrompt(input);
      return { ...output!, success: true };
    } catch (err: any) {
      const isQuota = err.message?.toLowerCase().includes("429") || 
                      err.message?.toLowerCase().includes("quota") || 
                      err.message?.toLowerCase().includes("exhausted");
      
      if (isQuota) {
        return { success: false, errorType: 'QUOTA_EXCEEDED' };
      }
      throw err;
    }
  }
);
