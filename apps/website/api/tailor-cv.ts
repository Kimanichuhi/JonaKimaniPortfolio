import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const TailoredCvSchema = z.object({
  summary: z.string(),
  matchedKeywords: z.array(z.string()),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      achievements: z.array(z.string()),
    })
  ),
  skills: z.array(z.string()),
});

type TailoredCv = z.infer<typeof TailoredCvSchema>;

interface ResumeInput {
  summary: string;
  experience: { title: string; company: string; duration: string; achievements: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: string[];
  skills: string[];
  awards: string[];
}

const MAX_JOB_DESCRIPTION_LENGTH = 20000;

const SYSTEM_PROMPT =
  "You tailor a professional CV/resume to a specific job description. You only reorder, select, " +
  "and lightly reword content that is already present in the candidate's real resume data supplied " +
  'below — never invent employers, titles, dates, or achievements that are not grounded in that ' +
  "resume. Rewrite the professional summary and reword achievement bullets so they foreground " +
  "relevant experience and echo the job description's language and keywords, reorder experience " +
  'entries by relevance to the job description, and select the most relevant subset of skills ' +
  '(ordered by relevance). Keep every achievement truthful to the source resume — do not fabricate ' +
  'metrics or responsibilities.';

function buildUserContent(jobDescription: string, resume: ResumeInput): string {
  return `Job description:\n${jobDescription}\n\nCandidate resume data (JSON):\n${JSON.stringify(resume)}`;
}

async function tailorWithAnthropic(jobDescription: string, resume: ResumeInput): Promise<TailoredCv> {
  const anthropic = new Anthropic();
  const response = await anthropic.messages.parse({
    model: 'claude-opus-4-8',
    max_tokens: 8000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: zodOutputFormat(TailoredCvSchema),
    },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserContent(jobDescription, resume) }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Anthropic declined the request');
  }
  if (!response.parsed_output) {
    throw new Error('Anthropic returned no parsed output');
  }
  return response.parsed_output;
}

async function tailorWithOpenAI(jobDescription: string, resume: ResumeInput): Promise<TailoredCv> {
  const openai = new OpenAI();
  const completion = await openai.chat.completions.parse({
    model: 'gpt-5.5',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserContent(jobDescription, resume) },
    ],
    response_format: zodResponseFormat(TailoredCvSchema, 'tailored_cv'),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error('OpenAI returned no parsed output');
  }
  return parsed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: 'Missing authorization' });
    return;
  }
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }

  const { jobDescription, resume } = (req.body ?? {}) as { jobDescription?: string; resume?: ResumeInput };

  if (!jobDescription?.trim() || !resume) {
    res.status(400).json({ error: 'jobDescription and resume are required' });
    return;
  }
  if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    res.status(400).json({ error: 'Job description is too long' });
    return;
  }

  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (!hasAnthropic && !hasOpenAI) {
    res.status(500).json({ error: 'No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.' });
    return;
  }

  let result: TailoredCv | undefined;
  let provider: 'anthropic' | 'openai' | undefined;

  if (hasAnthropic) {
    try {
      result = await tailorWithAnthropic(jobDescription, resume);
      provider = 'anthropic';
    } catch (err) {
      console.error('tailor-cv: Anthropic failed, falling back to OpenAI if available', err);
    }
  }

  if (!result && hasOpenAI) {
    try {
      result = await tailorWithOpenAI(jobDescription, resume);
      provider = 'openai';
    } catch (err) {
      console.error('tailor-cv: OpenAI fallback failed', err);
    }
  }

  if (!result || !provider) {
    res.status(502).json({ error: 'Failed to generate tailored CV. Please try again.' });
    return;
  }

  res.status(200).json({ ...result, provider });
}
