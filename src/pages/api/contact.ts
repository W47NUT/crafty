import type { APIRoute } from "astro";
import {
  emailString,
  honeypotIsFilled,
  InvalidSubmissionError,
  jsonResponse,
  readJsonBody,
  requiredString,
  sendNotificationEmail,
} from "../../lib/formEndpoint";

export const prerender = false;

const successMessage = "Thanks — your message has been sent to Bre.";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await readJsonBody(request);

    if (honeypotIsFilled(body)) {
      return jsonResponse({ success: true, message: successMessage });
    }

    const name = requiredString(body, "name", "Name", 100);
    const email = emailString(body);
    const subject = requiredString(body, "subject", "Subject", 120);
    const message = requiredString(body, "message", "Message", 5_000);
    const emailSubject = subject.replace(/[\r\n]+/g, " ");

    await sendNotificationEmail({
      replyTo: email,
      subject: `[Breezy's Website] General contact: ${emailSubject}`,
      text: [
        "General contact submitted through Breezy's Creative Co.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return jsonResponse({ success: true, message: successMessage });
  } catch (error) {
    if (error instanceof InvalidSubmissionError) {
      return jsonResponse({ success: false, message: error.message }, 400);
    }

    console.error(
      JSON.stringify({
        message: "General contact email could not be sent.",
      })
    );
    return jsonResponse(
      {
        success: false,
        message: "We couldn't send your message. Please try again.",
      },
      500
    );
  }
};

export const ALL: APIRoute = () =>
  jsonResponse(
    { success: false, message: "This endpoint only accepts POST requests." },
    405
  );
