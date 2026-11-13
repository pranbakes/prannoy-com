/**
 * Voice rules for prannoy.com copy.
 *
 * Every rule is a regex plus a reason. Severity decides what happens:
 *   error  fails CI and makes the Claude Code hook send Claude back to fix it
 *   warn   gets reported, never blocks (judgment calls, literal uses exist)
 *
 * Headlines (titles, deks, the homepage greeting and tagline, page metadata)
 * get zero tolerance: any warn found in a headline is promoted to an error.
 *
 * To add a rule, add an entry. To allow one specific phrase, add it to
 * allowlist.json instead of weakening the rule.
 */

export type Severity = "error" | "warn";

/** Where a piece of copy shows up. Rules can be scoped to some surfaces. */
export type Surface = "headline" | "about" | "home" | "body" | "ui";

export type Rule = {
  id: string;
  severity: Severity;
  pattern: RegExp;
  message: string;
  /** Only apply on these surfaces. Omit to apply everywhere. */
  surfaces?: Surface[];
  /** Different severity on specific surfaces. */
  severityBySurface?: Partial<Record<Surface, Severity>>;
};

const words = (list: string[]) =>
  new RegExp(`\\b(?:${list.join("|")})\\b`, "gi");

/** The most-flagged AI vocabulary. Never in site copy. */
const BANNED_WORDS = [
  "delv(?:e|es|ed|ing)",
  "dive into",
  "deep dive",
  "underscor(?:e|es|ed|ing)",
  "bolster(?:s|ed|ing)?",
  "foster(?:s|ed|ing)?",
  "harness(?:es|ed|ing)?",
  "leverag(?:e|es|ed|ing)",
  "unpack(?:s|ed|ing)?",
  "shed(?:s|ding)? light on",
  "pav(?:e|es|ed|ing) the way",
  "pivotal",
  "groundbreaking",
  "cutting-edge",
  "transformative",
  "game-?chang(?:ing|er|ers)",
  "innovative",
  "robust",
  "comprehensive",
  "seamless(?:ly)?",
  "intricate",
  "vibrant",
  "multifaceted",
  "holistic",
  "testament",
  "realm",
  "tapestry",
  "embark(?:s|ed|ing)?",
  "ever-evolving",
];

/** Banned when figurative, which in site copy is nearly always. */
const FIGURATIVE_WORDS = ["navigat(?:e|es|ed|ing)", "landscape", "nuanced"];

/** Labels that tell the reader something matters instead of showing it. */
const SIGNIFICANCE_LABELS = [
  "significant(?:ly)?",
  "importantly",
  "crucial(?:ly)?",
  "notably",
  "key takeaway",
  "it'?s worth (?:noting|mentioning)",
];

/** Performative enthusiasm. */
const HYPE = ["exciting", "incredible", "powerful", "amazing", "unlock(?:s|ed|ing)? (?:the |your )?potential"];

export const RULES: Rule[] = [
  {
    id: "banned-word",
    severity: "error",
    pattern: words(BANNED_WORDS),
    message: "AI-marker vocabulary. Say the plain thing it stands in for.",
  },
  {
    id: "figurative-word",
    severity: "warn",
    pattern: words(FIGURATIVE_WORDS),
    message: "Banned when figurative. Fine only if literal (navigating a website, a landscape painting).",
  },
  {
    id: "stock-phrase",
    severity: "error",
    pattern: new RegExp(
      [
        "\\bin today'?s (?:[\\w-]+ )*world\\b",
        "\\bin an? (?:era|age|world) (?:of|where)\\b",
        "\\bit'?s (?:important|worth) (?:to )?not(?:e|ing)\\b",
        "\\bone of the most (?:important|significant|crucial)\\b",
        "\\bwhen it comes to\\b",
        "\\bat its core\\b",
        "\\bat the end of the day\\b",
        "\\bthis is where [^.!?]{1,40} comes? in\\b",
        "\\blet'?s break (?:it|this) down\\b",
        "\\blet'?s (?:explore|dive|take a look)\\b",
        "\\bnow let'?s turn to\\b",
        "\\bplays? an? (?:crucial|key|vital|pivotal|critical) role\\b",
        "\\bcannot be overstated\\b",
        "\\bunderscoring the (?:importance|need)\\b",
        "\\bhighlighting the (?:importance|need)\\b",
        "\\breflecting a (?:broader|larger|wider) (?:trend|shift)\\b",
        "\\bmarking a (?:significant|major|pivotal) shift\\b",
        "\\bhere'?s the thing\\b",
        "\\blet that sink in\\b",
      ].join("|"),
      "gi"
    ),
    message: "Stock AI phrase. Delete it and start with the actual point.",
  },
  {
    id: "not-just-x-but-y",
    severity: "error",
    pattern:
      /\b(?:(?:not|don'?t|doesn'?t|isn'?t|aren'?t|wasn'?t) (?:just|only|merely|simply)\b[^.!?]{0,100}?(?:—|–|,|;|\.)\s*(?:but|it'?s|it is|they'?re|this is|i|we|they|it)\b)|\bnot only\b[^.!?]{0,140}\bbut\b/gi,
    message: "\"Not just X, but Y\" mimics insight. State Y directly.",
  },
  {
    id: "isnt-about-x",
    severity: "error",
    pattern:
      /\b(?:this|it|that)\s+(?:isn'?t|is not|wasn'?t|was not)\s+(?:really\s+|just\s+)?about\b[^.!?]{0,100}[.!?]\s+(?:it'?s|it is|it was)\s+about\b/gi,
    message: "\"This isn't about X. It's about Y.\" Cut the X sentence and say Y.",
  },
  {
    id: "no-x-no-y-just-z",
    severity: "error",
    pattern: /\bNo [^.!?]{1,40}\.\s+No [^.!?]{1,40}\.\s+Just\b/g,
    message: "\"No X. No Y. Just Z.\" is a template. Write a normal sentence.",
  },
  {
    id: "em-dash",
    severity: "error",
    pattern: /—|\s–\s|\s--\s/g,
    message: "No em dashes. Use a comma, a period, or parentheses.",
  },
  {
    id: "bold-colon-list",
    severity: "error",
    pattern: /^\s*(?:[-*+]|\d+\.)\s+\*\*[^*]+\*\*\s*[:—–-]/gm,
    message: "\"**Term**: explanation\" lists are the most recognizable AI pattern. Write prose or plain bullets.",
  },
  {
    id: "abstract-triad",
    severity: "warn",
    pattern:
      /\b[a-z]+(?:ive|ful|ous|ent|ant|able|ible|ity|ness|ment|tion|ing)\b,\s+[a-z]+(?:ive|ful|ous|ent|ant|able|ible|ity|ness|ment|tion|ing)\b,?\s+and\s+[a-z]+(?:ive|ful|ous|ent|ant|able|ible|ity|ness|ment|tion|ing)\b/g,
    message: "Abstract rule-of-three. Keep the one that's true, or make them concrete.",
  },
  {
    id: "intensifier",
    severity: "warn",
    pattern: words(["actually", "truly", "genuinely", "literally", "fundamentally"]),
    message: "Intensifier doing no work. Cut it, or say what makes the thing true.",
  },
  {
    id: "significance-label",
    severity: "warn",
    pattern: words(SIGNIFICANCE_LABELS),
    message: "Labels importance instead of showing it. Trust the reader.",
  },
  {
    id: "hype",
    severity: "warn",
    pattern: words(HYPE),
    message: "Performative enthusiasm. Show what it does instead.",
  },
  {
    id: "second-person-bio",
    severity: "warn",
    surfaces: ["about"],
    pattern: /\b(?:you|you're|you'll|you've|your|yours)\b/gi,
    message: "Second person in bio copy. Keep the About page in first person.",
  },
  {
    id: "employer-name",
    severity: "error",
    severityBySurface: { body: "warn" },
    pattern: /\bCoursera\b/g,
    message: "Don't name Coursera in the site's own copy. In essays this is a warning so cited examples can stay.",
  },
];
