const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "That request didn't make sense. Try again?" },
      { status: 400 }
    );
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email ?? "")
      : "";

  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: "That doesn't look like an email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error("BUTTONDOWN_API_KEY is not set");
    return Response.json(
      {
        ok: false,
        error:
          "Subscriptions aren't wired up yet on this deployment. Nothing you did wrong.",
      },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (res.ok) {
    return Response.json({ ok: true });
  }

  if (res.status === 400) {
    const data = await res.json().catch(() => null);
    const message = extractButtondownError(data);
    if (message?.toLowerCase().includes("already")) {
      return Response.json(
        { ok: false, error: "You're already on the list." },
        { status: 409 }
      );
    }
    return Response.json(
      { ok: false, error: message ?? "That email didn't go through." },
      { status: 400 }
    );
  }

  console.error("Buttondown subscribe failed", res.status, await res.text());
  return Response.json(
    {
      ok: false,
      error: "That didn't go through on my end. Try again in a bit, or email me directly.",
    },
    { status: 502 }
  );
}

function extractButtondownError(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return null;
}
