/**
 * Парсит slug-id формат: "team-workspace-w2" → { slug: "team-workspace", workspaceId: "w2" }
 */
export function parseSlugId(slugId?: string): { slug: string; workspaceId: string } {
  if (!slugId) {
    return { slug: 'unknown', workspaceId: 'unknown' };
  }

  const lastHyphenIndex = slugId.lastIndexOf('-');
  if (lastHyphenIndex === -1) {
    return { slug: slugId, workspaceId: slugId };
  }

  const slug = slugId.substring(0, lastHyphenIndex);
  const workspaceId = slugId.substring(lastHyphenIndex + 1);

  return { slug, workspaceId };
}
