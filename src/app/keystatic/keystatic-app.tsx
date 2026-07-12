"use client";

import { makePage } from "@keystatic/next/ui/app";
import keystaticConfig from "../../../keystatic.config";

const Page = makePage(keystaticConfig);

export default function KeystaticApp() {
  return <Page />;
}
