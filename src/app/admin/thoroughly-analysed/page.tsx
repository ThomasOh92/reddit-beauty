"use client";

import { useState, useEffect, useRef } from "react";
import type {
  ThoroughlyAnalysedProduct,
  EvidenceMolecule,
  EvidenceAtom,
  RedditEvidenceAtom,
  LinkEvidenceAtom,
  InstagramEvidenceAtom,
} from "../../thoroughly-analysed/types";
import { supabase } from "../../../../lib/supabaseClient";

/* ================================================================
   UTILITIES
   ================================================================ */

const STORAGE_KEY = "admin-ta-product";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const todayStr = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function emptyProduct(): ThoroughlyAnalysedProduct {
  return {
    name: "",
    slug: "",
    category: "",
    imageUrl: "",
    lastChecked: todayStr(),
    molecules: [],
  };
}

function emptyRedditAtom(id: string): RedditEvidenceAtom {
  return {
    id,
    kind: "reddit",
    headerParts: [],
    excerpt: "",
    postKind: "post",
    url: "",
    upvotes: "",
    posterDetails: "",
  };
}

function emptyLinkAtom(id: string): LinkEvidenceAtom {
  return { id, kind: "link", label: "", url: "" };
}

function emptyInstagramAtom(id: string): InstagramEvidenceAtom {
  return {
    id,
    kind: "instagramLink",
    user: "",
    excerptFromDescription: "",
    url: "",
  };
}

function toRedditProfileUrl(author: string): string {
  const clean = author.trim().replace(/^u\//i, "");
  if (!clean) return "https://www.reddit.com/user/";
  return `https://www.reddit.com/user/${clean}/`;
}

function subredditFromRedditUrl(url: string): string {
  try {
    const u = new URL(url);
    const sub = u.pathname.match(/\/r\/([^/]+)/i)?.[1];
    return sub ? `r/${decodeURIComponent(sub)}` : "";
  } catch {
    return "";
  }
}

function buildRedditHeaderParts(params: {
  postKind: "post" | "comment";
  postDate: string;
  subreddit: string;
  url: string;
  upvotes: string;
  followOnComments?: number;
}): string[] {
  const parts: string[] = [
    params.postKind === "post" ? "Reddit Post" : "Reddit Comment",
  ];

  if (params.postDate.trim()) parts.push(params.postDate);

  const subreddit = params.subreddit.trim() || subredditFromRedditUrl(params.url);
  if (subreddit) parts.push(subreddit);

  if (params.upvotes.trim()) parts.push(`Upvotes: ${params.upvotes.trim()}`);

  if (params.postKind === "post" && params.followOnComments != null) {
    parts.push(`Comments: ${params.followOnComments}`);
  }

  return parts;
}

function parseRedditHeaderParts(
  headerParts: string[] | undefined,
  url: string,
): { postDate: string; subreddit: string } {
  const parts = headerParts || [];

  const postDate =
    parts.find((part) => {
      const v = part.trim();
      return (
        !!v &&
        !/^Reddit\s+(Post|Comment)$/i.test(v) &&
        !/^r\//i.test(v) &&
        !/^Upvotes:/i.test(v) &&
        !/^Comments:/i.test(v)
      );
    }) || "";

  const subreddit =
    parts.find((part) => /^r\//i.test(part.trim()))?.trim() ||
    subredditFromRedditUrl(url);

  return { postDate, subreddit };
}

type PosterDetailsFields = {
  karma: string;
  contributions: string;
  redditAge: string;
};

function parsePosterDetails(posterDetails?: string): PosterDetailsFields {
  const source = posterDetails || "";
  return {
    karma:
      source
        .match(/Karma:\s*(.*?)\s*,\s*Contributions:/i)?.[1]
        ?.trim() || "",
    contributions:
      source
        .match(/Contributions:\s*(.*?)\s*,\s*Reddit\s*age:/i)?.[1]
        ?.trim() || "",
    redditAge: source.match(/Reddit\s*age:\s*(.+)$/i)?.[1]?.trim() || "",
  };
}

function formatPosterDetails(fields: PosterDetailsFields): string {
  return `Karma: ${fields.karma}, Contributions: ${fields.contributions}, Reddit age: ${fields.redditAge}`;
}

/* ── export code generator ─────────────────────── */

function esc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function q(s: string) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function val(s: string): string {
  if (!s) return '""';
  if (s.includes("\n")) return `\`${esc(s)}\``;
  return q(s);
}

function generateExport(p: ThoroughlyAnalysedProduct): string {
  let rCnt = 0;
  let lCnt = 0;
  let iCnt = 0;

  const moleculesStr = p.molecules
    .map((m, mi) => {
      const atomsStr = m.atoms
        .map((a) => {
          if (a.kind === "reddit") {
            rCnt++;
            const ra = a as RedditEvidenceAtom;
            const hpStr = ra.headerParts
              .map((h) => `\n              ${q(h)},`)
              .join("");
            let s = "          {\n";
            s += `            id: "reddit-${rCnt}",\n`;
            s += '            kind: "reddit",\n';
            s += `            headerParts: [${hpStr}\n            ],\n`;
            s += `            excerpt: ${val(ra.excerpt)},\n`;
            s += `            postKind: ${q(ra.postKind)},\n`;
            s += `            url: ${q(ra.url)},\n`;
            s += `            upvotes: ${q(ra.upvotes)},\n`;
            if (ra.followOnComments != null)
              s += `            followOnComments: ${ra.followOnComments},\n`;
            s += `            posterDetails: ${q(ra.posterDetails)},\n`;
            if (ra.additionalNote)
              s += `            additionalNote: ${val(ra.additionalNote)},\n`;
            if (ra.commentary)
              s += `            commentary: ${val(ra.commentary)},\n`;
            s += "          }";
            return s;
          }

          if (a.kind === "link") {
            lCnt++;
            const la = a as LinkEvidenceAtom;
            let s = "          {\n";
            s += `            id: "link-${lCnt}",\n`;
            s += '            kind: "link",\n';
            if (la.label) s += `            label: ${q(la.label)},\n`;
            s += `            url: ${q(la.url)},\n`;
            if (la.excerpt) s += `            excerpt: ${val(la.excerpt)},\n`;
            if (la.additionalNote)
              s += `            additionalNote: ${val(la.additionalNote)},\n`;
            if (la.commentary)
              s += `            commentary: ${val(la.commentary)},\n`;
            s += "          }";
            return s;
          }

          if (a.kind === "instagramLink") {
            iCnt++;
            const ia = a as InstagramEvidenceAtom;
            let s = "          {\n";
            s += `            id: "instagram-${iCnt}",\n`;
            s += '            kind: "instagramLink",\n';
            s += `            user: ${q(ia.user)},\n`;
            s += `            excerptFromDescription: ${val(ia.excerptFromDescription)},\n`;
            s += `            url: ${q(ia.url)},\n`;
            if (ia.additionalNote)
              s += `            additionalNote: ${val(ia.additionalNote)},\n`;
            if (ia.commentary)
              s += `            commentary: ${val(ia.commentary)},\n`;
            s += "          }";
            return s;
          }
          return "";
        })
        .join(",\n");

      let s = "      {\n";
      s += `        id: "molecule-${mi + 1}",\n`;
      s += `        point: ${val(m.point)},\n`;
      if (m.commentary) s += `        commentary: ${val(m.commentary)},\n`;
      s += `        atoms: [\n${atomsStr}\n        ],\n`;
      s += "      }";
      return s;
    })
    .join(",\n");

  let out = "  {\n";
  out += `    name: ${q(p.name)},\n`;
  out += `    slug: ${q(p.slug)},\n`;
  out += `    category: ${q(p.category)},\n`;
  out += `    imageUrl:\n      ${q(p.imageUrl)},\n`;
  if (p.productLink) out += `    productLink: ${q(p.productLink)},\n`;
  out += `    lastChecked: ${q(p.lastChecked)},\n`;
  out += `    molecules: [\n${moleculesStr}\n    ],\n`;
  if (p.curatorNote) out += `    curatorNote: ${val(p.curatorNote)},\n`;
  out += "  }";
  return out;
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function AdminPage() {
  const [product, setProduct] = useState<ThoroughlyAnalysedProduct>(
    emptyProduct(),
  );
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [redditAuthorByAtom, setRedditAuthorByAtom] = useState<
    Record<string, string>
  >({});
  const [resolvingAuthorByAtom, setResolvingAuthorByAtom] = useState<
    Record<string, boolean>
  >({});

  const exportDialogRef = useRef<HTMLDialogElement>(null);

  const [allProducts, setAllProducts] = useState<ThoroughlyAnalysedProduct[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("thoroughly_analysed_products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch products:", error.message);
        return;
      }

      const mapped = (data ?? []).map((row: Record<string, unknown>) => ({
        name: row.name as string,
        slug: row.slug as string,
        category: row.category as string,
        imageUrl: row.image_url as string,
        productLink: (row.product_link as string) ?? undefined,
        lastChecked: row.last_checked as string,
        curatorNote: (row.curator_note as string) ?? undefined,
        molecules: row.molecules as EvidenceMolecule[],
      }));

      setAllProducts(mapped);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (showExport) {
      exportDialogRef.current?.showModal();
    } else {
      exportDialogRef.current?.close();
    }
  }, [showExport]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProduct(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // Auto‑save on every change
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(product));
  }, [product, loaded]);

  // Toast helper
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const atomKey = (mi: number, ai: number) => `${mi}-${ai}`;

  const resolveRedditAuthor = async (mi: number, ai: number, url: string) => {
    if (!url) return;
    const key = atomKey(mi, ai);
    setResolvingAuthorByAtom((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch("/api/admin/fetch-reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      const author =
        typeof data?.author === "string" &&
        data.author !== "[deleted]" &&
        data.author !== "[removed]"
          ? data.author
          : "";

      setRedditAuthorByAtom((prev) => ({ ...prev, [key]: author }));

      if (!author) {
        flash("Could not resolve Redditor from this URL");
      }
    } catch {
      flash("Failed to resolve Redditor profile");
      setRedditAuthorByAtom((prev) => ({ ...prev, [key]: "" }));
    } finally {
      setResolvingAuthorByAtom((prev) => ({ ...prev, [key]: false }));
    }
  };

  /* ── immutable update helpers ─────────────────── */

  const up = (u: Partial<ThoroughlyAnalysedProduct>) =>
    setProduct((p) => ({ ...p, ...u }));

  const upMol = (mi: number, u: Partial<EvidenceMolecule>) =>
    setProduct((p) => ({
      ...p,
      molecules: p.molecules.map((m, i) => (i === mi ? { ...m, ...u } : m)),
    }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upAtom = (mi: number, ai: number, u: Record<string, any>) =>
    setProduct((p) => ({
      ...p,
      molecules: p.molecules.map((m, i) =>
        i === mi
          ? {
              ...m,
              atoms: m.atoms.map((a, j) =>
                j === ai ? ({ ...a, ...u } as EvidenceAtom) : a,
              ),
            }
          : m,
      ),
    }));

  const addMolecule = () =>
    up({
      molecules: [
        ...product.molecules,
        {
          id: `molecule-${product.molecules.length + 1}`,
          point: "",
          atoms: [],
        },
      ],
    });

  const removeMolecule = (mi: number) =>
    up({ molecules: product.molecules.filter((_, i) => i !== mi) });

  const moveMolecule = (mi: number, dir: -1 | 1) => {
    const arr = [...product.molecules];
    const ni = mi + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[mi], arr[ni]] = [arr[ni], arr[mi]];
    up({ molecules: arr });
  };

  const addAtom = (mi: number, kind: "reddit" | "link" | "instagramLink") => {
    const mol = product.molecules[mi];
    const count = mol.atoms.filter((a) => a.kind === kind).length + 1;
    const id =
      kind === "reddit"
        ? `reddit-${count}`
        : kind === "link"
          ? `link-${count}`
          : `instagram-${count}`;
    const atom =
      kind === "reddit"
        ? emptyRedditAtom(id)
        : kind === "link"
          ? emptyLinkAtom(id)
          : emptyInstagramAtom(id);
    upMol(mi, { atoms: [...mol.atoms, atom] });
  };

  const removeAtom = (mi: number, ai: number) =>
    upMol(mi, {
      atoms: product.molecules[mi].atoms.filter((_, i) => i !== ai),
    });

  const moveAtom = (mi: number, ai: number, dir: -1 | 1) => {
    const atoms = [...product.molecules[mi].atoms];
    const ni = ai + dir;
    if (ni < 0 || ni >= atoms.length) return;
    [atoms[ai], atoms[ni]] = [atoms[ni], atoms[ai]];
    upMol(mi, { atoms });
  };

  /* ── load / new ──────────────────────────────── */

  const loadExisting = (slug: string) => {
    const found = allProducts.find((p) => p.slug === slug);
    if (found) {
      setProduct(structuredClone(found));
      setRedditAuthorByAtom({});
      setResolvingAuthorByAtom({});
      flash(`Loaded: ${found.name}`);
    }
  };

  const newProduct = () => {
    setProduct(emptyProduct());
    setRedditAuthorByAtom({});
    setResolvingAuthorByAtom({});
    flash("New product started");
  };

  const copyExport = () => {
    navigator.clipboard.writeText(generateExport(product));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!loaded) return null;

  /* ── quick stats ─────────────────────────────── */
  const stats = {
    molecules: product.molecules.length,
    reddit: product.molecules.reduce(
      (n, m) => n + m.atoms.filter((a) => a.kind === "reddit").length,
      0,
    ),
    links: product.molecules.reduce(
      (n, m) => n + m.atoms.filter((a) => a.kind === "link").length,
      0,
    ),
    instagram: product.molecules.reduce(
      (n, m) => n + m.atoms.filter((a) => a.kind === "instagramLink").length,
      0,
    ),
  };

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-[1600px]">
        {/* ── Toast ───────────────────────── */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 rounded-lg bg-neutral px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        )}

        {/* ── Header ─────────────────────── */}
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div>
            <h1 className="text-lg font-bold text-amber-900">
              Admin: Thoroughly Analysed
            </h1>
            <p className="text-xs text-amber-700">
              Local only — not committed to git · auto‑saves to localStorage
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              className="select select-sm select-bordered"
              value=""
              onChange={(e) => e.target.value && loadExisting(e.target.value)}
            >
              <option value="">Load existing…</option>
              {allProducts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <button className="btn btn-sm btn-outline" onClick={newProduct}>
              New
            </button>
            <button
              type="button"
              className="btn btn-sm btn-neutral"
              onClick={() => setShowExport(true)}
            >
              📤 Export
            </button>
          </div>
        </div>

        {/* ── Side-by-side: Editor + Preview ── */}
        <div className="flex gap-6 items-start">
          {/* Left: Editor */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ── Product Info ────────────────── */}
            <details className="rounded-lg border bg-white p-4" open>
              <summary className="cursor-pointer text-sm font-semibold">
                Product Info
                {product.name && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    — {product.name}
                  </span>
                )}
              </summary>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-xs">Name</span>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={product.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      up({ name, slug: product.slug || toSlug(name) });
                    }}
                    placeholder="Product name"
                  />
                </label>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-xs">
                      Slug{" "}
                      <button
                        type="button"
                        className="text-[10px] text-blue-500 hover:underline"
                        onClick={() => up({ slug: toSlug(product.name) })}
                      >
                        ↻ regen
                      </button>
                    </span>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={product.slug}
                    onChange={(e) => up({ slug: e.target.value })}
                    placeholder="product-slug"
                  />
                </label>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-xs">Category</span>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={product.category}
                    onChange={(e) => up({ category: e.target.value })}
                    placeholder="e.g. Vitamin C Serum"
                  />
                </label>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-xs">Last Checked</span>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={product.lastChecked}
                    onChange={(e) => up({ lastChecked: e.target.value })}
                    placeholder="Feb 5, 2026"
                  />
                </label>
                <label className="form-control md:col-span-2">
                  <div className="label">
                    <span className="label-text text-xs">Image URL</span>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={product.imageUrl}
                    onChange={(e) => up({ imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </label>
                <label className="form-control md:col-span-2">
                  <div className="label">
                    <span className="label-text text-xs">
                      Product Link (optional — affiliate / buy link)
                    </span>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={product.productLink || ""}
                    onChange={(e) =>
                      up({ productLink: e.target.value || undefined })
                    }
                    placeholder="https://..."
                  />
                </label>
              </div>
            </details>

            {/* ── Stats bar ──────────────────── */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span>
                <strong>{stats.molecules}</strong> molecules
              </span>
              <span>
                <strong>{stats.reddit}</strong> reddit atoms
              </span>
              <span>
                <strong>{stats.links}</strong> link atoms
              </span>
              <span>
                <strong>{stats.instagram}</strong> instagram atoms
              </span>
            </div>
            {/* Curator Note */}
            <div className="rounded-lg border bg-white p-4">
              <label className="form-control">
                <div className="label">
                  <span className="label-text text-xs font-semibold">
                    Curator&apos;s Note (optional)
                  </span>
                </div>
                <textarea
                  className="textarea textarea-bordered textarea-sm w-full"
                  rows={4}
                  value={product.curatorNote || ""}
                  onChange={(e) =>
                    up({ curatorNote: e.target.value || undefined })
                  }
                  placeholder="Your personal note about this product…"
                />
              </label>
            </div>

            {/* ── Molecules ─────────────────── */}
            {product.molecules.map((mol, mi) => (
              <div
                key={mi}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                {/* molecule header */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="badge badge-neutral badge-sm">
                    Molecule {mi + 1}
                  </span>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => moveMolecule(mi, -1)}
                    disabled={mi === 0}
                  >
                    ↑
                  </button>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => moveMolecule(mi, 1)}
                    disabled={mi === product.molecules.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    className="btn btn-xs btn-error btn-outline ml-auto"
                    onClick={() => {
                      if (confirm("Remove this molecule and all its atoms?"))
                        removeMolecule(mi);
                    }}
                  >
                    Remove
                  </button>
                </div>

                <input
                  className="input input-bordered input-sm mb-2 w-full"
                  value={mol.point}
                  onChange={(e) => upMol(mi, { point: e.target.value })}
                  placeholder="Section heading / key point"
                />
                <textarea
                  className="textarea textarea-bordered textarea-xs w-full"
                  rows={2}
                  value={mol.commentary || ""}
                  onChange={(e) =>
                    upMol(mi, { commentary: e.target.value || undefined })
                  }
                  placeholder="Commentary (optional)"
                />

                {/* ── Atoms inside this molecule ─ */}
                <div className="mt-3 space-y-3">
                  {mol.atoms.map((atom, ai) => {
                    const kindLabel =
                      atom.kind === "reddit"
                        ? "Reddit"
                        : atom.kind === "instagramLink"
                          ? "Instagram"
                          : "Link";
                    const kindColor =
                      atom.kind === "reddit"
                        ? "border-red-200 bg-red-50"
                        : atom.kind === "instagramLink"
                          ? "border-purple-200 bg-purple-50"
                          : "border-blue-200 bg-blue-50";
                    const badgeColor =
                      atom.kind === "reddit"
                        ? "badge-error"
                        : atom.kind === "instagramLink"
                          ? "badge-secondary"
                          : "badge-info";

                    // summary label
                    let summaryLabel = "New atom";
                    if (atom.kind === "reddit")
                      summaryLabel =
                        (atom as RedditEvidenceAtom).url || "New Reddit atom";
                    else if (atom.kind === "link")
                      summaryLabel =
                        (atom as LinkEvidenceAtom).label || "New link";
                    else if (atom.kind === "instagramLink")
                      summaryLabel =
                        (atom as InstagramEvidenceAtom).user ||
                        "New Instagram atom";

                    return (
                      <details
                        key={ai}
                        className={`rounded-lg border p-3 ${kindColor}`}
                      >
                        <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold">
                          <span className={`badge badge-xs ${badgeColor}`}>
                            {kindLabel}
                          </span>
                          <span className="flex-1 truncate">
                            {summaryLabel}
                          </span>
                          <span
                            className="ml-auto flex gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={() => moveAtom(mi, ai, -1)}
                              disabled={ai === 0}
                            >
                              ↑
                            </button>
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={() => moveAtom(mi, ai, 1)}
                              disabled={ai === mol.atoms.length - 1}
                            >
                              ↓
                            </button>
                            <button
                              className="btn btn-xs btn-error btn-outline"
                              onClick={() => {
                                if (confirm("Remove this atom?"))
                                  removeAtom(mi, ai);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        </summary>

                        <div className="mt-3 space-y-2">
                          {/* ─── REDDIT ATOM ─── */}
                          {atom.kind === "reddit" &&
                            (() => {
                              const ra = atom as RedditEvidenceAtom;
                              const posterFields = parsePosterDetails(
                                ra.posterDetails,
                              );
                              const { postDate, subreddit } =
                                parseRedditHeaderParts(ra.headerParts, ra.url);
                              const key = atomKey(mi, ai);
                              const resolvedAuthor = redditAuthorByAtom[key] || "";
                              const isResolvingAuthor =
                                resolvingAuthorByAtom[key] || false;
                              return (
                                <>
                                  {/* url */}
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Reddit URL
                                      </span>
                                    </div>
                                    <input
                                      className="input input-bordered input-xs w-full"
                                      value={ra.url}
                                      onChange={(e) =>
                                        (setRedditAuthorByAtom((prev) => ({
                                          ...prev,
                                          [key]: "",
                                        })),
                                        upAtom(mi, ai, {
                                          url: e.target.value,
                                          headerParts: buildRedditHeaderParts({
                                            postKind: ra.postKind,
                                            postDate,
                                            subreddit:
                                              subredditFromRedditUrl(
                                                e.target.value,
                                              ) || subreddit,
                                            url: e.target.value,
                                            upvotes: ra.upvotes,
                                            followOnComments:
                                              ra.followOnComments,
                                          }),
                                        }))
                                      }
                                      onBlur={(e) =>
                                        resolveRedditAuthor(mi, ai, e.target.value)
                                      }
                                      placeholder="https://www.reddit.com/r/.../comments/..."
                                    />
                                  </label>

                                  {/* open links */}
                                  {ra.url && (
                                    <div className="flex gap-3 text-[10px]">
                                      <a
                                        href={ra.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="link link-primary"
                                      >
                                        Open post/comment ↗
                                      </a>
                                      {resolvedAuthor ? (
                                        <a
                                          href={toRedditProfileUrl(resolvedAuthor)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="link link-secondary"
                                        >
                                          Open Redditor&apos;s profile ↗
                                        </a>
                                      ) : (
                                        <span className="text-gray-400">
                                          {isResolvingAuthor
                                            ? "Resolving Redditor…"
                                            : "Open Redditor&apos;s profile (resolve URL first)"}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* row: post kind, date, subreddit */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Post Kind
                                        </span>
                                      </div>
                                      <select
                                        className="select select-bordered select-xs w-full"
                                        value={ra.postKind}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            postKind: e.target.value,
                                            headerParts: buildRedditHeaderParts({
                                              postKind: e.target.value as
                                                | "post"
                                                | "comment",
                                              postDate,
                                              subreddit,
                                              url: ra.url,
                                              upvotes: ra.upvotes,
                                              followOnComments:
                                                ra.followOnComments,
                                            }),
                                          })
                                        }
                                      >
                                        <option value="post">Post</option>
                                        <option value="comment">Comment</option>
                                      </select>
                                    </label>
                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Date
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        value={postDate}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            headerParts: buildRedditHeaderParts({
                                              postKind: ra.postKind,
                                              postDate: e.target.value,
                                              subreddit,
                                              url: ra.url,
                                              upvotes: ra.upvotes,
                                              followOnComments:
                                                ra.followOnComments,
                                            }),
                                          })
                                        }
                                        placeholder="e.g. Early 2025"
                                      />
                                    </label>
                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Subreddit
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        value={subreddit}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            headerParts: buildRedditHeaderParts({
                                              postKind: ra.postKind,
                                              postDate,
                                              subreddit: e.target.value,
                                              url: ra.url,
                                              upvotes: ra.upvotes,
                                              followOnComments:
                                                ra.followOnComments,
                                            }),
                                          })
                                        }
                                        placeholder="e.g. r/SkincareAddiction"
                                      />
                                    </label>
                                  </div>

                                  {/* row: upvotes, follow-on comments */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Upvotes
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        value={ra.upvotes}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            upvotes: e.target.value,
                                            headerParts: buildRedditHeaderParts({
                                              postKind: ra.postKind,
                                              postDate,
                                              subreddit,
                                              url: ra.url,
                                              upvotes: e.target.value,
                                              followOnComments:
                                                ra.followOnComments,
                                            }),
                                          })
                                        }
                                      />
                                    </label>
                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Follow‑on Comments
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        type="number"
                                        value={ra.followOnComments ?? ""}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            followOnComments: e.target.value
                                              ? Number(e.target.value)
                                              : undefined,
                                            headerParts: buildRedditHeaderParts({
                                              postKind: ra.postKind,
                                              postDate,
                                              subreddit,
                                              url: ra.url,
                                              upvotes: ra.upvotes,
                                              followOnComments:
                                                e.target.value
                                                  ? Number(e.target.value)
                                                  : undefined,
                                            }),
                                          })
                                        }
                                      />
                                    </label>
                                    <div />
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Karma
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        value={posterFields.karma}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            posterDetails: formatPosterDetails({
                                              ...posterFields,
                                              karma: e.target.value,
                                            }),
                                          })
                                        }
                                        placeholder="e.g. 12.4k"
                                      />
                                    </label>

                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Contributions
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        value={posterFields.contributions}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            posterDetails: formatPosterDetails({
                                              ...posterFields,
                                              contributions: e.target.value,
                                            }),
                                          })
                                        }
                                        placeholder="e.g. 734"
                                      />
                                    </label>

                                    <label className="form-control">
                                      <div className="label py-0">
                                        <span className="label-text text-[10px]">
                                          Reddit Age
                                        </span>
                                      </div>
                                      <input
                                        className="input input-bordered input-xs"
                                        value={posterFields.redditAge}
                                        onChange={(e) =>
                                          upAtom(mi, ai, {
                                            posterDetails: formatPosterDetails({
                                              ...posterFields,
                                              redditAge: e.target.value,
                                            }),
                                          })
                                        }
                                        placeholder="e.g. 4y"
                                      />
                                    </label>
                                  </div>

                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Commentary (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={2}
                                      value={ra.commentary || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          commentary:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>

                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Excerpt
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={6}
                                      value={ra.excerpt}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          excerpt: e.target.value,
                                        })
                                      }
                                      placeholder="Quote from the post/comment"
                                    />
                                  </label>

                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Additional Note (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={2}
                                      value={ra.additionalNote || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          additionalNote:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>
                                </>
                              );
                            })()}

                          {/* ─── LINK ATOM ─── */}
                          {atom.kind === "link" &&
                            (() => {
                              const la = atom as LinkEvidenceAtom;
                              return (
                                <>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        URL
                                      </span>
                                    </div>
                                    <input
                                      className="input input-bordered input-xs w-full"
                                      value={la.url}
                                      onChange={(e) =>
                                        upAtom(mi, ai, { url: e.target.value })
                                      }
                                      placeholder="https://..."
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Label
                                      </span>
                                    </div>
                                    <input
                                      className="input input-bordered input-xs w-full"
                                      value={la.label}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          label: e.target.value,
                                        })
                                      }
                                      placeholder="Display label"
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Excerpt (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={3}
                                      value={la.excerpt || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          excerpt:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Additional Note (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={2}
                                      value={la.additionalNote || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          additionalNote:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Commentary (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={2}
                                      value={la.commentary || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          commentary:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>
                                </>
                              );
                            })()}

                          {/* ─── INSTAGRAM ATOM ─── */}
                          {atom.kind === "instagramLink" &&
                            (() => {
                              const ia = atom as InstagramEvidenceAtom;
                              return (
                                <>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Instagram URL
                                      </span>
                                    </div>
                                    <input
                                      className="input input-bordered input-xs w-full"
                                      value={ia.url}
                                      onChange={(e) =>
                                        upAtom(mi, ai, { url: e.target.value })
                                      }
                                      placeholder="https://www.instagram.com/p/..."
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        User
                                      </span>
                                    </div>
                                    <input
                                      className="input input-bordered input-xs w-full"
                                      value={ia.user}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          user: e.target.value,
                                        })
                                      }
                                      placeholder="@username"
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Excerpt from Description
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={3}
                                      value={ia.excerptFromDescription}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          excerptFromDescription:
                                            e.target.value,
                                        })
                                      }
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Additional Note (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={2}
                                      value={ia.additionalNote || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          additionalNote:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>
                                  <label className="form-control">
                                    <div className="label py-0">
                                      <span className="label-text text-[10px]">
                                        Commentary (optional)
                                      </span>
                                    </div>
                                    <textarea
                                      className="textarea textarea-bordered textarea-xs w-full"
                                      rows={2}
                                      value={ia.commentary || ""}
                                      onChange={(e) =>
                                        upAtom(mi, ai, {
                                          commentary:
                                            e.target.value || undefined,
                                        })
                                      }
                                    />
                                  </label>
                                </>
                              );
                            })()}
                        </div>
                      </details>
                    );
                  })}
                </div>

                {/* add atom buttons */}
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn btn-xs btn-error btn-outline"
                    onClick={() => addAtom(mi, "reddit")}
                  >
                    + Reddit
                  </button>
                  <button
                    className="btn btn-xs btn-info btn-outline"
                    onClick={() => addAtom(mi, "link")}
                  >
                    + Link
                  </button>
                  <button
                    className="btn btn-xs btn-secondary btn-outline"
                    onClick={() => addAtom(mi, "instagramLink")}
                  >
                    + Instagram
                  </button>
                </div>
              </div>
            ))}

            {/* add molecule button */}
            <button
              className="btn btn-sm btn-neutral btn-outline w-full"
              onClick={addMolecule}
            >
              + Add Molecule
            </button>
          </div>

          {/* Right: Preview */}
          <div className="w-full max-w-[600px] shrink-0">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg bg-white p-4 shadow-md">
            {/* product header */}
            <section className="rounded-2xl border border-base-200 bg-[linear-gradient(125deg,#fff7ed,#f8fafc)] p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {product.imageUrl && (
                  <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    Thoroughly Analysed
                  </div>
                  <h1 className="text-xl font-bold text-neutral-900">
                    {product.name || "Product Name"}
                  </h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Category: {product.category || "—"}
                  </p>
                  {product.productLink && (
                    <a
                      href={product.productLink}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="btn btn-neutral mt-3 w-full text-white"
                    >
                      See Product
                    </a>
                  )}
                </div>
              </div>
              {product.curatorNote && (
                <div className="mt-4 text-xs text-neutral-700">
                  {product.curatorNote
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, idx) => (
                      <p key={idx} className="mt-2 first:mt-0">
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}
            </section>

            {/* molecules */}
            <div className="mt-4 grid gap-4">
              {product.molecules.map((mol, mi) => (
                <section
                  key={mi}
                  className="rounded-2xl border border-base-200 bg-white p-4 shadow-sm"
                >
                  <h2 className="mt-1 text-sm font-semibold text-neutral-900">
                    {mol.point || "(no point)"}
                  </h2>
                  {mol.commentary && (
                    <p className="mt-1 text-xs text-neutral-600">
                      {mol.commentary}
                    </p>
                  )}
                  <div className="mt-3 grid gap-2">
                    {mol.atoms.map((atom, ai) => {
                      /* ── reddit preview ── */
                      if (atom.kind === "reddit") {
                        const ra = atom as RedditEvidenceAtom;
                        return (
                          <article
                            key={ai}
                            className="rounded-xl bg-error/10 px-3 py-2"
                          >
                            <div className="flex gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                <img
                                  src="/reddit-icon.png"
                                  alt="Reddit"
                                  className="h-8 w-8 object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="line-clamp-1 text-[11px] font-semibold text-neutral-500">
                                  {(ra.headerParts || []).join(" | ")}
                                </p>
                                <p className="line-clamp-1 text-[11px] text-neutral-500">
                                  Poster&apos;s details as of{" "}
                                  {product.lastChecked}: {ra.posterDetails}
                                </p>
                                {ra.commentary && (
                                  <p className="line-clamp-1 text-[11px] text-neutral-700">
                                    {ra.commentary}
                                  </p>
                                )}
                                <details>
                                  <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                                    Read Quote
                                  </summary>
                                  <blockquote className="mt-3 space-y-3 border-l-3 border-neutral-300 pl-3 text-[11px] text-neutral-900">
                                    {ra.excerpt
                                      .split(/\n\s*\n/)
                                      .filter(Boolean)
                                      .map((p, pi) => (
                                        <p
                                          key={pi}
                                          className="whitespace-pre-line"
                                        >
                                          {p}
                                        </p>
                                      ))}
                                  </blockquote>
                                  <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                                    {ra.additionalNote && (
                                      <span className="w-full text-right text-xs text-neutral-500">
                                        {ra.additionalNote}
                                      </span>
                                    )}
                                    <a
                                      href={ra.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-sm btn-neutral"
                                    >
                                      Read on Reddit
                                    </a>
                                  </div>
                                </details>
                              </div>
                            </div>
                          </article>
                        );
                      }

                      /* ── instagram preview ── */
                      if (atom.kind === "instagramLink") {
                        const ia = atom as InstagramEvidenceAtom;
                        return (
                          <article
                            key={ai}
                            className="rounded-xl bg-secondary/10 px-3 py-2"
                          >
                            <a
                              href={ia.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex gap-3 transition hover:opacity-90"
                            >
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                                <img
                                  src="/instagram-icon.png"
                                  alt="Instagram"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-neutral-500">
                                  Instagram
                                </div>
                                <div className="text-[11px] font-semibold text-neutral-900">
                                  {ia.user}
                                </div>
                                <p className="line-clamp-1 text-[11px] text-neutral-500">
                                  {ia.excerptFromDescription}
                                </p>
                                {ia.commentary && (
                                  <p className="line-clamp-1 text-[11px] text-neutral-700">
                                    {ia.commentary}
                                  </p>
                                )}
                              </div>
                            </a>
                            {ia.additionalNote && (
                              <details className="mt-2 rounded-lg border border-base-200 bg-white p-2">
                                <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                                  See Note from Thorough Beauty
                                </summary>
                                <p className="mt-2 whitespace-pre-line text-[11px] text-neutral-600">
                                  {ia.additionalNote}
                                </p>
                              </details>
                            )}
                          </article>
                        );
                      }

                      /* ── link preview ── */
                      const la = atom as LinkEvidenceAtom;
                      let hostname = "";
                      try {
                        hostname = new URL(la.url).hostname;
                      } catch {
                        /* ignore */
                      }
                      return (
                        <article
                          key={ai}
                          className="rounded-xl bg-info/10 px-3 py-2"
                        >
                          <div className="flex gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-base-200" />
                            <div className="min-w-0">
                              <a
                                href={la.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group block transition hover:opacity-90"
                              >
                                <div className="text-[11px] font-semibold text-neutral-500">
                                  {hostname || "Link"}
                                </div>
                                <div className="text-[11px] font-semibold text-neutral-900">
                                  {la.label || "(no label)"}
                                </div>
                                {la.commentary && (
                                  <p className="line-clamp-1 text-[11px] text-neutral-700">
                                    {la.commentary}
                                  </p>
                                )}
                              </a>
                              {la.excerpt && (
                                <details>
                                  <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                                    Read Quote
                                  </summary>
                                  <blockquote className="mt-3 space-y-3 border-l-3 border-neutral-300 pl-3 text-[11px] text-neutral-900">
                                    {la.excerpt
                                      .split(/\n\s*\n/)
                                      .filter(Boolean)
                                      .map((p, pi) => (
                                        <p
                                          key={pi}
                                          className="whitespace-pre-line"
                                        >
                                          {p}
                                        </p>
                                      ))}
                                  </blockquote>
                                </details>
                              )}
                              {la.additionalNote && (
                                <details className="mt-2 rounded-lg border border-base-200 bg-white p-2">
                                  <summary className="cursor-pointer text-[11px] font-semibold text-neutral-700">
                                    See Note from Thorough Beauty
                                  </summary>
                                  <p className="mt-2 whitespace-pre-line text-[11px] text-neutral-600">
                                    {la.additionalNote}
                                  </p>
                                </details>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            {product.molecules.length === 0 && (
              <p className="mt-8 text-center text-sm text-gray-400">
                No molecules yet — add content on the left
              </p>
            )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            EXPORT OVERLAY
           ════════════════════════════════════ */}
        <dialog
          ref={exportDialogRef}
          className="rounded-xl border shadow-2xl p-0 backdrop:bg-black/40"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "600px",
            margin: 0,
          }}
          onClose={() => setShowExport(false)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
              setShowExport(false);
            }
          }}
        >
          <div className="flex flex-col w-full h-full p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Generated TypeScript</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm ${copied ? "btn-success" : "btn-neutral"}`}
                  onClick={copyExport}
                >
                  {copied ? "✓ Copied!" : "Copy to Clipboard"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowExport(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="mb-3 text-xs text-gray-500">
              Export of the current product data:
            </p>
            <pre className="flex-1 min-h-0 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-300">
              {generateExport(product)}
            </pre>
          </div>
        </dialog>
      </div>
    </div>
  );
}
