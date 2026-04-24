/** Roulette-style grouped presets + fantasy palettes + single-color is handled in the page. */

export type ThemeScheme = { colors: string[] };

export const colorSchemeGroups: { title: string; schemes: ThemeScheme[] }[] = [
  {
    title: 'Bunt',
    schemes: [
      { colors: ['#e74c3c', '#3498db', '#6c5ce7', '#f1c40f', '#9b59b6', '#e67e22'] },
      { colors: ['#5499c7', '#e67e22', '#34495e', '#ff6f61', '#8e44ad', '#f39c12'] },
      { colors: ['#2c3e50', '#2874a6', '#f39c12', '#c0392b', '#7f8c8d', '#2980b9'] },
      { colors: ['#FF6B6B', '#74b9ff', '#FFE66D', '#fab1a0', '#AA96DA', '#FCBAD3'] },
    ],
  },
  {
    title: 'Pastell',
    schemes: [
      { colors: ['#F5E6D8', '#EDD5C4', '#E4C4B0', '#D9B49A', '#CEA88A', '#E8DDD0'] },
      { colors: ['#E8ECF2', '#DCE3ED', '#CED9E8', '#BFD0E0', '#B0C6D8', '#F2F5FA'] },
      { colors: ['#F3E4E8', '#E8D0DA', '#DDBCC8', '#D0A8B8', '#C498A8', '#EFE2E6'] },
      { colors: ['#E8E4F2', '#DDD6EA', '#D0C8E0', '#C4BAD6', '#D8D2EC', '#F0ECFA'] },
    ],
  },
  {
    title: 'Monochrom',
    schemes: [
      { colors: ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#42a5f5', '#64b5f6', '#90caf9'] },
      { colors: ['#311b92', '#4527a0', '#512da8', '#5e35b1', '#673ab7', '#7e57c2', '#9575cd'] },
      { colors: ['#1c2833', '#273746', '#34495e', '#415a6b', '#4d6a7c', '#5d7a8d', '#6d8a9e'] },
      { colors: ['#bf360c', '#d84315', '#e64a19', '#f4511e', '#ff5722', '#ff7043', '#ff8a65'] },
    ],
  },
  {
    title: 'Zweifarbig',
    schemes: [
      { colors: ['#0a0a0a', '#ffffff'] },
      { colors: ['#d32f2f', '#0a0a0a'] },
      { colors: ['#e91e63', '#0a0a0a'] },
      { colors: ['#1e88e5', '#0a0a0a'] },
    ],
  },
  {
    title: 'Dark',
    schemes: [
      { colors: ['#0a0a0a', '#1a0a0f', '#2d0a14', '#4a1022', '#5c1830', '#3d1420'] },
      { colors: ['#08060c', '#120a18', '#1c0f28', '#2a1840', '#3a2060', '#241838'] },
      { colors: ['#0c0c0e', '#16161c', '#22222a', '#2e2e3a', '#3a3a48', '#1e1e26'] },
      { colors: ['#0a0408', '#140810', '#1e1018', '#2a1824', '#3a2030', '#22141c'] },
    ],
  },
];

export const allThemeColors = colorSchemeGroups.flatMap((g) => g.schemes.map((s) => s.colors));

export function themePresetGlobalIndex(groupIndex: number, schemeIndex: number): number {
  let idx = 0;
  for (let i = 0; i < groupIndex; i++) {
    idx += colorSchemeGroups[i].schemes.length;
  }
  return idx + schemeIndex;
}

/** Fantasy: distinct face hues, marks suggested as light gold or pale — page applies mark per die. */
export const fantasyPalettes: { name: string; colors: string[]; mark: string }[] = [
  { name: 'Drache', colors: ['#7f1d1d', '#991b1b', '#b45309', '#92400e', '#78350f', '#450a0a'], mark: '#fde68a' },
  { name: 'Waldelf', colors: ['#14532d', '#166534', '#15803d', '#0f766e', '#134e4a', '#064e3b'], mark: '#ecfccb' },
  { name: 'Arkan', colors: ['#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed', '#5b21b6', '#312e81'], mark: '#e9d5ff' },
  { name: 'Tiefsee', colors: ['#0c4a6e', '#075985', '#0369a1', '#0e7490', '#155e75', '#164e63'], mark: '#cffafe' },
  { name: 'Zwergengold', colors: ['#44403c', '#57534e', '#78716c', '#a8a29e', '#57534e', '#292524'], mark: '#fcd34d' },
  { name: 'Untoten', colors: ['#1e293b', '#334155', '#475569', '#3f3f46', '#27272a', '#18181b'], mark: '#a3e635' },
];
