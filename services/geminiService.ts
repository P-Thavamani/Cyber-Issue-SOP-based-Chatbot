import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { SopStepType, ComplianceStatus } from '../types';

let generativeModel: GenerativeModel | undefined;

export const initGemini = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key not found. Please set VITE_GEMINI_API_KEY in your environment variables.");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  generativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

const parseSopResponse = (text: string): SopStepType[] => {
    try {
        // Attempt to extract JSON even if there's surrounding text
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;

        const sopData = JSON.parse(jsonString);
        if (Array.isArray(sopData)) {
            return sopData.map((step: any, index: number) => ({
                id: index + 1,
                title: step.title || `Step ${index + 1}: ${step.issueType || 'Unnamed Step'}`,
                description: step.description || 'No description provided.',
                compliance: {
                    nist: {
                        status: step.compliance?.nist?.status || ComplianceStatus.Unknown,
                        explanation: step.compliance?.nist?.explanation || 'NIST compliance not specified.'
                    },
                    iso: {
                        status: step.compliance?.iso?.status || ComplianceStatus.Unknown,
                        explanation: step.compliance?.iso?.explanation || 'ISO compliance not specified.'
                    },
                    gdpr: {
                        status: step.compliance?.gdpr?.status || ComplianceStatus.Unknown,
                        explanation: step.compliance?.gdpr?.explanation || 'GDPR compliance not specified.'
                    },
                },
            }));
        }
    } catch (e) {
        console.error("Failed to parse SOP response:", e);
        console.error("Original text that caused parsing error:", text);
    }
    return [];
};

export const getSopFromGemini = async (prompt: string): Promise<SopStepType[]> => {
    if (!generativeModel) {
        console.error("Gemini model not initialized.");
        return [];
    }

    try {
        const fullPrompt = `You are a cybersecurity expert. Your task is to provide a Standard Operating Procedure (SOP) for the given cyber issue. \n\nOutput ONLY a JSON array of steps. Each step MUST have a 'title', 'description', and 'compliance' object. The compliance object MUST contain 'nist', 'iso', and 'gdpr' fields, each with a 'status' (must be one of: "Compliant", "PartiallyCompliant", "NotCompliant", "Unknown") and an 'explanation'. Focus on practical, actionable steps for the cyber issue: "${prompt}".\n\nExample JSON structure for the entire SOP (array of steps):\n\`\`\`json\n[\n  {\n    "title": "Identify and Verify",\n    "description": "Confirm the reported email is a phishing attempt. Analyze email headers, sender address, and content for red flags. Do not click any links or download attachments.",\n    "compliance": {\n      "nist": { "status": "Compliant", "explanation": "Aligns with NIST SP 800-61 Rev. 2, focusing on initial detection and analysis." },\n      "iso": { "status": "Compliant", "explanation": "Fulfills ISO 27001 Annex A.12.1.2 requirements for protection against malware." },\n      "gdpr": { "status": "PartiallyCompliant", "explanation": "Contributes to data protection by preventing initial compromise, but direct GDPR articles are more about post-breach." }\n    }\n  },\n  {\n    "title": "Contain the Threat",\n    "description": "Search for and delete all instances of the phishing email from user mailboxes to prevent further clicks. Isolate any machines where users interacted with the email.",\n    "compliance": {\n      "nist": { "status": "Compliant", "explanation": "Directly follows NIST guidelines for containment to limit the incident's scope." },\n      "iso": { "status": "Compliant", "explanation": "Supports ISO 27035 for incident containment and correction." },\n      "gdpr": { "status": "NotCompliant", "explanation": "This step is operational; it doesn't directly map to a GDPR article, which focuses on data rights and breach notification." }\n    }\n  }\n]\`\`\`\n`;

        const result = await generativeModel.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Raw Response:", text);
        return parseSopResponse(text);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return [];
    }
};

export const uploadFileToGemini = async (file: File): Promise<Part | undefined> => {
  if (!generativeModel) {
    console.error("Gemini model not initialized.");
    return undefined;
  }
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: base64,
        mimeType: file.type,
      },
    };
  } catch (error) {
    console.error("Error reading file for Gemini upload:", error);
    return undefined;
  }
};
