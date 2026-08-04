/**
 * Builds a genuine embedding map of the concepts in the writing.
 *
 * No API and no model download: the geometry comes from the corpus itself,
 * which is the honest version of this and stays reproducible.
 *
 *   1. tokenise all 50 pieces, drop stopwords, keep uni- and bigrams
 *   2. TF-IDF term x document matrix — each term becomes a vector in
 *      document space, which is a real (if shallow) distributional embedding
 *   3. cosine distance between term vectors
 *   4. classical MDS via power iteration -> 2 dimensions
 *   5. k-means on the full-dimensional vectors for clusters
 *   6. nearest neighbours per term, straight from the cosine matrix
 *
 * Everything is deterministic — no Math.random anywhere — so the map only
 * moves when the writing changes.
 *
 *   npm run map
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'src/content/writing';
const OUT = 'src/data/concept-map.json';

const BASE_STOP = `a about above after again against all am an and any are aren as at be because been
before being below between both but by can cannot could couldn did didn do does doesn doing don down
during each few for from further had hadn has hasn have haven having he her here hers herself him
himself his how i if in into is isn it its itself just ll me might more most must my myself no nor not
now of off on once only or other ought our ours ourselves out over own re same shan she should shouldn
so some such than that the their theirs them themselves then there these they this those through to
too under until up ve very was wasn we were weren what when where which while who whom why will with
won would wouldn you your yours yourself yourselves s t d m o y ain ma mightn mustn needn
also however thus therefore whether within across upon among many much may one two three first second
third next last often always never every something anything nothing someone anyone everyone somebody
everybody nobody anybody lot lots kind sort bit way ways thing things anymore`;

/* norm() strips apostrophes, so contractions arrive collapsed — "isn't" comes
   through as "isnt" and sails past the list above unless it is named here. */
const CONTRACTIONS = `isnt arent wasnt werent dont doesnt didnt wont cant couldnt wouldnt shouldnt
hasnt havent hadnt mustnt neednt shant thats theres whats heres wheres whos hows theyre youre weve
theyve ive youve im hes shes lets aint itll youll theyll wed youd theyd hed shed`;

/* Verbs and adjectives frequent enough to dominate TF-IDF while carrying no
   subject matter. Domain words he actually writes about — model, llm, persona,
   prompt, data, training, evaluation, bias, agent — are deliberately absent. */
const FILLER = `make makes making made get gets getting got give gives given take takes taken
use uses used using need needs needed want wants wanting see sees seen look looks looking
say says said saying know knows known think thinks tell tells told telling asked asking
find finds found work works working go goes going gone come comes came
really actually simply basically essentially probably perhaps maybe quite rather already yet almost
enough far able best better good great new old different high low big small long short huge tiny
massive entire whole full complete completely entirely mostly largely partly simple easy easier hard
harder difficult important interesting useful useless obvious surprising truly literally obviously
clearly certainly worth instead
like real wrong right fundamental generic single everything produces produce ask asks
built build builds building reveals reveal shows show shown seems seem
becomes become became turns turn turned starts started stops stopped keeps kept
means meant matters mattered happens happen happened
fundamentally complex understand understanding understood
time times year years day days week weeks month months today tomorrow yesterday recently currently
people person human humans user users end ends start begin begins put puts run runs running
question questions answer answers problem problems reason reasons result results cause causes
matter number numbers thought though although because since while even still
place places side sides top bottom front above beneath inside outside behind beyond despite towards
sense fact facts idea ideas word words line lines step steps level levels form forms
type types set sets case cases view views term terms name names order orders state states
value values point points part parts example examples version versions bad worse worst
less least`;

const STOP = new Set(
  [BASE_STOP, CONTRACTIONS, FILLER]
    .join(' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean),
);

/* ---------- corpus ---------- */

async function loadDocs() {
  const docs = [];

  for (const sub of ['essays', 'newsletter']) {
    const dir = path.join(ROOT, sub);
    for (const f of (await readdir(dir)).filter((n) => n.endsWith('.md'))) {
      let raw = await readFile(path.join(dir, f), 'utf8');
      const title = /^title:\s*(.+)$/m.exec(raw)?.[1]?.trim().replace(/^["']|["']$/g, '') ?? f;
      // frontmatter, code, urls, inline markup
      raw = raw.replace(/^---[\s\S]*?\n---/, ' ');
      raw = raw.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
      raw = raw.replace(/https?:\/\/\S+/g, ' ');
      raw = raw.replace(/[*_>#|\[\]()]/g, ' ');
      docs.push({
        id: `${sub}/${f.replace(/\.md$/, '')}`,
        title,
        kind: 'writing',
        text: raw,
      });
    }
  }

  /**
   * The academic side. These documents are short — four publication titles and
   * three news lines — so they contribute little raw frequency. Their job is
   * provenance: they mark which concepts belong to the research vocabulary, and
   * that mark then protects those concepts from being outranked by fifty much
   * longer essays (see ACADEMIC_BOOST below).
   *
   * The CV is deliberately not included. It is a consulting CV — no
   * publications, no doctoral work — so it would only add client/enterprise
   * delivery vocabulary, which is the opposite of academic.
   */
  const pubs = JSON.parse(await readFile('src/data/publications.json', 'utf8'));
  for (const pub of pubs) {
    docs.push({
      id: `pub/${pub.doi ?? pub.year}`,
      title: pub.title,
      kind: 'academic',
      text: `${pub.title} ${pub.title} ${pub.venue} ${pub.status}`,
    });
  }

  const news = JSON.parse(await readFile('src/data/news.json', 'utf8'));
  for (const n of news) {
    docs.push({ id: `news/${n.date}`, title: n.text, kind: 'academic', text: n.text });
  }

  return docs;
}

const norm = (w) => w.toLowerCase().replace(/[^a-z0-9-]/g, '');

function tokens(text) {
  const words = text
    .split(/[^A-Za-z0-9'-]+/)
    .map(norm)
    .filter((w) => w.length > 2 && w.length < 24 && !STOP.has(w) && !/^\d+$/.test(w));

  const out = [...words];
  // bigrams catch the phrases that carry his actual subject matter
  for (let i = 0; i < words.length - 1; i++) out.push(`${words[i]} ${words[i + 1]}`);
  return out;
}

/* ---------- tf-idf ---------- */

const ACADEMIC_BOOST = 2.4;

function buildMatrix(docs, { minDf = 3, maxDfRatio = 0.5, topTerms = 140 }) {
  const tf = docs.map(() => new Map());
  const df = new Map();

  docs.forEach((d, i) => {
    const seen = new Set();
    for (const t of tokens(d.text)) {
      tf[i].set(t, (tf[i].get(t) ?? 0) + 1);
      seen.add(t);
    }
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  });

  const N = docs.length;
  const maxDf = Math.floor(N * maxDfRatio);

  // which terms appear in the academic documents at all
  const academicIdx = docs.map((d, i) => (d.kind === 'academic' ? i : -1)).filter((i) => i >= 0);
  const isAcademic = new Map();
  for (const t of df.keys()) {
    isAcademic.set(t, academicIdx.some((i) => (tf[i].get(t) ?? 0) > 0));
  }

  // an academic term only needs to show up twice, because the academic corpus
  // is tiny by nature; everything else still has to clear minDf
  let vocab = [...df.entries()]
    .filter(([t, n]) => n <= maxDf && n >= (isAcademic.get(t) ? 2 : minDf))
    .map(([t]) => t);

  // prefer a bigram over its parts when they carry the same weight
  const scored = vocab.map((t) => {
    const idf = Math.log(N / (df.get(t) + 1)) + 1;
    let s = 0;
    for (let i = 0; i < N; i++) s += (tf[i].get(t) ?? 0) * idf;
    const boost = (t.includes(' ') ? 1.25 : 1) * (isAcademic.get(t) ? ACADEMIC_BOOST : 1);
    return { t, s: s * boost, df: df.get(t), academic: !!isAcademic.get(t) };
  });
  scored.sort((a, b) => b.s - a.s);

  const picked = [];
  for (const c of scored) {
    if (picked.length >= topTerms) break;
    // skip a unigram already represented by a chosen bigram, and vice versa
    if (picked.some((p) => p.t !== c.t && (p.t.includes(c.t) || c.t.includes(p.t)))) continue;
    picked.push(c);
  }

  const terms = picked.map((p) => p.t);
  const vectors = terms.map((t) => {
    const idf = Math.log(N / (df.get(t) + 1)) + 1;
    const v = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const c = tf[i].get(t) ?? 0;
      v[i] = c > 0 ? (1 + Math.log(c)) * idf : 0;
    }
    let m = 0;
    for (const x of v) m += x * x;
    m = Math.sqrt(m) || 1;
    for (let i = 0; i < N; i++) v[i] /= m;
    return v;
  });

  const academic = new Map(picked.map((p) => [p.t, p.academic]));
  return { terms, vectors, df, tf, academic };
}

/* ---------- geometry ---------- */

const dot = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

/** deterministic power iteration for the top eigenpairs of a symmetric matrix */
function topEigen(M, k, iters = 260) {
  const n = M.length;
  const out = [];
  const A = M.map((r) => Float64Array.from(r));

  for (let c = 0; c < k; c++) {
    // fixed, non-random seed so builds are identical
    let v = Float64Array.from({ length: n }, (_, i) => Math.sin((i + 1) * (c + 1) * 0.7) + 0.5);
    let norm2 = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    v = v.map((x) => x / norm2);

    let lambda = 0;
    for (let it = 0; it < iters; it++) {
      const w = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        let s = 0;
        for (let j = 0; j < n; j++) s += A[i][j] * v[j];
        w[i] = s;
      }
      const m = Math.sqrt(w.reduce((s, x) => s + x * x, 0));
      if (m < 1e-12) break;
      for (let i = 0; i < n; i++) w[i] /= m;
      lambda = m;
      v = w;
    }

    out.push({ value: lambda, vector: v });
    // deflate so the next pass finds the next component
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) A[i][j] -= lambda * v[i] * v[j];
    }
  }
  return out;
}

/** classical MDS from a distance matrix */
function mds(D) {
  const n = D.length;
  const sq = D.map((row) => row.map((d) => d * d));
  const rowMean = sq.map((r) => r.reduce((a, b) => a + b, 0) / n);
  const grand = rowMean.reduce((a, b) => a + b, 0) / n;

  const B = sq.map((r, i) => r.map((v, j) => -0.5 * (v - rowMean[i] - rowMean[j] + grand)));
  const [e1, e2] = topEigen(B, 2);
  const s1 = Math.sqrt(Math.max(e1.value, 0));
  const s2 = Math.sqrt(Math.max(e2.value, 0));
  return Array.from({ length: n }, (_, i) => [e1.vector[i] * s1, e2.vector[i] * s2]);
}

/** k-means on the full vectors, deterministic k-means++ style seeding */
function kmeans(vectors, k, iters = 60) {
  const n = vectors.length;
  const dim = vectors[0].length;
  const centres = [vectors[0]];
  while (centres.length < k) {
    let bestI = 0;
    let bestD = -1;
    for (let i = 0; i < n; i++) {
      let nearest = Infinity;
      for (const c of centres) nearest = Math.min(nearest, 1 - dot(vectors[i], c));
      if (nearest > bestD) {
        bestD = nearest;
        bestI = i;
      }
    }
    centres.push(vectors[bestI]);
  }

  let assign = new Array(n).fill(0);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      let best = 0;
      let bestS = -Infinity;
      for (let c = 0; c < k; c++) {
        const s = dot(vectors[i], centres[c]);
        if (s > bestS) {
          bestS = s;
          best = c;
        }
      }
      if (assign[i] !== best) {
        assign[i] = best;
        moved = true;
      }
    }
    for (let c = 0; c < k; c++) {
      const acc = new Float64Array(dim);
      let count = 0;
      for (let i = 0; i < n; i++) {
        if (assign[i] !== c) continue;
        count++;
        for (let d = 0; d < dim; d++) acc[d] += vectors[i][d];
      }
      if (!count) continue;
      let m = 0;
      for (let d = 0; d < dim; d++) m += acc[d] * acc[d];
      m = Math.sqrt(m) || 1;
      centres[c] = Array.from(acc, (x) => x / m);
    }
    if (!moved) break;
  }
  return assign;
}

/** push overlapping labels apart without destroying the structure */
function relax(pts, sizes, rounds = 220) {
  const p = pts.map(([x, y]) => [x, y]);
  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const need = (sizes[i] + sizes[j]) * 0.5;
        let dx = p[j][0] - p[i][0];
        let dy = p[j][1] - p[i][1];
        let d = Math.hypot(dx, dy);
        if (d > need || d === 0) continue;
        const push = (need - d) / 2;
        dx /= d;
        dy /= d;
        p[i][0] -= dx * push * 0.55;
        p[i][1] -= dy * push * 0.55;
        p[j][0] += dx * push * 0.55;
        p[j][1] += dy * push * 0.55;
      }
    }
  }
  return p;
}

/* ---------- run ---------- */

const docs = await loadDocs();
const { terms, vectors, df, tf, academic } = buildMatrix(docs, {});
const writingDocs = docs.filter((d) => d.kind === 'writing');
console.log(
  `corpus: ${writingDocs.length} written pieces + ${docs.length - writingDocs.length} academic records` +
    ` · vocabulary kept: ${terms.length} terms (${[...academic.values()].filter(Boolean).length} academic)`,
);

const n = terms.length;
const sim = Array.from({ length: n }, () => new Float64Array(n));
for (let i = 0; i < n; i++) {
  for (let j = i; j < n; j++) {
    const s = dot(vectors[i], vectors[j]);
    sim[i][j] = s;
    sim[j][i] = s;
  }
}
const D = Array.from({ length: n }, (_, i) =>
  Array.from({ length: n }, (_, j) => Math.sqrt(Math.max(0, 2 - 2 * sim[i][j]))),
);

const raw = mds(D);
const clusters = kmeans(vectors, 4);

// normalise into a 0..1000 x 0..620 field
const W = 1000;
const H = 620;
const xs = raw.map((p) => p[0]);
const ys = raw.map((p) => p[1]);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);

const scaled = raw.map(([x, y]) => [
  40 + ((x - minX) / (maxX - minX || 1)) * (W - 80),
  40 + ((y - minY) / (maxY - minY || 1)) * (H - 80),
]);

// label footprint scales with how often the term appears
const weights = terms.map((t) => df.get(t));
const maxDfv = Math.max(...weights);
const sizes = terms.map((t, i) => 22 + (weights[i] / maxDfv) * 26);
const placed = relax(scaled, sizes);

const nodes = terms.map((t, i) => {
  const neighbours = terms
    .map((other, j) => ({ other, s: sim[i][j], j }))
    .filter((c) => c.j !== i)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((c) => c.other);

  // the actual pieces this concept appears in, most-used first — makes each
  // node a way into the writing rather than a dead dot
  const used = docs
    .map((d, j) => ({ d, n: tf[j].get(t) ?? 0 }))
    .filter((c) => c.n > 0 && c.d.kind === 'writing')
    .sort((a, b) => b.n - a.n)
    .slice(0, 5)
    .map((c) => ({ id: c.d.id, title: c.d.title }));

  return {
    term: t,
    docs: weights[i],
    academic: !!academic.get(t),
    used,
    cluster: clusters[i],
    x: +Math.min(Math.max(placed[i][0], 18), W - 18).toFixed(1),
    y: +Math.min(Math.max(placed[i][1], 18), H - 18).toFixed(1),
    r: +(3 + (weights[i] / maxDfv) * 9).toFixed(1),
    neighbours,
  };
});

// a few strongest edges, so the clustering is visible as structure
const edges = [];
for (let i = 0; i < n; i++) {
  const best = terms
    .map((_, j) => ({ j, s: sim[i][j] }))
    .filter((c) => c.j !== i && c.s > 0.32)
    .sort((a, b) => b.s - a.s)
    .slice(0, 2);
  for (const b of best) {
    const key = i < b.j ? `${i}-${b.j}` : `${b.j}-${i}`;
    if (!edges.some((e) => e.key === key)) {
      edges.push({ key, a: Math.min(i, b.j), b: Math.max(i, b.j), s: +b.s.toFixed(3) });
    }
  }
}

await writeFile(
  OUT,
  JSON.stringify(
    {
      generated: 'run `npm run map` after writing something new',
      method: 'tf-idf term vectors over documents, cosine distance, classical MDS, k-means(4)',
      docs: writingDocs.length,
      academicDocs: docs.length - writingDocs.length,
      width: W,
      height: H,
      nodes,
      edges: edges.map(({ a, b, s }) => ({ a, b, s })),
    },
    null,
    2,
  ) + '\n',
);

console.log(`wrote ${OUT}: ${nodes.length} concepts, ${edges.length} edges`);
console.log('densest concepts:');
[...nodes]
  .sort((a, b) => b.docs - a.docs)
  .slice(0, 12)
  .forEach((nd) => console.log(`  ${nd.term.padEnd(28)} in ${nd.docs} pieces  → ${nd.neighbours.join(', ')}`));
