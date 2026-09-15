import data from '../data/publications.json';

export type Publication = {
  title: string;
  /**
   * Absent on work under review, on purpose.
   *
   * Naming the venue you submitted to puts your rejections on the public record
   * — an entry that reads "In review at IEEE Access" for a year and then quietly
   * changes venue has told everyone what happened. Accepted and published work
   * keeps its venue; that is the part that is a fact rather than a hope.
   */
  venue?: string;
  year: number;
  /** "Published" / "Accepted" / "In review", optionally followed by the form:
   *  "Published, Extended Abstract", "In review, Paper" */
  status: string;
  doi?: string;
  /**
   * Reading order for the front of the record, 1 first. Absent means not
   * selected — there is no `selected: false`, so a paper cannot be flagged
   * selected and left without a position.
   *
   * Only published or accepted work belongs here. Three of the seven used to be
   * under review, which put "In review" at the top of a list whose job is to
   * show what has landed.
   */
  selected?: number;
};

export const publications = data as Publication[];

/** the record as an editor would count it */
const isLanded = (p: Publication) => /^(Published|Accepted)/.test(p.status);
const isInReview = (p: Publication) => /^In review/.test(p.status);

export const landed = publications.filter(isLanded);
export const inReview = publications.filter(isInReview);

/**
 * Published and under-review work, counted apart.
 *
 * A single "31 publications" counts ten manuscripts under review and a preprint
 * alongside twenty peer-reviewed items. Academic readers count, so the page says
 * both numbers rather than the flattering one.
 */
export const tally = {
  total: publications.length,
  landed: landed.length,
  inReview: inReview.length,
};

/** the front of the record, in the order it should be read */
export const selected = publications
  .filter((p) => typeof p.selected === 'number')
  .sort((a, b) => (a.selected as number) - (b.selected as number));

if (selected.some((p) => !isLanded(p))) {
  throw new Error('publications.json: a selected paper is not published or accepted');
}

/** "CHI · 2026", or just "2026" while a paper is under review */
export const cite = (p: Publication) => [p.venue, p.year].filter(Boolean).join(' · ');
