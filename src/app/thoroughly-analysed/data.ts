export type EvidenceAtomBase = {
  id: string;
  commentary?: string;
};

export type RedditEvidenceAtom = EvidenceAtomBase & {
  kind: "reddit";
  headerParts: string[];
  excerpt: string;
  postKind: "post" | "comment";
  url: string;
  upvotes: string;
  followOnComments: number;
  posterDetails: string;
  additionalNote?: string;
};

export type LinkEvidenceAtom = EvidenceAtomBase & {
  kind: "link";
  label: string;
  url: string;
};

export type EvidenceAtom = RedditEvidenceAtom | LinkEvidenceAtom;

export type EvidenceMolecule = {
  id: string;
  point: string;
  atoms: EvidenceAtom[];
};

export type ThoroughlyAnalysedProduct = {
  name: string;
  slug: string;
  category: string;
  imageUrl: string;
  productLink?: string;
  lastChecked: string;
  molecules: EvidenceMolecule[];
  curatorNote?: string;
};

export const thoroughlyAnalysedProducts: ThoroughlyAnalysedProduct[] = [
  {
    name: "Skinceuticals C E Ferulic",
    slug: "skinceuticals-ce-ferulic",
    category: "Vitamin C Serum",
    imageUrl:
      "https://www.skinceuticals.co.uk/dw/image/v2/AAQP_PRD/on/demandware.static/-/Sites-skc-master-catalog/default/dw0ed123c8/Products/635494363210/635494363210_C-E-Ferulic-30ml_SkinCeuticals.jpg?sw=930&sfrm=jpg&q=70",
    productLink: "https://www.awin1.com/cread.php?awinmid=90791&awinaffid=2764518&ued=https%3A%2F%2Fwww.stylevana.com%2Fen_US%2Fskin-ceuticals-c-e-ferulic-30ml90514.html",
    lastChecked: "Feb 5, 2026",
    molecules: [
      {
        id: "molecule-1",
        point:
          "Reddit discussions I picked out",
        atoms: [
          {
            id: "reddit-1",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "Subreddit: r/Beauty",
              "Upvotes: 1.1k",
              "Comments: 196",
            ],
            excerpt: `Ya'll, I’ve been on a long long journey to find the perfect Vitamin C serum for my skin ....Skinceuticals C E Ferulic

        Price: $$$ (Yeah, it’s expensive)

        Review: This is the holy grail of Vitamin C serums, and I totally get why. It’s packed with 15% L-ascorbic acid, Vitamin E, and ferulic acid. I noticed a visible difference in my skin tone within 2 weeks. My dark spots faded, and my complexion looked amaze!

        Pros: Clinically proven formula, works FAST, perfect for sensitive skin (no irritation)...Cons: The price is ouch ($182 for 1 oz), the smell is… weird (like hot dog water, but you get used to it)

        Verdict: Worth it if you can afford it. I repurchased twice but had to take breaks because of the cost

        Tldr..If money isn’t an issue, Skinceuticals is the clear winner...`,
            postKind: "post",
            url: "https://www.reddit.com/r/beauty/comments/1j76ffp/been_using_all_popular_vit_c_serums_for_the_past/",
            upvotes: "1.1k",
            followOnComments: 196,
            posterDetails: "Karma: 2,993; Contributions: 173; Reddit age: 5y.",
          },
          {
            id: "reddit-2",
            kind: "reddit",
            headerParts: [
              "Reddit post",
              "Posted: August 2025",
              "Subreddit: r/SkincareAddiction",
              "Upvotes: 143",
              "Comments: 73",
            ],
            excerpt:
              `[Review] Why are we still paying $$$ for SkinCeuticals CE Ferulic?
          
            Honestly… can we talk about how overhyped and overpriced this serum is?

            Mine oxidized before I even got halfway through the bottle — turned into that orange mess. For that price, I expected magic, not orange juice sitting on my shelf 😤

            Feels like we’re all just paying for the “dermatologist approved” label at this point…
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/1mvlly1/review_why_are_we_still_paying_for_skinceuticals/",
            upvotes: "143",
            followOnComments: 73,
            posterDetails: "Karma: 325; Contributions: 82; Reddit age: 5y.",
            additionalNote:
              "This post has a lot of follow-on comments. Dupes were discussed, particularly in light of the patent expiration.",
          },
          {
            id: "reddit-3",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Posted: Early 2025",
              "Subreddit: r/30PlusSkinCare",
              "Upvotes: 84",
              "Comments: 21",
            ],
            excerpt:
              `Skinceuticals CE Ferulic: Tips to Prevent Oxidation and Maximize Your Investment
   
          I've been using Skinceuticals CE Ferulic for over seven years, and it remains my holy grail vitamin C serum. It’s still the gold standard of antioxidant serums, and I have yet to find one that comes close.

          That said, it’s undeniably expensive, and given the current economic climate, going through a bottle every month isn’t feasible for many. On top of that, vitamin C serums oxidize quickly, losing their effectiveness. Over the years, I’ve developed a method to keep my CE Ferulic fresh and extend its lifespan, allowing me to buy it only twice a year.

          When I receive my CE Ferulic order, I always check the manufacturing date to ensure the serum was made within the last six months for maximum freshness. Once I confirm the date, I use a pipette to transfer about 5-6 mL into small glass vials, each lasting me about a month. I store all the filled vials in the fridge, except for the one I’m actively using, which stays on my skincare shelf.

          This approach helps slow oxidation and maintains the serum’s effectiveness over time. I bought the little vials from Amazon. My husband brought me the pipettes from his lab, but I’ve found that similar pipettes are available on Amazon. While I reuse the vials, I always discard the pipette after each transfer to keep things sanitary.

          Hope this helps someone optimize their anti-oxidant game!
          `,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/1jc50g3/skinceuticals_ce_ferulic_tips_to_prevent/",
            upvotes: "84",
            followOnComments: 21,
            posterDetails: "Karma: 3,585; Contributions: 388; Reddit age: 4y.",
            additionalNote: "Poster was responsive to follow on comments.",
          },
        ],
      },
      {
        id: "molecule-2",
        point:
          "Helpful Links: Ingredient Guidance, Labmuffin's thoughts, Sources that talk about Patent Expiry",
        atoms: [
          {
            id: "link-1",
            kind: "link",
            label: "Ingredient breakdown (INCI Decoder)",
            url: "https://incidecoder.com/products/skinceuticals-c-e-ferulic-antioxidant-vitamin-c-serum",
          },
          {
            id: "link-4",
            kind: "link",
            label: "Lab Muffin guidance",
            url: "https://labmuffin.com/ultimate-guide-to-vitamin-c-skincare-part-1-ascorbic-acid-with-video/",
          },
          {
            id: "link-2",
            kind: "link",
            label: "Patent expired (Allure)",
            url: "https://www.allure.com/story/skinceuticals-ce-ferulic-patent-expired",
          },
          {
            id: "link-3",
            kind: "link",
            label: "Patent expired (BTLJ)",
            url: "https://btlj.org/2025/06/the-patents-behind-your-skincare-routine/",
          }
        ]
      }
    ],
    curatorNote: `I picked out these 3 Reddit comments as they had really good engagement and upvotes. There is some useful debate about the price, 'worth-it-ness', dupes coming out, and even some how-to guidance for using/storing the product.

        I've also included links below to INCIDecoder (for ingredient guidance), Lab Muffin (to understand Vit C serums generally), and a couple of good sources that talk about the patent expiring on this product (a hot topic in 2025)

        Hope it's helpful! --- Thomas`,
  },
];
