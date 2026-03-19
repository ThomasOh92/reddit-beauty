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
  followOnComments?: number;
  posterDetails: string;
  additionalNote?: string;
};

export type LinkEvidenceAtom = EvidenceAtomBase & {
  kind: "link";
  label?: string;
  url: string;
  excerpt?: string;
  additionalNote?: string;
};

export type InstagramEvidenceAtom = EvidenceAtomBase & {
  kind: "instagramLink";
  user: string;
  excerptFromDescription: string;
  url: string;
  additionalNote?: string;
};

export type EvidenceAtom = RedditEvidenceAtom | LinkEvidenceAtom | InstagramEvidenceAtom;

export type EvidenceMolecule = {
  id: string;
  point: string;
  commentary?: string;
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
        point: "Reddit discussions on whether it's value for money",
        commentary: "I picked these two discussions as they had really good engagement and upvotes. ",
        atoms: [
          {
            id: "reddit-1",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/Beauty",
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
            posterDetails: "Karma: 2,993, Contributions: 173, Reddit age: 5y.",
          },
          {
            id: "reddit-2",
            kind: "reddit",
            headerParts: [
              "Reddit post",
              "Posted: August 2025",
              "r/SkincareAddiction",
              "Upvotes: 143",
              "Comments: 73",
            ],
            excerpt: `[Review] Why are we still paying $$$ for SkinCeuticals CE Ferulic?
          
            Honestly… can we talk about how overhyped and overpriced this serum is?

            Mine oxidized before I even got halfway through the bottle — turned into that orange mess. For that price, I expected magic, not orange juice sitting on my shelf 😤

            Feels like we’re all just paying for the “dermatologist approved” label at this point…
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/1mvlly1/review_why_are_we_still_paying_for_skinceuticals/",
            upvotes: "143",
            followOnComments: 73,
            posterDetails: "Karma: 325, Contributions: 82, Reddit age: 5y.",
            additionalNote: "This post has a lot of follow-on comments. Dupes were discussed, particularly in light of the patent expiration.",
          }
        ],
      },
      {
        id: "molecule-2",
        point: "Patent Expiry and what it could mean for you",
        commentary: "As I researched I realise a lot of people feel since the patent has expired, you should just switch to the dupes (see above). I included resources below that talk about the patent expiry + a Reddit comment that provides an opposite view",
        atoms: [
          {
            id: "link-1",
            kind: "link",
            label: "Patent expired (Allure)",
            url: "https://www.allure.com/story/skinceuticals-ce-ferulic-patent-expired",
          },
          {
            id: "link-2",
            kind: "link",
            label: "Patent expired (BTLJ)",
            url: "https://btlj.org/2025/06/the-patents-behind-your-skincare-routine/",
          },
          {
            id: "reddit-3",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "October 2025",
              "r/SkincareAddiction",
              "Upvotes: 33",
            ],
            excerpt: `...
If I ever hear about a cheaper alternative/“dupe” that people swear by I’ll try it out but if it’s “if it ain’t broke don’t fix it” for me right now.

Patents expiring is given much more weight than it should be. The company has the supply chain and formulation process figured out. They are not required to disclose every single detail regarding those things in the patent and some of them might amount to trade secrets. It’s a similar reason that even when drug patents expire the company owning the patents often remains the market leader for years. Plus brand recognition etc. Simply copying the ingredients is not going to give you the same exact product.

I’m not just blindly defending them. The pricing is greedy. But I’m still willing to pay for what it does for my skin, personally.`,
            postKind: "comment",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/1mvlly1/comment/n9s1vlq/",
            upvotes: "33",
            followOnComments: 5,
            posterDetails: "Karma: 129,902, Contributions: 4,236, Reddit age: 8y",
          }
        ],
      },
      {
        id: "molecule-3",
        point: "Helpful Links: Ingredient Guidance and LabMuffin's thoughts",
        commentary: "Labmuffin reviews Skinceuticals specifically. ",
        atoms: [
          {
            id: "link-3",
            kind: "link",
            label: "Ingredient breakdown (INCI Decoder)",
            url: "https://incidecoder.com/products/skinceuticals-c-e-ferulic-antioxidant-vitamin-c-serum",
          },
          {
            id: "link-4",
            kind: "link",
            label: "Lab Muffin guidance",
            url: "https://labmuffin.com/ultimate-guide-to-vitamin-c-skincare-part-1-ascorbic-acid-with-video/",
          }
        ],
      },
      {
        id: "molecule-4",
        point: "Preventing Oxidation (Especially because it's so expensive)",
        atoms: [
          {
            id: "reddit-4",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/30PlusSkinCare",
              "Upvotes: 84",
              "Comments: 21",
            ],
            excerpt: `Skinceuticals CE Ferulic: Tips to Prevent Oxidation and Maximize Your Investment
   
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
            posterDetails: "Karma: 3585, Contributions: 388, Reddit age: 4y",
          }
        ],
      }
    ],
    curatorNote: `(Updated 3 Mar 2025) 

I updated this as I did more research. The key themes about Skinceuticals CE Ferulic remain the same. Is it worth it? Especially with the patent expiring? Should I go with dupes? I mainly reorganised this, but I did surface one extra comment on patent expiry.

By the way if you do get this product, I highly suggest reading the final reddit post at the bottom about storage/usage tips so it lasts longer.

        Hope it's helpful! --- Thomas`,
  },
  {
    name: "Biore UV Aqua Rich (Various Types - Watery Essence, Gel, etc.)",
    slug: "biore-uv-aqua-rich",
    category: "Sunscreen",
    productLink: "https://amzn.to/4numwyL",
    imageUrl:
      "https://m.media-amazon.com/images/I/81GgAvXFcWL._AC_SX425_.jpg",
    lastChecked: "Feb 14, 2026",
    molecules: [
      {
        id: "molecule-1",
        point: "Super loved on Reddit. Included in Lab Muffin's 2024 recommendations.",
        atoms: [
          {
            id: "reddit-1",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "Early 2024",
              "r/30PlusSkinCare",
              "Upvotes: 123",
            ],
            excerpt: `Biore Aqua watery essence. Every.single.person in my life who hates sunscreen (and won't wear it), is changed by this product.

            I personally love it because I can put it on like a moisturizer by itself or I can apply it over my oil step. Either way it just soaks it in beautifully and it is a very effective SPF. It's also a Japanese product so it has much better sunscreen standards than the US.
            `,
            postKind: "comment",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/164pkoa/comment/jy9r196/",
            upvotes: "123",
            posterDetails: "Karma: 91,925, Contributions: 12,236, Reddit age: 4y.",
          },
          {
            id: "reddit-2",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/AsianBeauty",
              "Upvotes: 70",
              "Comments: 53",
            ],
            excerpt: `Recently ordered this online a few weeks ago. I’ve used it for a couple of weeks now, and overall loving this sunscreen!!

            It’s broad spectrum, so it protects against both UVA and UVB rays, with a 50 SPF punch!

            I have darker tan skin, and this left absolutely ZERO white cast. I have fairly sensitive skin, but this didn’t burn or tingle at all. No breakouts from usage either.

            There IS a quite strong scent, which really caught me off guard initially. It almost has a chemically/alcohol-y scent. Luckily it goes away after a few minutes, but it knocked me off my feet the first time I opened the bottle! I thought my sensitive skin would HATE this scent, but it’s completely unbothered. It doesn’t make my eyes water either.

            It feels softly natural on my face, not matte nor dewy.`,
            postKind: "post",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1fw2zyd/biore_uv_aqua_rich_spf_50_review/",
            upvotes: "70",
            followOnComments: 53,
            posterDetails: "Karma: 13,800, Contributions: 1,926, Reddit age: 5y",
          },
          {
            id: "reddit-3",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2024",
              "r/AsianBeauty",
              "Upvotes: 9",
              "Comments: 23",
            ],
            excerpt: `Has anyone tried the Biore UV Aqua Rich Watery Gel?
            ...
            Edit: It works well for me, I didn't break out and it kept my skin pretty moistured and didn't irritate my existing closed comedones. The alcohol smell is really strong but dissipates really quickly. Great purchase for both quality and quantity. Thank for all of your help.
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1dyqbdu/has_anyone_tried_the_biore_uv_aqua_rich_watery_gel/",
            upvotes: "9",
            followOnComments: 23,
            posterDetails: "Karma: 755, Contributions: 313, Reddit age: 5y.",
          },
          {
            id: "reddit-4",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "Early 2024",
              "r/AsianBeauty",
              "Upvotes: 13"
            ],
            excerpt: `hi i just recently watched a very thorough video on sunscreen and sun protection, and i was very surprised that biore uv aqua rich performed the best out of all the products:

            https://youtu.be/JckfmlbU5C8?si=4aNJbgUsatBgiC4A

            i also own the sunscreen, i use it as my daily. I have combo skin, and usually when u start to sweat and oil up i just wipe a little around my eyes since it hurts when it gets to my eyes. but overall it's pretty good, going to stock up plenty more of this soon as well`,
            postKind: "comment",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1dyqbdu/comment/lcagzlk/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
            upvotes: "13",
            posterDetails: "Karma: 636, Contributions: 227, Reddit age: 2y.",
          },
          {
            id: "reddit-5",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2023",
              "r/IndianSkincareAddicts",
              "Upvotes: 67",
              "Comments: 128",
            ],
            excerpt: `I have tried SO MANY sunscreens. Nothing NOTHING beats the Biorè UV Aqua Rich watery essence. First of all, no white cast. Secondly, it has passed the UV Test so there is guaranteed protection which i the MOST important criterion to me but even among the small list of approved sunscreens, this is the only one which meets all my criteria including easy availability. Thirdly, it is easily available on Nykaa and many a times it is on a considerable discount too. Fourthly, it is waterproof I would also like to repeat, there is absolutely no white cast (although the skin does shine but that is still more presentable than a white cast and also looks glowy and good sometimes). Yeah I also use up one tube every 20-25ish days but it is cheaper than some other good brands. The alcohol smell does come through but it has never caused a problem to my skin tbh.`,
            postKind: "post",
            url: "https://www.reddit.com/r/IndianSkincareAddicts/comments/133xww7/why_is_bior%C3%A8_uv_aqua_rich_watery_essence_not_a/",
            upvotes: "67",
            followOnComments: 128,
            posterDetails: "Karma: 1,879, Contributions: 135, Reddit age: 5y.",
          },
          {
            id: "link-1",
            kind: "link",
            label: "Lab Muffin: Top Sunscreens 2024 (Biore Aqua Rich Watery Essence 2023)",
            url: "https://labmuffin.com/top-sunscreens-2024-part-1-japanese-sunscreens/#Biore_Aqua_Rich_Watery_Essence_2023",
          },
        ],
      },
      {
        id: "molecule-2",
        point: "Different types (Essence, Gel, etc.)",
        atoms: [
          {
            id: "reddit-6",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2023",
              "r/SkincareAddiction",
              "Upvotes: 74",
              "Comments: 38",
            ],
            excerpt: `Looking into Bioré UV’s Aqua Rich sunscreens… thoughts on the Watery Essence versus the Watery Gel? I have oily skin
            ...
            [Several comments below where people discuss the differences between the types and which they prefer.]
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/14ynkaz/sun_care_looking_into_bior%C3%A9_uvs_aqua_rich/",
            upvotes: "74",
            followOnComments: 38,
            posterDetails: "Karma: 467,196, Contributions: 12,355, Reddit age: 4y."
          },
          {
            id: "reddit-7",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "Early 2024",
              "r/AsianBeauty",
              "Upvotes: 33"
            ],
            excerpt: `Often [the difference between the types] just the consistency.

            I like the “Water Essence” the most. Feels like a face moisturiser.

            I’m currently trying out the “Aqua protection lotion”, it’s more watery but still good. I prefer the watery essence tho, it’s thicker.

            The tone up one leaves a white cast to make you look whiter, not create for those with darker skin tones, not even that nice of lighter skin tones 😂😂

            Their red one I believe is anti aging or something like that?

            They have a spray one which is very lightweight.

            From the ones I’ve tried, only the tone up one leaves a white cast ! I love the Biore sunscreens, I have darkskin and these days my skin is very dry. The Watery Essence and Aqua Protection Lotion ones are the best for my skin type BUT I still need to have a moisturiser in before or else it feels dry quickly.
            `,
            postKind: "comment",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1cta46s/comment/l4bny2y/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button",
            upvotes: "33",
            posterDetails: "Karma: 48, Contributions: 13, Reddit age: 2y.",
          },
          {
            id: "link-2",
            kind: "link",
            label: "YouTube: Biore UV Aqua Rich overview",
            url: "https://www.youtube.com/watch?v=E8Bw63vFdnc",
          },
        ],
      },
      {
        id: "molecule-3",
        point: "Formulation change (2023 and 2025) in Japan/Asia",
        atoms: [
          {
            id: "reddit-8",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "April 2025",
              "r/AsianBeauty",
              "Upvotes: 359",
              "Comments: 46",
            ],
            excerpt: `I compared the 2023 and 2025 versions of Biore UV Aqua Rich Watery Essence -- same iconic sunscreen, but a few formula changes that make a subtle difference.

            ☀️ Formula Differences:
            The 2025 version has a few changes: it added silica, dipropylene glycol, isohexadecane, and ascorbyl glucoside, while removing some emollients and silicones like dimethicone and hydrogenate polyisobutene found in the 2023 version. These changes could possibly result in a more lightweight, less emollient feel overall.

            ☀️ How It Feels on Skin:
            I applied the 2023 version on the left side of my face and the 2025 on the right, using the full recommended amount. At first, they felt and looked nearly identical. Both sides look dewy. But once they set, I noticed the 2023 side felt a bit more emollient to the touch. As someone with oily skin, that side started to feel a little greasy, while the 2025 reformulation feels just a bit less emollient.

            ☀️ Final Thoughts:
            They smell the same and feel very similar overall, but that very slight difference in feel makes me prefer the 2025 version..`,
            postKind: "post",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1jyv4cj/review_biore_uv_aqua_rich_watery_essence_2023_vs/",
            upvotes: "359",
            followOnComments: 46,
            posterDetails: "Karma: 1,721, Contributions: 292, Reddit age: 2y.",
          },
          {
            id: "reddit-9",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "December 2025",
              "r/AsianBeauty",
              "Upvotes: 53",
              "Comments: 19",
            ],
            excerpt: `Biore UV Aqua Rich, new formula 👎🏻👎🏻
            Review
            When I was in Japan I bought a bunch of UV Aqua Rich watery essence, only to find that they’ve changed the formula. It feels very oily now and breaks me out. It also feels somehow gritty, so much that I don’t even like wearing it on my arms. Shiny too, like it has silica in it?

            The old version was my grail. It felt very light and watery. I didn’t mind that it was alcohol based, it seemed to absorb very fast, leaving my skin hydrated but not oily, with no residue.`,
            postKind: "post",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1pjvsqi/biore_uv_aqua_rich_new_formula/",
            upvotes: "53",
            followOnComments: 19,
            posterDetails: "Account Deleted",
          },
          {
            id: "link-3",
            kind: "link",
            label: "INCI Decoder search: Biore UV Aqua",
            url: "https://incidecoder.com/search?query=biore+uv+aqua",
            additionalNote: `I saw INCIDecoder has submissions for 2018/2019, 2023 and 2025 formulations of the Watery Essence. There was also a submission for 2025 formulation of the Aqua Protection Lotion, and a submission for the 2019 formulation of the Gel.
            
            They also have a lot of submissions that do not state a formulation date. But you can see when the submission was made (e.g. 2020, 2021) to try to infer which batch it is likely to be.`
          },
        ],
      },
      {
        id: "molecule-4",
        point: "Formulation differs based on region (especially Japan vs North America)",
        commentary: "I found evidence for difference in formulation between Japan/Asia vs North America (first 2 Reddit posts, Instagram link), and even Philippines appears to have it's own formulation (last Reddit post).",
        atoms: [
          {
            id: "reddit-10",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/AsianBeauty",
              "Upvotes: 122",
              "Comments: 48",
            ],
            excerpt: `Looks like they brought Biore Aqua Rich to the Americas. Has anyone tried this American formulation?...
            
            [Follow on comments discuss the differences and preferences between the Japanese and American formulations.]`,
            postKind: "post",
            url: "https://www.reddit.com/r/AsianBeauty/comments/1hi0s8f/looks_like_they_brought_biore_aqua_rich_to_the/",
            upvotes: "122",
            followOnComments: 48,
            posterDetails: "Karma: 6,546, Contributions: 433, Reddit age: 12y.",
          },
          {
            id: "reddit-11",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/CostcoCanada",
              "Upvotes: 157",
              "Comments: 41",
            ],
            excerpt: `I just wanted to share this comparison since I bought one from Japan last year. The Japanese Biore is on the left, and the Canadian version from Costco is on the right. 
            
            The Japanese version is lighter in shade and more translucent compared to the Canadian version, which is whiter in color. I haven't noticed any white cast so far. The Canadian sunscreen has the typical sunscreen smell, while the Japanese version, on the other hand, has a stronger alcohol smell. 
            
            I prefer the Japanese sunscreen because it feels more watery, unlike the Canadian one, which is thicker in texture. 
            
            Overall, I don't mind getting the Canadian version from Costco because it's more accessible, cheaper to buy in bulk, and it doesn't leave a white cast like the Japanese version. But I'll definitely buy the Japanese sunscreen if I visit Japan again.`,
            postKind: "post",
            url: "https://www.reddit.com/r/CostcoCanada/comments/1j9a6s7/biore_sunscreen_review_japanese_vs_canadian/",
            upvotes: "157",
            followOnComments: 41,
            posterDetails: "Karma: 346, Contributions: 133, Reddit age: 3y.",
          },
          {
            id: "instagram-1",
            kind: "instagramLink",
            user: "@fiddlynails",
            excerptFromDescription: "...If you see the Biore UV Aqua Rich Watery Essence in Costco or Target or whatever literally any US or North American corporate chain retail store, that is not the same one that is sold in Asia",
            url: "https://www.instagram.com/p/DMY6CMGyvTq/",
          },
          {
            id: "reddit-12",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "April 2025",
              "r/beautytalkph",
              "Upvotes: 48",
              "Comments: 22",
            ],
            excerpt: `So I recently got curious and decided to compare the ingredients list of two Biore UV Aqua Rich Watery Essence sunscreens, both in the same 2023 packaging (the light blue gradient tube). One is the Japan version, and the other is what's being sold locally here in the Philippines.
            ...
            I thought they’d be identical since the packaging looks the same. But when I compared their ingredients, there are some minor differences:

            Methacrylate Crosspolymer:
            - JP version uses Methacrylate/Sodium Methacrylate Crosspolymer
            - PH version uses Lauryl Methacrylate/Sodium Methacrylate Crosspolymer (probably a minor difference)

            Emulsifier
            - JP: Sorbitan Isostearate
            - PH: Sorbitan Distearate (tends to be a bit richer/emollient-feeling)

            Extra Additives in PH version
            - Tocopherol (Vitamin E)
            - Methylparaben (extra preservative). This makes sense for our climate tbh since it’s hotter and more humid here.

            I honestly didn’t expect the formulations to differ at all. I assumed it was all just the same Japanese-made stuff being distributed regionally, but looks like the PH version is tweaked for local conditions probably for shelf stability and slightly different skin needs.
            ...
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/beautytalkph/comments/1jv2r08/same_packaging_different_formulas_biore_uv_aqua/",
            upvotes: "48",
            followOnComments: 22,
            posterDetails: "Karma: 1,721, Contributions: 292, Reddit age: 2y.",
          }
        ],
      }
    ],
    curatorNote: `The Biore UV Aqua Rich range of products is extremely popular on Reddit. I picked out a few posts on it but there are many 'HG' lists that mention it. 
    
    There are a two points I want to highlight too: (1) Within the range there are essences, gels, etc., (2) There are regional differences in formulations, in particulra between Japan/Asia vs North America. Even Philippines appears to have it's own formulation, according to one Reddit post. 
    
    Happy Hunting! (I use the Jap version myself personally btw) -- Thomas`,
  },
  {
    name: "Medik8 Crystal Retinal (Various Strengths)",
    slug: "medik8-crystal-retinal",
    category: "Retinal",
    imageUrl: "https://m.media-amazon.com/images/I/61OgMDOk3QL._AC_SL1500_.jpg",
    productLink: "https://amzn.to/3LgE4RM",
    lastChecked: "Feb 18, 2026",
    molecules: [
      {
        id: "molecule-1",
        point: "Couple of Reddit discussions that are very positive about the product",
        atoms: [
          {
            id: "reddit-1",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2024",
              "r/SkincareAddiction",
              "39 upvotes",
              "101 comments",
            ],
            excerpt: `For those of you who have tried, did you notice any improvement? I'm really scared to spend $120 on a skincare product but I'm 28yo, starting to see some lines and wrinkles, and I want to invest in myself.

            Or am I better off spending the money going to a dermatologist and have them recommend me something that will most likely bring me some real results.

            [follow on comments below]
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/1b9y1gd/review_medik8_crystal_retinal_is_it_worth_the/",
            upvotes: "39",
            posterDetails: "Karma: 12,819, Contributions: 1,598, Reddit age: 4y.",
            commentary: `There are also a few follow-on comments discussing alternatives`
          },
          {
            id: "reddit-2",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/SkincareAddictionLux",
              "53 upvotes",
              "60 comments",
            ],
            excerpt: `Based on everyone's suggestions in this sub, I decided to switch to Medik8 Crystal Retinal from my regular retinal. It's been a little over a week and I have already seen such improvements. NO THIS IS NOT A PAID AD, I am just genuinely impressed. 
            
            I'm starting with the 6 and will move up to the 10 once this tube is gone. They sent me a sample of the new peptide serum so I've been using that alongside the retinal about 3x a week too, so I don't know if that's amping up the effects or what. Mostly my forehead fine lines are most noticeably less. My overall skin tone and texture look pretty great too, but they weren't bad to start with. One question though, did any of you notice a "cinnamon" smell to the CR6?? Do they all smell like that? That's my only complaint. I LOVE the texture of it, but the smell is kind of odd and off-putting. Anyways, thanks for the suggestions!! I'm loving their products so far!!
          `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1iwaepo/wow_so_impressed_with_medik8_so_far/",
            upvotes: "53",
            posterDetails: "Karma: 18,034, Contributions: 3,773, Reddit age: 4y.",
          },
        ],
      },
      {
        id: "molecule-2",
        point: "Different Levels (1, 3, 6, 10, 20, 24) and guidance on how to start",
        commentary: "If you are deciding on which level to use, a good place to start will probably be Medik8's own guide (first link below). I collected a few more reddit posts about it as well, to give a more well rounded view",
        atoms: [
          {
            id: "link-1",
            kind: "link",
            label: "Medik8 Retinal Guide (Official)",
            url: "https://www.medik8.com/pages/retinal-guide",
            excerpt: `...Available in 5 strengths, we call it the ‘Everyone Vitamin A’ as it’s just that. If you’re in the market for a vitamin A, Crystal Retinal is for you. We recommend starting at strength 3 and working upwards if you want to boost results. (We only recommend strength 1 to those who are very sensitive)
            ...
            Crystal Retinal 20 (our highest strength) is available through consultation with clinics only`
          },
          {
            id: "link-2",
            kind: "link",
            label: "Medik8 How to Phase In (Official)",
            url: "https://www.medik8.com/pages/how-to-phase-in",
          },
          {
            id: "reddit-3",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "September 2025",
              "r/SkincareAddictionLux",
              "4 upvotes",
              "13 comments",
            ],
            excerpt: `I don’t know which level to buy. I took the quiz, and it told me level 6, but I don’t know if that’s the one for me.

            I’m kind of new to retinol, but I’ve been using one for maybe 3-4 months. I’ve been using the skinmedica retinol 0.25. It’s very gentle and I think it’s beginner retinol. I want to switch to medik8, but I don’t know which one?

            Would be level 3 or level 6? Am I considered experienced as far as retinol? Thank you!!

            ... [follow on comments]
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1n386b5/crystal_retinal_medik8_help/",
            upvotes: "4",
            posterDetails: "Karma: 5,606, Contributions: 718, Reddit age: 11m.",
          },
          {
            id: "reddit-4",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "July 2025",
              "r/SkincareAddictionLux",
              "13 upvotes", 
              "17 comments",
            ],
            excerpt: `...Retinal seems to be a great option and Medik8 seems to be the most effective and beloved online. Has any experienced retinoid user jumped straight to 10, or 20? I'm thinking any less than that will fail short, and those two seem to be a good balance for me.
            ...
            [discussion below]
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1m9agwa/medik8_crystal_retinal_20_vs_10_for_advanced_user/",
            upvotes: "13",
            posterDetails: "Karma: 302, Contributions: 105, Reddit age: 1y.",
          },
          {
            id: "reddit-5",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "October 2025", 
              "r/SkincareAddictionLux",
              "15 upvotes",
              "26 comments",
            ],
            excerpt: `Just curious what others experiences were with leveling up with Crystal Retinal. I started with 6 and my skin looked AMAZING after about 3 weeks. After one tube, I moved up to 10. I'm now on my second tube of 10 and my skin looks...good...but I feel like it's just kind of maintaining and not doing anything more. So, now I'm wondering if I should move up to 20 or not. Will I see an increase in its effects? Is it possible my skin just does better with the 6? So, I'm looking to hear other people's experiences in moving up or down levels. Thank you!!
            ...
            [discussion below]`,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1nrwizi/medik8_crystal_retinal_levels/",
            upvotes: "15", 
            posterDetails: "Karma: 18,089, Contributions: 3799, Reddit age: 4y.",
          },
          {
            id: "reddit-6",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/30PlusSkinCare",
              "3 upvotes",
              "5 comments",
            ],
            excerpt: `Anyone use medik8 crystal retinal?
            Just started the level 1. I have some health issues so I’m trying the absolute lowest dose first. Any experiences?
            ...
            [discussion below]`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/1fs5p8c/anyone_use_medik8_crystal_retinal/",
            upvotes: "3",
            posterDetails: "Karma: 13,024, Contributions: 2,158, Reddit age: 2y",
          },
          {
            id: "link-3",
            kind: "link",
            label: "INCI Decoder: Medik8 Crystal products",
            url: "https://incidecoder.com/search?query=medik8+crystal",
            additionalNote: `INCI Decoder has ingredient submissions for all the different levels of the Crystal Retinal.`
          },
        ],
      },
      {
        id: "molecule-3",
        point: "Anecdote of very strong reaction to the product",
        atoms: [
          {
            id: "reddit-7",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2024",
              "r/30PlusSkinCare",
              "293 upvotes",
              "149 comments", 
            ],
            excerpt: `Please help! I’ve been using the Medik8 Crystal Retinal 3 for about 6 weeks and it has completely ruined my skin and self confidence! I started on one to two times a week and worked up to every other day, but then brought it back down to one or two days a week when the acne was really bad. I have oily acne prone skin but no where near as bad as this. Do I continue with it, with the purge clear, or do I stop all together. I’ve included a photo of my skin before I started on it. Help me please, desperate here !
            ...
            [follow on comments provided recommendations on how to fix and manage this issue. The poster was active in the comments]`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/17fs5pb/retinol_purge_has_completely_ruined_my_skin/",
            upvotes: "293",
            posterDetails: "Karma: 4,743, Contributions: 530, Reddit age: 6y.",
            additionalNote: "This post describes a very strong reaction/purge experience.",
          },
        ],
      },
      {
        id: "molecule-4",
        point: "Guidance on layering the product",
        atoms: [
          {
            id: "reddit-8",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "15 February 2026", 
              "r/SkincareAddictionLux",
              "13 upvotes",
              "16 comments",
            ],
            excerpt: `...I picked the Medik8 Crystal Retinal 1 instead of 3 since I don't have anything like this in my routine and I tend to be a bit sensitive.

            For those who have used it before:
            - What do you think of the product?
            - How do you usually layer it?
            ...
            [follow on discussion provides layering guidance]
            `,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1r5wv99/first_time_medik8_crystal_retinal_user_layering/",
            upvotes: "13", 
            posterDetails: "555 Karma, Contributions: 43, Reddit age: 7y.", 
          },
        ],
      },
      {
        id: "molecule-5",
        point: "Medik8's Own Site: Claims and Evidence",
        commentary: "In addition to the Reddit discussions, I also included a couple of links to the official Medik8 site. They have some claims and science content about the product, which might be worth a look. I would still take it with a grain of salt because it's all from Medik8's own site and I could not find any third party source to validate their stuff.",
        atoms: [
          {
            id: "link-4",
            kind: "link",
            label: "Crystal Retinal Claims (Medik8)",
            url: "https://www.medik8.com/pages/crystal-retinal-claims",
          },
          {
            id: "link-5",
            kind: "link",
            label: "Circana Group Claim Letters (Medik8 US)",
            url: "https://us.medik8.com/pages/circana-group-claim-letters",
            excerpt: `... This Letter will confirm that Circana (UK) Ltd has verified the data used to support the advertising claim set out below for use in marketing efforts by Medik8 Limited.

            Medik8 Crystal Retinal – UK's No 1 dermatological face serum in the UK*` 
          },
        ],
      },
    ],
    curatorNote: `Reddit was a gold mine here for good info. 
    
    I avoided including the overly commercial sources, particularly the beauty magazines. They had a lot of content about the product but it felt very promo-ty rather than focused on helping users. A lot of them give out awards (which Medik8 Crystal Retinal has won a lot of), but these awards feel quite random lol.
    
    I did have to include a few of links to the official Medik8 site. Especially when considering the different Retinal strengths it's probably a good idea to see what the company itself says. 
    
    Have fun exploring! -- Thomas`,
  },
  {
    name: "Omnilux Red Light Therapy (Various Types)",
    slug: "omnilux-red-light-therapy-various-types",
    category: "Red Light Therapy",
    imageUrl:
      "https://m.media-amazon.com/images/I/51aNokTz8iL._SL1080_.jpg",
    productLink: "https://amzn.to/4r36HRi",
    lastChecked: "Feb 25, 2026",
    molecules: [
      {
        id: "molecule-1",
        point: "Detailed and high engagement Reddit reviews about Omnilux Contour",
        commentary: "I haven't been able to find similarly high quality reviews (high upvotes, plenty of follow on comments) that were specifically about either Omnilux Clear and Omnilux Men. Will keep looking.",
        atoms: [
          {
            id: "reddit-1",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2024",
              "r/30PlusSkinCare",
              "Upvotes: 940",
              "Comments: 109",
            ],
            excerpt: `Lifestyle factors: 35F, dry and sensitive skin with rosacea, office job. I've been a skincare enthusiast since my mid-20s because I enjoy nerding out about it. I have never smoked, I stay hydrated every day, and I have an unrestricted but mostly healthy diet. I have been using tretinoin 0.025% since July, but I used retinol before that for a few years. I have never had any professional treatments, fillers, or botox, although I plan on checking out PDL/vbeam for rosacea this spring.
...
I used the mask daily for two weeks when I started, then 3-5 days a week since. I take off my makeup with micellar water before using the mask and I do my routine after. This mask turns off after 10 minutes, so I do one session on my face and one with the mask laid sideways to cover my neck and upper chest (this is why I chose the Omnilux mask--it's flexible!).

What I like and dislike about results: About two weeks in, I noticed improved volume in mid and lower face that is most noticeable in motion or when talking. At a three-quarters angle of my face, the apple of the cheek is less sunken. I haven't seen that kind of volume improvement with years of vit C and retinoids, so I really like that. Looking at the photos, I can see improved volume in the upper eyelid at the outer corner of my eye, and the expression lines over the orbital bone have less depth.

I'm a little neutral on the impact on redness. It's the same in the photos because those are broken capillaries, but I do think the look when I'm flushed is a bit improved. I also noticed a big improvement in upper chest redness (I don't always extend skincare down to my neck and chest, so there was some sun damage there).

I would have liked to see a better reduction in the crepiness of the topmost layer of skin (probably most visible here on the top of my cheekbone). But I think tretinoin could be impacting this, since I've only been using it for about six months. I'm not peeling or having irritation anymore, but it still seems drying. I have seen a noticeable reduction in redness on my chest, which is nice.
...`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/18wa48u/red_led_mask_results_when_your_skincare_routine/",
            upvotes: "940",
            followOnComments: 109,
            posterDetails: "Karma: 174,480, Contributions:  16,457, Reddit age: 8y",
            additionalNote: "The post was so appreciated that one person commented 'Now this is how you do a review! 👏👏\"",
            commentary: "Type Used: Omnilux Contour. Post includes a before/after image. ",
          },
          {
            id: "reddit-2",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "r/SkincareAddiction",
              "Upvotes: 172",
              "Comments: 59",
            ],
            excerpt: ` I felt like I was noticing some changes but decided after 2 months of use to take some updated selfies and I’m really pleased with my results! Here’s the relevant details: I use my OmniLux 4-5 nights each week for the full 10 minute cycle. In April I used it almost daily but pulled back a bit in May and June. 
...
I’m 36 years old and my main concerns were uneven tone and fine lines. I definitely see my tone and redness have improved and I’m waiting until the 6 month mark to really judge any fine line appearance.
...
I have dry skin with an oily T zone and I tend to be acne prone. My skincare routine is pretty basic and I don’t really follow a strict regimen
...
Overall, I’m really pleased with how my skin has responded to the mask and am looking forward to the 6 month mark.`,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/1daaow0/beforeafter_2_months_with_my_red_light_therapy/",
            upvotes: "172",
            followOnComments: 59,
            posterDetails: "Karma: 33,392, Contributions: 1,555, Reddit age: 17y",
            commentary: "Type Used: Omnilux Contour. Post includes a before/after image",
          }
        ],
      },
      {
        id: "molecule-2",
        point: "Omnilux Contour vs Omnilux Men vs Omnilux Clear",
        commentary: "From the research, Contour and Men are more similar with technical differences. Generally about treating wrinkles, etc. Omnilux Clear appears to be targeted at reducing acne",
        atoms: [
          {
            id: "link-1",
            kind: "link",
            label: "Official Omnilux Blog Post → Scroll to 'Omnilux tip: Our collection of...'",
            url: "https://omniluxled.com/blogs/light-reads/led-light-therapy-at-home-choosing-between-masks-and-panels",
            excerpt: `...
The Omnilux Contour collection uses red and near-infrared light to reduce fine lines and wrinkles and improve skin tone, texture, and firmness.

Omnilux Clear uses blue and red light to treat mild to moderate acne and reduce blemishes.

Omnilux Men utilizes three wavelengths of light, red (633nm), near-infrared (830nm), and the deepest-penetrating near-infrared wavelength (1072nm), to target men’s thicker skin and reduce fine lines and wrinkles, supporting a smoother, more refreshed appearance.
...`,
            commentary: "The post has a great excerpt about the differences between the options they provide",
          },
          {
            id: "link-2",
            kind: "link",
            label: "Omnilux Men’s Mask vs. Omnilux Contour LED Mask: Which Should You Buy?",
            url: "https://goalstogetglowing.com/2025/10/20/omnilux-mens-vs-contour-led-masks/",
            excerpt: "Short answer on why I prefer the Men’s Mask: Both deliver excellent results, but think the added bonus of the 1072nm wavelength tips the scale in favor of the Men’s mask. Here’s why: Early trials and device studies show improvements in wrinkles/spots in both men and women. In theory, the 1072nm supports deeper penetration in darker or thicker skin because >1000 nm is minimally absorbed by melanin, while 830 nm is partially absorbed...",
          },
          {
            id: "instagram-1",
            kind: "instagramLink",
            user: "@omniluxled (Official Omnilux Instagram)",
            excerptFromDescription: "Let's dive into the differences between our Contour Face and Omnilux Men devices 📚",
            url: "https://www.instagram.com/reels/DGd5VJ6i_v_/",
          },
          {
            id: "instagram-2",
            kind: "instagramLink",
            user: "@goalstogetglowing",
            excerptFromDescription: "...Bottom line is both masks are great but I think the unique addition of a handful of strategically placed diodes with 633nm and 1072nm make the men’s mask the winner for me.",
            url: "https://www.instagram.com/reels/C6r7uEXMTiA/",
            commentary: "Comparison is between Omnilux Men and Omnilux Contour",
          },
          {
            id: "reddit-3",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2024",
              "r/SkincareAddictionLux",
              "Upvotes: 52",
              "Comments: 95",
            ],
            excerpt: `I'm a female who's primary skin concerns are acne/rosacea, hyperpigmentation & anti aging in general. Is there a reason not to purchase the Omnilux Men's mask since it has more wavelengths and penetrates the skin deeper? Or should I just buy the regular contour mask? Has anyone here preferred one over the other? Thanks for the help.
...
[discussion below]

`,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/18zfq2s/omnilux_mens_vs_omnilux_contour_mask/",
            upvotes: "52",
            followOnComments: 95,
            posterDetails: "Karma: 9,707, Contributions: 1,949, Reddit age: 11y",
            commentary: "Extensive discussion on the different types",
          },
          {
            id: "reddit-4",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2023",
              "r/30PlusSkinCare",
              "Upvotes: 109",
              "Comments: 72",
            ],
            excerpt: `I am wondering if the newly released Omnilux Men is generally a superior product in comparison to the Omnilux Contour (previously Omnilux's only anti-aging home model). The new Men's version has more wavelengths and penetrates deeper into the skin (has 1072 nm, in addition to the wavelengths used by the Contour). Is there any reason why you'd still pick the Contour over the Men's version? (And if the new Men's model is just an all-around more effective product, why did they give it a name that makes me, a woman, feel hesitant when choosing it? Argh...)
...
[discussion below]


`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/zwar3s/omnilux_contour_vs_omnilux_men/",
            upvotes: "109",
            followOnComments: 72,
            posterDetails: "Karma: 49,822, Contributions: 5,885, Reddit age: 6y",
            additionalNote: "Extensive discussion on the different types. Note that this was 3y ago",
            commentary: `I am wondering if the newly released Omnilux Men is generally a superior product in comparison to the Omnilux Contour (previously Omnilux's only anti-aging home model). The new Men's version has more wavelengths and penetrates deeper into the skin (has 1072 nm, in addition to the wavelengths used by the Contour). Is there any reason why you'd still pick the Contour over the Men's version? (And if the new Men's model is just an all-around more effective product, why did they give it a name that makes me, a woman, feel hesitant when choosing it? Argh...)


`,
          }
        ],
      },
      {
        id: "molecule-3",
        point: "Studies that specifically reference usage on Omnilux products",
        atoms: [
          {
            id: "link-3",
            kind: "link",
            label: "Efficacy of combination LED light therapy in facial skin rejuvenation",
            url: "https://pubmed.ncbi.nlm.nih.gov/16414908/",
            excerpt: `...Methods: Thirty-one subjects with facial rhytids received nine light therapy treatments using the Omnilux LED system.
...
 Key profilometry results Sq, Sa, Sp and St showed significant differences at week 12 follow-up; 52% of subjects showed a 25%-50% improvement in photoaging scores by week 12; 81% of subjects reported a significant improvement in periorbital wrinkles on completion of follow-up.`,
            commentary: "The study specifically involves using Omnilux products",
          },
          {
            id: "link-4",
            kind: "link",
            label: "A 7-Week, Open-Label Study Evaluating the Efficacy and Safety of 415-nm/633-nm Phototherapy for Treating Mild-to-Moderate Acne in Adolescents and Adults",
            url: "https://jcadonline.com/evaluating-the-efficacy-and-safety-of-phototherapy/",
            excerpt: "Methods: The study enrolled male (n=15) and female (n=15) patients aged 14 to 45 years old...Results: After 7 weeks, there were significant reductions in inflammatory and noninflammatory lesion counts (for each, p<0.0001) and most patients (86%) achieved ≥1-grade reduction in IGA scores, meeting study success criteria. The few reported adverse events were mild and transient.",
            commentary: "The study specifically involves using Omnilux Clear",
          }
        ],
      },
      {
        id: "molecule-4",
        point: "Options OTHER than Omnilux products",
        atoms: [
          {
            id: "link-5",
            kind: "link",
            label: "Deep Dive into Low Level Light Therapy & Comparison of 55+ LED Devices",
            url: "https://goalstogetglowing.com/2021/01/17/led-face-mask-research/",
            excerpt: "...I hope that with the information in this post will empower everyone to use what you know to do your own research. I can’t tell you if a mask is “worth it”. But I can help you understand how to evaluate masks and to better understand what kind of results you might expect based on what has been found...",
            commentary: "Updated 17 November 2025. This blog post is highly recommended across Reddit. ",
          },
          {
            id: "reddit-5",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "May 2025",
              "r/30PlusSkinCare",
              "Upvotes: 221",
              "Comments: 207",
            ],
            excerpt: `I was looking into LED masks and remembered seeing this one at my med spa for sale, I was kind of shocked by the price and went to Amazon to see if there were other options. There seems to be a lot of variability in prices. Is the Omnilux worth the price or are there better alternatives that give you the same results?
...
[discussion below]`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/1kgxqtp/omnilux_red_light_mask_is_it_worth_it/",
            upvotes: "221",
            followOnComments: 207,
            posterDetails: "Karma: 4051, Contributions: 562, Reddit age: 4y",
            commentary: "Discussion focuses on whether Omnilux is value for money, with suggestions for alternative included.",
          }
        ],
      },
      {
        id: "molecule-5",
        point: "Should you use a mask or a panel?",
        commentary: "Omnilux's products are all masks. There is another category of products that also provide red light therapy called 'panels'. I found that Reddit discussions were more useful on this topic than blog posts / videos",
        atoms: [
          {
            id: "reddit-6",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2024",
              "r/30PlusSkinCare",
              "Upvotes: 49",
              "Comments: 21",
            ],
            excerpt: `I was thinking of getting a red light panel, but I read such great things about the Omnilux mask. Does anyone have experience with both, and if so, can you say which you've found to be better for facial anti-aging? The benefit of the panel is its versatility, but I'm wondering if there's something about the skin contact of the mask that makes it superior for anti-aging. I'd love to hear from anyone who's had experience with both long enough to form an opinion on this.
...
[discussion below]
`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/16jo5rx/red_light_mask_vs_panel/",
            upvotes: "49",
            followOnComments: 21,
            posterDetails: "Karma: 21, Contributions: 35, Reddit age: 5y",
          },
          {
            id: "reddit-7",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "Early 2025",
              "r/30PlusSkinCare",
              "Upvotes: 15",
              "Comments: 46",
            ],
            excerpt: `Hi everyone! Like many of you, I’ve been seeing the red-light therapy masks everywhere. I have a lot of girlfriends that swear by them!

My question is, wouldn’t a panel be better than just a face mask? The panel would essentially cover my entire body vs face/neck?

This seems like a no-brainer, but maybe it’s not since i don’t see too many discussions about the panels? Can someone please enlighten me!

I want to purchase one, I am just trying to find the best option!
...
[discussion below]


`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/1fdjmo5/redlight_mask_or_panel/",
            upvotes: "15",
            followOnComments: 46,
            posterDetails: "Karma: 2435, Contributions: 256, Reddit age: 3y",
          }
        ],
      }
    ],
    curatorNote: `I started research on Omnilux Red Light Therapy products because they are a fairly expensive product. A lot of people (as evidenced on Reddit) are actively searching for more information about it before they commit.

Before buying, I do think it's important to learn the differences between their 3 product ranges (Contour, Men, Clear), and understanding the different between masks and panels.

For the scientific evidence, there is actually plenty of studies around Red Light Therapy. However, I have only included the studies I found that EXPLICITLY mention using Omnilux products.`,
  },
  {
    name: "Crème de la Mer",
    slug: "creme-de-la-mer",
    category: "Moisturizer",
    imageUrl:
      "https://m.media-amazon.com/images/I/41cSBG3Wz8L._SL1000_.jpg",
    productLink: "https://amzn.to/478hLWl",
    lastChecked: "Mar 15, 2026",
    molecules: [
      {
        id: "molecule-1",
        point: "Reddit enthusiasm for Creme de La Mer",
        commentary: "I picked these three because the fans aren't vague about it. Good specificity.",
        atoms: [
          {
            id: "reddit-1",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "September 2024",
              "r/SkincareAddictionLux",
              "Upvotes: 308",
              "Comments: 207",
            ],
            excerpt: `I know La Mer is a very polarizing brand. Let me clarify, I have tried a TON of products over the years (both mid and high-end lux brands) for my acne-prone and sensitive/rosacea skin. For whatever reason, La Mer has been the only brand to consistently help my skin barrier as well as keep my skin hydrated (especially with tretinoin). Of all the products, my favorite is the OG cream, treatment lotion, concentrate, and foundation.
`,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1fpi30f/",
            upvotes: "308",
            followOnComments: 207,
            posterDetails: "Karma: 801, Contributions: 290, Reddit age: 5y",
          },
          {
            id: "reddit-2",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "November 2017",
              "r/SkincareAddiction",
              "Upvotes: 675",
            ],
            excerpt: `I bought La Mer creme over a year ago, during a 20% off sale. I felt bad for spending so much and felt even worse when I realized I had to rub the creme between my fingers before applying to soften it enough to spread on my face. (Who has time?) At first it felt thick and occlusive on my skin.

But I’ll tell you what. That stuff has become my jam and I’ve been using the same jar for about 5 months and it’s only 1/2 empty. My skin never feels dry, has a great texture and is a really smooth surface for makeup application. I went from being a curious skeptic with buyers remorse to a total fan.


`,
            postKind: "comment",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/7hzfyq/comment/dqv41ly/",
            upvotes: "675",
            followOnComments: 12,
            posterDetails: "Karma: 33,189, Contributions: 1,489, Reddit age: 12y. ",
          },
          {
            id: "reddit-3",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "November 2023",
              "r/SkincareAddictionLux",
              "Upvotes: 23",
            ],
            excerpt: `I love Crème de la Mer. I'm 37 and have been using it for at least a decade. For me, it rides that fine line of being not moisturizing enough, and too heavy. It doesn't dry down to a matte finish (an enormous pet peeve of mine in moisturizers), it soothes flakies, it helps with my redness, it doesn't break me out, it works for night and day use, and I like how it smells.

It works for me, does what I need it to do, and I can afford it, so I don't care if folks on skincare forums turn up their nose at it.`,
            postKind: "comment",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/183vb12/la_mer_enthusiasts/karehcv/",
            upvotes: "23",
            followOnComments: 4,
            posterDetails: "Karma: 33,890, Contributions: 2,093, Reddit age: 2y",
          },
          {
            id: "reddit-4",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "July 2025",
              "r/SkincareAddictionLux",
              "Upvotes: 50",
              "Comments: 142",
            ],
            excerpt: `I've always been curious about La Mer but never pulled the trigger because of the price. I recently got a small sample of the Crème de la Mer and I honestly can't tell if it's just good marketing or if it's actually doing something special for my skin.

For those who've used it long-term, is it really worth the investment? Or are there better luxury options out there?

[...extensive discussion below]`,
            postKind: "post",
            url: "https://www.reddit.com/r/SkincareAddictionLux/comments/1lv22ek/is_la_mer_really_worth_the_price_or_just_overhyped/",
            upvotes: "50",
            followOnComments: 142,
            posterDetails: "u/Diligent_Oven3298.",
            additionalNote: "I think this is more helpful for the range of opinions",
          }
        ],
      },
      {
        id: "molecule-2",
        point: "The Miracle Broth: fermented sea kelp, vitamins, and minerals — the brand's signature ingredient",
        commentary: "I included the brand's own page here because I wanted to capture what La Mer actually claims, rather than relay it second-hand. I'd still take it with a grain of salt — it's their own site. One thing worth noting: the fermentation takes 3–4 months, not 16 months as is often repeated online. The PubMed study is peer-reviewed, but it was funded by Estée Lauder, so it's not exactly independent.",
        atoms: [
          {
            id: "link-1",
            kind: "link",
            label: "Miracle Broth — Crème de la Mer (official site)",
            url: "https://www.cremedelamer.com/miracle-broth",
            additionalNote: "Brand source. Fermentation takes 3–4 months (often misquoted online as 16 months). I also have no idea what they mean by 'light and sound waves' being part of the process. I could not find independant verification for this point.",
          },
          {
            id: "link-2",
            kind: "link",
            label: "PubMed: PMID 38041526 — Miracle Broth efficacy study",
            url: "https://pubmed.ncbi.nlm.nih.gov/38041526/",
            additionalNote: "Peer-reviewed, but funded by Estée Lauder (La Mer's parent company) and co-authored by Estée Lauder employees. Not independent research.",
          },
          {
            id: "reddit-5",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "April 2025",
              "r/30PlusSkinCare",
              "Upvotes: 130",
            ],
            excerpt: `You're not wrong about any of this.

I used to work for EL as a process engineer in manufacturing where CDLM is made.  Therr's a lot of lore and history around it.

Max Huber was a NASA scientist who suffered from chemical burns in am accident.  He dreamed up the La Mer essence and would put it I to Nivea body cream as a treatment for his burns and invented La Mer.

EL bought it and makes the essence in-house in a process that they keep under fairly tight wraps but really, I think it is just quite specialized and they don't make a lot of it, so it happens in some dark corner so it doesn't interfere with the rest of production.  I know it involves putting the marine extract into a tank and passing sound waves through it at a specific resonant frequency and it takes about a month.

La Mer essence was always provided as an ingredient, ready to add.  But they do, or at least they used to, sell pure essence and there's nothing stopping you from getting it and mixing it in to Nivea body cream or any cream of your choosing.  Or use it straight.

The cream itself is really annoying to make and has really strangely specific directions that make it weird.  Most cream are oil droplets dispersed in water to make an oil in water emulsion.  CDLM starts like this but "inverts" during mixing to become a water in oil emulsion.

The batch has to be taken out of yhe mixer during cooling at a very precise temperature window.  Miss is by a degree and the whole batch is rejected.  Sometimes it doesn't invert properly and gets rejected.

This is such a dicey process because Nivea body cream, which is what this is based upon, is made using a continuous process (where every ingredient is fed into the pipe as it flows) but it is now being made as a batch process.

The high rejection rate (and there are several other points where rejection is high) is part of the reason for the high cost.  All of the issues contribute to the cream sitting in a lump in the middle of the jar and pulling away from the sidewalls and eventually some of the water weeps out into the space next to the wall.  No one is sure why, thus the high rejection rate trying to stop the problem.

The magic of La Mer, if there is any, comes from the marine essence.  Nivea body cream was nice and thick and greasy which made it great for wound healing and that's why it is a heavy cream.

Now there are other versions of the cream and other products in the line, but the marine essence is the only important ingredient.


`,
            postKind: "comment",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/1k6s66w/comment/mosqj80/",
            upvotes: "130",
            followOnComments: 4,
            posterDetails: "u/Genny415. Self-reported: former Estée Lauder process engineer in CDLM manufacturing.",
            additionalNote: "This might be authentic. A former Estee Lauder (self claimed) engineer on Reddit going into detail about the process, explaining there is a lot of lore and history behind it.",
          }
        ],
      },
      {
        id: "molecule-3",
        point: "Ingredient Focus Generally (apart from just the Miracle Broth)",
        atoms: [
          {
            id: "reddit-6",
            kind: "reddit",
            headerParts: [
              "Reddit Comment",
              "November 2017",
              "r/SkincareAddiction",
              "Upvotes: 46",
            ],
            excerpt: "Can someone tell me the difference between la mer and just mixing a moisturizer that has algae, lime extract, eucalyptus oil, sweet almond oil and/or sesame seed oil with nivea or aquaphor?",
            postKind: "comment",
            url: "https://www.reddit.com/r/SkincareAddiction/comments/7hzfyq/comment/dqvmwu2/",
            upvotes: "46",
            posterDetails: "u/DarkerDay.",
          },
          {
            id: "reddit-7",
            kind: "reddit",
            headerParts: [
              "Reddit Post",
              "April 2025",
              "r/30PlusSkinCare",
              "Upvotes: 98",
              "Comments: 38",
            ],
            excerpt: `I'll get it out of the way immediately that CDLM is not worth its price, with some caveats. Value and worth are subjective, and therein lies those caveats. If it's out of your budget, you're not missing anything.

I've had better barrier creams. And I've had better moisturizers. I don't believe the insane space back story, either.

Ingredients: Everyone loves to pick apart and shit upon the ingredients in CDLM. And while there are no familiar and reliable actives, the formula isn't that much more bizarre than Tatcha's Dewy or Water creams, Lancôme's Absolue Rich, LaPrairie Caviar Cream, EL Advanced Night Repair, Kiehl's Ultra Facial Cream, and the list goes on.

So in terms of ingredients, CDLM isn't that out there. It's an everything-but-the-kitchen-sink list, and I understand that for some people those types of lists can be a nightmare. But it's not the only overpriced cream out there...`,
            postKind: "post",
            url: "https://www.reddit.com/r/30PlusSkinCare/comments/1k6s66w/long_term_review_of_creme_de_la_mer/",
            upvotes: "98",
            followOnComments: 38,
            posterDetails: "u/aenflex. 10+ years of La Mer use.",
          },
          {
            id: "link-3",
            kind: "link",
            label: "Ingredient breakdown (INCI Decoder)",
            url: "https://incidecoder.com/products/la-mer-creme-de-la-mer",
            excerpt: "Top ingredients: Algae Extract, Mineral Oil, Petrolatum, Glycerin. 7 fragrance allergens listed.",
          }
        ],
      },
      {
        id: "molecule-4",
        point: "Comparisons with Nivea",
        commentary: "It's compared often with Nivea cream because they share similar ingredients, and Nivea is ALOT cheaper",
        atoms: [
          {
            id: "link-4",
            kind: "link",
            label: "Regimen Lab TikTok: La Mer vs Nivea lab test (176K likes)",
            url: "https://www.tiktok.com/@regimenlab/video/7329998838624734470",
            excerpt: "La Mer: +11% hydration. Nivea: +12% hydration. Both: -16% TEWL. 18 shared ingredients between the two formulas.",
            additionalNote: "Regimen Lab is a commercial brand, not a neutral research body. But the methodology is laid out in the NewBeauty piece below, which doesn't find anything wrong with it.",
          },
          {
            id: "link-5",
            kind: "link",
            label: "NewBeauty: Regimen Lab's La Mer vs Nivea study (methodology detail)",
            url: "https://www.newbeauty.com/nivea-la-mer-dupe-study/",
          }
        ],
      },
      {
        id: "molecule-5",
        point: "Dermatologists are broadly skeptical wheter it is worth the price",
        commentary: "I found a few dermatologists talking about it. Dr. Rieder's was explicitly unsponsored. ",
        atoms: [
          {
            id: "link-6",
            kind: "link",
            label: "Money.com: Is La Mer worth it? — Dr. Aegean Chan, dermatologist",
            url: "https://money.com/is-la-mer-cream-worth-it/",
            excerpt: "\"There's really not any strong scientific evidence to show that seaweed has magical properties... I do not think it's worth the price tag.\" — Dr. Aegean Chan",
          },
          {
            id: "link-7",
            kind: "link",
            label: "Dr. Evan Rieder TikTok: La Mer review (~83K views)",
            url: "https://www.tiktok.com/@drevanrieder/video/7382559745472826654",
            additionalNote: "Unsponsored. Dual board-certified dermatologist and psychiatrist.",
          },
          {
            id: "link-8",
            kind: "link",
            label: "Dr. Shereene Idriss TikTok: '3 skincare products I would NOT purchase again'",
            url: "https://www.tiktok.com/@shereeneidriss/video/7324834159292091679",
            excerpt: "La Mer is among the three products she lists. No sponsor disclosure.",
          }
        ],
      }
    ],
    curatorNote: `From the research, La Mer is super polarising. A lot of the fight is driven by the price because it is one of the most premium products out there on the market. 

I tried to gather (1) why people love it, (2) what's the 'thing' that supposedly makes it special, (3) and generally as much science about it as possible.

Happy Hunting! -- Thomas`,
  }
];
