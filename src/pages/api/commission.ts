import type { APIRoute } from "astro";
import {
  emailString,
  honeypotIsFilled,
  InvalidSubmissionError,
  jsonResponse,
  optionalString,
  readJsonBody,
  requiredString,
  sendNotificationEmail,
} from "../../lib/formEndpoint";

export const prerender = false;

const successMessage = "Thanks — your commission inquiry has been sent to Bre.";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await readJsonBody(request);

    if (honeypotIsFilled(body)) {
      return jsonResponse({ success: true, message: successMessage });
    }

    const name = requiredString(body, "name", "Name", 100);
    const email = emailString(body);
    const requestedPiece = requiredString(
      body,
      "requestedPiece",
      "Requested piece",
      200
    );
    const quantity = optionalString(body, "quantity", "Desired quantity", 50);
    const idea = requiredString(body, "idea", "Project description", 5_000);
    const safeName = name.replace(/[\r\n]+/g, " ");

    await sendNotificationEmail({
      replyTo: email,
      subject: `[Breezy's Website] Commission inquiry from ${safeName}`,
      text: [
        "Commission inquiry submitted through Breezy's Creative Co.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Requested piece: ${requestedPiece}`,
        ...(quantity ? [`Desired quantity: ${quantity}`] : []),
        "",
        "Idea / project description:",
        idea,
      ].join("\n"),
    });

    return jsonResponse({ success: true, message: successMessage });
  } catch (error) {
    if (error instanceof InvalidSubmissionError) {
      return jsonResponse({ success: false, message: error.message }, 400);
    }

    console.error(
      JSON.stringify({
        message: "Commission inquiry email could not be sent.",
      })
    );
    return jsonResponse(
      {
        success: false,
        message: "We couldn't send your inquiry. Please try again.",
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
