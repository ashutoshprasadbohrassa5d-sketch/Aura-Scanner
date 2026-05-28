'use server';
/**
 * @fileOverview An AI agent that scans a person's face to identify unique facial traits
 * and calculate a resonance score, with context for gender identity.
 *
 * - etherealScan - A function that handles the facial trait analysis process.
 * - EtherealScanInput - The input type for the etherealScan function.
 * - EtherealScanOutput - The return type for the etherealScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EtherealScanInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  gender: z.string().describe('The user\'s identified gender essence (e.g., "Male", "Female", "Non-binary/Other").'),
});
export type EtherealScanInput = z.infer<typeof EtherealScanInputSchema>;

const EtherealScanOutputSchema = z.object({
  analysis: z.array(
    z.object({
      trait: z.string().describe('The identified facial trait (e.g., "Eyes," "Smile," "Jawline").'),
      description: z
        .string()
        .describe('A poetic and uplifting description of the unique facial trait.'),
    })
  ).optional(),
  overallImpression: z
    .string()
    .optional()
    .describe('An overall poetic and uplifting impression of the facial harmony and radiance.'),
  resonanceScore: z.number().min(0).max(110).optional().describe('A final resonance percentage score representing spiritual and aesthetic harmony. If the harmony is absolute, return 100.'),
  success: z.boolean().describe('Whether the scan was successful.'),
  errorType: z.string().optional().describe('Type of error if scan failed (e.g., "QUOTA_EXCEEDED").'),
});
export type EtherealScanOutput = z.infer<typeof EtherealScanOutputSchema>;

export async function etherealScan(input: EtherealScanInput): Promise<EtherealScanOutput> {
  return etherealScanFlow(input);
}

const etherealScanPrompt = ai.definePrompt({
  name: 'etherealScanPrompt',
  input: {schema: EtherealScanInputSchema},
  output: {schema: EtherealScanOutputSchema},
  config: {
    safetySettings: [
      {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE'},
    ],
  },
  prompt: `You are an AI dedicated to recognizing the innate beauty and unique radiance in every individual's face. 
The user identifies their essence as: {{{gender}}}.

Your purpose is to provide poetic, uplifting descriptions of facial traits and calculate a "Resonance Score" representing the harmonious spirit of the face. 
Tailor your poetic language to resonate deeply with their identified gender essence.

Analyze the provided facial image and identify key unique features. For each feature, craft a beautiful, poetic description. Calculate a resonanceScore between 0 and 100 based on the balance and radiance you perceive. 
If the subject shows exceptional spiritual clarity, symmetry, or "sparkle," do not hesitate to award a perfect score of 100.

Photo: {{media url=photoDataUri}}`,
});

const etherealScanFlow = ai.defineFlow(
  {
    name: 'etherealScanFlow',
    inputSchema: EtherealScanInputSchema,
    outputSchema: EtherealScanOutputSchema,
  },
  async input => {
    try {
      const {output} = await etherealScanPrompt(input);
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
