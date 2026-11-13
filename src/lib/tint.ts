/**
 * Categorical hues (tool-brand colors, diagram lanes, stage accents) are authored
 * at dark-theme brightness — #10B981, #F59E0B, #22D3EE and friends. Used verbatim
 * as TEXT they sit around 1.5–2.5:1 on a light background, well under WCAG AA.
 *
 * Mixing 55% toward --color-foreground darkens the hue against the light theme
 * while keeping its identity. 55% rather than 50%: at 50% the worst pairing was
 * fine on the page background but only 4.46:1 on a hue's own tinted tile (cyan
 * on its ~4% wash). At 55% an axe WCAG 2.2 AA scan of every page found no
 * tinted-text contrast failures (Nov 2026).
 *
 * Use for text only. Backgrounds and borders keep the raw hue — they're
 * decorative and carry no contrast requirement at these alpha levels.
 */
export function tintText(hue: string): string {
  return `color-mix(in srgb, ${hue} 45%, var(--color-foreground))`;
}
