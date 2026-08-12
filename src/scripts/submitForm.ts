type SubmissionOptions = {
  endpoint: string;
  form: HTMLFormElement;
  sendingLabel: string;
};

type SubmissionResponse = {
  success?: boolean;
  message?: string;
};

export function setupFormSubmission({
  endpoint,
  form,
  sendingLabel,
}: SubmissionOptions) {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[role="status"]');

  if (!button || !status) return;

  const defaultLabel = button.textContent ?? "Send";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    button.disabled = true;
    button.textContent = sendingLabel;
    status.textContent = "";
    status.dataset.state = "sending";

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as SubmissionResponse;

      if (!response.ok || !result.success) {
        status.textContent =
          result.message ??
          "We couldn't send this right now. Please check your details and try again.";
        status.dataset.state = "error";
        return;
      }

      form.reset();
      status.textContent = result.message ?? "Your message has been sent.";
      status.dataset.state = "success";
    } catch {
      status.textContent =
        "We couldn't send this right now. Please check your details and try again.";
      status.dataset.state = "error";
    } finally {
      button.disabled = false;
      button.textContent = defaultLabel;
    }
  });
}
