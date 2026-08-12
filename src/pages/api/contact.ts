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

function getTopicLabel(topic: string) {
  switch (topic) {
    case "general":
      return "General question";
    case "apparel":
      return "Apparel";
    case "paintings":
      return "Paintings";
    case "resin":
      return "Resin work";
    case "accessories":
      return "Accessories";
    case "other":
      return "Other / not sure";
    default:
      throw new InvalidSubmissionError("Select a valid topic.");
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await readJsonBody(request);

    if (honeypotIsFilled(body)) {
      return jsonResponse({ success: true, message: successMessage });
    }

    const name = requiredString(body, "name", "Name", 100);
    const email = emailString(body);
    const topic = requiredString(body, "topic", "Topic", 20);
    const topicLabel = getTopicLabel(topic);
    const subject = requiredString(body, "subject", "Subject", 120);
    const message = requiredString(body, "message", "Message", 5_000);
    const emailSubject = `${topicLabel} — ${subject.replace(/\s+/g, " ")}`;

    await sendNotificationEmail({
      replyTo: email,
      subject: emailSubject,
      text: [
        message,
        "",
        "---",
        "",
        "Submitted through breezys.net",
        `Topic: ${topicLabel}`,
        `Name: ${name}`,
        `Email: ${email}`,
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
