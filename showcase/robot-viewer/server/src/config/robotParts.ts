import type { RobotPart, PartCategory } from '../types/index.js';

function categorizeByName(id: string): { category: PartCategory; keywords: string[] } {
  if (id.startsWith('wheel-')) return { category: 'motion', keywords: ['wheel', 'drive', 'motion'] };
  if (id.startsWith('plate-')) return { category: 'structure', keywords: ['plate', 'base', 'structure'] };
  return { category: 'structure', keywords: ['part'] };
}

function formatName(id: string): string {
  return id
    .replace(/_SOLIDS_\d+$/, '')
    .replace(/_p$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// All mesh names from the UTRA robot model
const meshNames = [
  'wheel-1',
  'wheel-2',
  'plate-1',
];

export const robotParts: RobotPart[] = meshNames.map((id) => {
  const { category, keywords } = categorizeByName(id);
  return {
    id,
    name: formatName(id),
    description: `UTRA Robot part: ${formatName(id)}`,
    keywords: [id, ...keywords],
    category,
  };
});

export function getPartById(id: string): RobotPart | undefined {
  return robotParts.find((p) => p.id === id);
}

export function getPartsByCategory(category: PartCategory): RobotPart[] {
  return robotParts.filter((p) => p.category === category);
}

export function getAllPartIds(): string[] {
  return robotParts.map((p) => p.id);
}

export function getPartsListForAI(): string {
  return robotParts
    .map(
      (p) =>
        `- ID: "${p.id}" | Name: ${p.name} | Description: ${p.description} | Keywords: ${p.keywords.join(', ')}`
    )
    .join('\n');
}
