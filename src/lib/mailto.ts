export const ADVISORY_MAILTO = [
  "mailto:hi@prannoy.com",
  "?subject=", encodeURIComponent("Advising"),
  "&body=", encodeURIComponent(
    "What you're building (a few sentences):\n\n\n" +
    "Where you are (stage, team size, what's live):\n\n\n" +
    "What you're stuck on:\n\n"
  ),
].join("");
