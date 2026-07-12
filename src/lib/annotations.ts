export type RawAnnotation = { anchorId: string; text: string };
export type Annotation = RawAnnotation & { type: "note" | "see-also" };

export function resolveAnnotations(
  annotations: readonly RawAnnotation[]
): Annotation[] {
  return annotations.map((a) => ({
    ...a,
    type: a.anchorId ? "note" : "see-also",
  }));
}
