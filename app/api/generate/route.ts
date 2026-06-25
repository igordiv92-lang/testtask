import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/generative-ai';

// Mock templates mapping subject/prompt keywords to high-quality templates
const MOCK_EMAILS: Record<string, Record<string, string>> = {
  default: {
    Professional: `Subject: Follow-up regarding our discussion\n\nDear recipient,\n\nI hope this email finds you well. I am writing to follow up on our recent conversation and verify the next steps for our ongoing initiative.\n\nPlease let me know your availability for a brief call next week to align on these points.\n\nBest regards,\n[Your Name]`,
    Casual: `Subject: Quick check-in!\n\nHey there,\n\nHope you're having a great week! Just wanted to follow up on our chat the other day and see if you had any updates.\n\nLet's grab a coffee or jump on a quick call sometime next week to catch up.\n\nTalk soon,\n[Your Name]`,
    Bold: `Subject: Let's push this forward\n\nHi,\n\nI'm following up to make sure we keep moving on our recent plans. Delaying will impact our timeline, so let's lock down the details ASAP.\n\nLet me know when you can meet next week.\n\nThanks,\n[Your Name]`,
    Persuasive: `Subject: Unlocking value for your team\n\nDear partner,\n\nGiven our recent conversation, I am confident that aligning on our next steps will immediately streamline your team's workflow and boost efficiency.\n\nLet's set up 10 minutes next week to map out a clear path forward together. When works best for you?\n\nSincerely,\n[Your Name]`,
    Apologetic: `Subject: Apology for the delay\n\nDear recipient,\n\nI sincerely apologize for the delay in following up after our recent conversation. I appreciate your patience as we finalize the next stages of our project.\n\nI would love to reconnect next week to ensure we are fully aligned. Please let me know your availability.\n\nWarm regards,\n[Your Name]`,
    Humorous: `Subject: Ground Control to Major Tom... follow up!\n\nHey,\n\nLegend says that if you wait long enough, emails write themselves. Sadly, my keyboard didn't get the memo, so here I am checking in on our last talk!\n\nLet's chat next week before we both get sucked into another calendar black hole.\n\nCheers,\n[Your Name]`
  },
  meeting: {
    Professional: `Subject: Scheduling: Project Alignment Meeting\n\nDear Team,\n\nI would like to propose a meeting to discuss the project status and align on deliverables. Please share your availability for a 30-minute sync next week.\n\nBest regards,\n[Your Name]`,
    Casual: `Subject: Quick sync next week?\n\nHey everyone,\n\nLet's get together next week to chat about the project. Should only take about 30 minutes. Let me know what times work for you!\n\nCheers,\n[Your Name]`,
    Bold: `Subject: Sync needed: Project deliverables\n\nTeam,\n\nWe need to align on deliverables immediately to avoid project delays. Please clear 30 minutes next week for a sync.\n\nThanks,\n[Your Name]`
  },
  outreach: {
    Professional: `Subject: Potential Collaboration: VibeMail AI\n\nDear Partner,\n\nI hope you are well. I am reaching out to explore potential synergies between our platforms. I believe a collaboration could offer substantial value to our respective client bases.\n\nAre you available for a brief introductory call next Tuesday?\n\nSincerely,\n[Your Name]`,
    Casual: `Subject: Collab idea!\n\nHey,\n\nHope things are good! I came across your profile and thought it'd be cool to connect. I see some great ways we could collaborate and build something neat together.\n\nLet me know if you're free for a quick chat next week!\n\nBest,\n[Your Name]`,
    Bold: `Subject: Partnership Proposal: Let's team up\n\nHi,\n\nI see a direct opportunity for us to drive mutual growth by partnering up. Let's get on a call next week and see what we can make happen.\n\nLet me know your best times.\n\nThanks,\n[Your Name]`
  }
};

export async function POST(req: Request) {
  try {
    const { prompt, tone, length } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Real API generation using Gemini SDK
      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemPrompt = `You are a professional email writing assistant. Write an email draft based on the user's prompt.
Tone: ${tone || 'Professional'}
Length constraint: ${length || 'Medium'} (short is under 100 words, medium is 100-250 words, long is 250+ words).
Do NOT output any markdown formatting, preambles, or conversational commentary. Just output the email subject line (starting with 'Subject:') and the body.`;

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `Prompt: ${prompt}\n\nSystem Instructions:\n${systemPrompt}` }] }],
      });

      const text = response.response.text();
      return NextResponse.json({ result: text });
    } else {
      // Fallback: Custom Mock Template Generator
      await new Promise((resolve) => setTimeout(resolve, 1200)); // synthetic latency

      const promptLower = prompt.toLowerCase();
      let category = 'default';
      if (promptLower.includes('meeting') || promptLower.includes('schedule') || promptLower.includes('sync') || promptLower.includes('call')) {
        category = 'meeting';
      } else if (promptLower.includes('outreach') || promptLower.includes('collab') || promptLower.includes('partner') || promptLower.includes('sale')) {
        category = 'outreach';
      }

      const categoryTemplates = MOCK_EMAILS[category] || MOCK_EMAILS.default;
      let emailText = categoryTemplates[tone] || categoryTemplates.Professional || MOCK_EMAILS.default.Professional;

      // Adjust length text constraint simulation
      if (length === 'Short') {
        const lines = emailText.split('\n');
        // keep subject + first paragraph
        emailText = lines.slice(0, 5).join('\n') + `\n\nBest regards,\n[Your Name]`;
      } else if (length === 'Long') {
        const bodyInsert = `\n\nFurthermore, we should establish clear milestones and review progress iteratively to maximize our output efficiency and address any unforeseen issues proactively.`;
        const lines = emailText.split('\n');
        if (lines.length > 5) {
          lines[4] = lines[4] + bodyInsert;
        }
        emailText = lines.join('\n');
      }

      // Replace generic placeholder prompts with dynamic user words
      if (promptLower.includes('alex')) {
        emailText = emailText.replace(/recipient|partner/gi, 'Alex');
      } else if (promptLower.includes('team')) {
        emailText = emailText.replace(/recipient|partner/gi, 'Team');
      }

      return NextResponse.json({ result: emailText });
    }
  } catch (err: any) {
    console.error('Error generating email:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
