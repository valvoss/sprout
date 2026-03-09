const VAPI_API_KEY = process.env.VAPI_API_KEY!;
// TODO: Fill in after creating assistants in Vapi dashboard
const VAPI_COMPANY_ASSISTANT_ID = process.env.VAPI_COMPANY_ASSISTANT_ID!;
const VAPI_TALENT_ASSISTANT_ID = process.env.VAPI_TALENT_ASSISTANT_ID!;

interface TriggerCallParams {
  phone: string;
  type: "company" | "talent";
  formData: Record<string, string>;
}

interface VapiCallResponse {
  id: string;
  status: string;
}

export async function triggerScoutCall({
  phone,
  type,
  formData,
}: TriggerCallParams): Promise<VapiCallResponse> {
  const assistantId =
    type === "company" ? VAPI_COMPANY_ASSISTANT_ID : VAPI_TALENT_ASSISTANT_ID;

  const name =
    type === "company" ? formData.contact_name : formData.full_name;
  const context =
    type === "company"
      ? `Company: ${formData.company_name}. Role needed: ${formData.role_needed}. Industry: ${formData.industry}. Budget: ${formData.budget_range}. Hours: ${formData.hours_per_week}/week. Description: ${formData.description}`
      : `Name: ${formData.full_name}. Role: ${formData.primary_role}. Industries: ${formData.industries_served}. Availability: ${formData.availability_hours} hrs/week. Rate: ${formData.rate_expectations}`;

  const assistantOverrides =
    type === "company"
      ? {
          firstMessage: `Hi ${name}, this is Scout from Sprout. Thanks for reaching out — I'd love to learn more about what you're looking for in a fractional executive. Do you have a few minutes to chat?`,
          model: {
            messages: [
              {
                role: "system" as const,
                content: `You are Scout, an AI assistant for Sprout — a fractional executive marketplace. You're calling a company that just submitted a hiring request. Be conversational, warm, and professional. NOT a survey — follow up on interesting answers.

Context from their form: ${context}

Your goals:
1. Understand their company stage and current challenges
2. Dig into the specific challenge they need help with
3. Clarify hours/week and flexibility
4. Understand budget range and constraints
5. Get a sense of timeline/urgency

End with: "I'll text you 3 executive profiles within 24 hours. Is there anything else I should know?"

Keep the conversation natural. Ask follow-up questions when something is interesting. Don't rush through topics.`,
              },
            ],
          },
        }
      : {
          firstMessage: `Hi ${name}, this is Scout from Sprout. Thanks for applying to join the network — I'd love to learn more about your experience and what you're looking for. Got a few minutes?`,
          model: {
            messages: [
              {
                role: "system" as const,
                content: `You are Scout, an AI assistant for Sprout — a fractional executive marketplace. You're calling an executive who just applied to join the network. Be conversational, warm, and professional.

Context from their application: ${context}

Your goals:
1. Understand their primary function (CFO/CMO/COO/CTO) and depth of experience
2. Learn which industries they love working in and why
3. Clarify availability and how they like to structure engagements
4. Understand their rate range
5. Find out what kind of companies and challenges excite them most

End with: "I'll start matching you with opportunities. You'll get a text when there's a fit."

Keep it conversational. Follow up on interesting answers. Don't rush.`,
              },
            ],
          },
        };

  const response = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId,
      assistantOverrides,
      customer: {
        number: phone,
        name,
      },
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vapi API error: ${response.status} ${error}`);
  }

  return response.json();
}
