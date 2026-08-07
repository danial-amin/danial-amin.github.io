/**
 * Typographic fixes for titles set in display type.
 *
 * These are presentational only — the content files keep ordinary hyphens, and
 * these run at render time.
 */

/**
 * Stop a line breaking in the middle of a hyphenated word.
 *
 * A browser will happily break after a hyphen, so "Game-Changing" sets as
 * "Game-" / "Changing" and reads as a word cut in half — at 3rem display sizes
 * it is the first thing you notice. U+2011 NON-BREAKING HYPHEN is the same glyph
 * with no break opportunity after it, so the word stays whole and the line
 * breaks at a space instead.
 *
 * Only hyphens between two letters are replaced. A spaced dash used as a
 * subtitle separator ("Titans - The Next…") is a real break opportunity and
 * should stay one, and a leading minus or an em dash is left alone.
 */
export const keepWordsWhole = (text: string) =>
  text
    .replace(/([A-Za-z])-([A-Za-z])/g, '$1‑$2')
    /**
     * A dash separating a title from its subtitle binds to the word after it, not
     * the one before. Roughly half these titles are "Title - Subtitle", and the
     * break was landing after the dash, leaving a line ending in " -" — which
     * reads as an unfinished thought. Tying it forward with a non-breaking space
     * moves the break to the space in front, so the dash opens the next line
     * instead of dangling off the previous one. The nbsp sets the same width as
     * the space it replaces.
     */
    .replace(/ ([-–—]) (?=\S)/g, ' $1 ');
