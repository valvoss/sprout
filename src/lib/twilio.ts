import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, message: string): Promise<string> {
  const result = await client.messages.create({
    body: message,
    from: fromNumber,
    to,
  });
  return result.sid;
}
