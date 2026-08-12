import { env } from "cloudflare:workers";
import { Resend } from "resend";

const MAX_REQUEST_BYTES = 16_384;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type JsonObject = Record<string, unknown>;

type EmailNotification = {
  replyTo: string;
  subject: string;
  text: string;
};

export class InvalidSubmissionError extends Error {}

export function jsonResponse(
  body: { success: boolean; message: string },
  status = 200
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function readJsonBody(request: Request): Promise<JsonObject> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new InvalidSubmissionError("Expected a JSON request.");
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    throw new InvalidSubmissionError("The request is too large.");
  }

  if (!request.body) {
    throw new InvalidSubmissionError("The request body is missing.");
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteCount = 0;
  let bodyText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    byteCount += value.byteLength;
    if (byteCount > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new InvalidSubmissionError("The request is too large.");
    }

    bodyText += decoder.decode(value, { stream: true });
  }

  bodyText += decoder.decode();

  try {
    const value: unknown = JSON.parse(bodyText);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new InvalidSubmissionError("The request must be a JSON object.");
    }
    return value as JsonObject;
  } catch (error) {
    if (error instanceof InvalidSubmissionError) throw error;
    throw new InvalidSubmissionError("The request contains invalid JSON.");
  }
}

export function requiredString(
  body: JsonObject,
  field: string,
  label: string,
  maxLength: number
) {
  const value = body[field];
  if (typeof value !== "string") {
    throw new InvalidSubmissionError(`${label} is required.`);
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new InvalidSubmissionError(`${label} is required.`);
  }
  if (trimmedValue.length > maxLength) {
    throw new InvalidSubmissionError(`${label} is too long.`);
  }

  return trimmedValue;
}

export function optionalString(
  body: JsonObject,
  field: string,
  label: string,
  maxLength: number
) {
  const value = body[field];
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") {
    throw new InvalidSubmissionError(`${label} must be text.`);
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length > maxLength) {
    throw new InvalidSubmissionError(`${label} is too long.`);
  }

  return trimmedValue;
}

export function emailString(body: JsonObject, field = "email") {
  const email = requiredString(body, field, "Email", 254);
  if (!EMAIL_PATTERN.test(email)) {
    throw new InvalidSubmissionError("Enter a valid email address.");
  }
  return email;
}

export function honeypotIsFilled(body: JsonObject) {
  return typeof body.website === "string" && body.website.trim().length > 0;
}

export async function sendNotificationEmail({
  replyTo,
  subject,
  text,
}: EmailNotification) {
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo,
    subject,
    text,
  });

  if (error) {
    throw new Error("Resend rejected the notification email.");
  }
}
