'use server';
/**
 * @fileOverview A GenAI agent that generates a soft, colorful 'aura' around a user's portrait
 * based on their detected emotional expression.
 *
 * - generateAura - A function that handles the aura generation process.
 * - AuraGenerationInput - The input type for the generateAura function.
 * - AuraGenerationOutput - The return type for the generateAura function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AuraGenerationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  emotionalExpression: z
    .string()
    .describe('The detected emotional expression of the person in the photo (e.g., "joyful", "calm", "energetic").'),
});
export type AuraGenerationInput = z.infer<typeof AuraGenerationInputSchema>;

const AuraGenerationOutputSchema = z.object({
  auraImageUri: z.string().optional().describe('A data URI of the user\'s portrait with a generated aura.'),
  success: z.boolean().describe('Whether the generation was successful.'),
  errorType: z.string().optional().describe('Type of error if generation failed.'),
});
export type AuraGenerationOutput = z.infer<typeof AuraGenerationOutputSchema>;

export async function generateAura(input: AuraGenerationInput): Promise<AuraGenerationOutput> {
  return auraGenerationFlow(input);
}

const auraGenerationPrompt = ai.definePrompt({
  name: 'auraGenerationPrompt',
  model: 'googleai/gemini-2.5-flash-image',
  input: { schema: AuraGenerationInputSchema },
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `Generate a soft, colorful, and ethereal aura around the person in this portrait: {{media url=photoDataUri}}. 
The aura should reflect a feeling of {{{emotionalExpression}}}. 
Do not alter the person's face or features. 
The aura should be gentle, radiating outwards, and aesthetically pleasing. 
Ensure the output is an image of the original portrait with the new aura.`,
});

const auraGenerationFlow = ai.defineFlow(
  {
    name: 'auraGenerationFlow',
    inputSchema: AuraGenerationInputSchema,
    outputSchema: AuraGenerationOutputSchema,
  },
  async (input) => {
    try {
      const response = await auraGenerationPrompt(input);
      
      if (!response.media) {
        return { success: false, errorType: 'NO_MEDIA' };
      }
      
      return { auraImageUri: response.media.url, success: true };
    } catch (err: any) {
      const isQuota = err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("exhausted");
      if (isQuota) {
        return { success: false, errorType: 'QUOTA_EXCEEDED' };
      }
      // Re-throw unexpected errors to be caught by the client caller
      throw err;
    }
  }
);
