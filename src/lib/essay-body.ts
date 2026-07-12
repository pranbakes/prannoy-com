export type DocNode = {
  type?: string;
  href?: string;
  text?: string;
  children?: DocNode[];
};

export function blockHasAnchor(node: DocNode, anchorId: string): boolean {
  if (node.type === "link" && node.href === `#${anchorId}`) return true;
  if (node.children) {
    return node.children.some((child) => blockHasAnchor(child, anchorId));
  }
  return false;
}
