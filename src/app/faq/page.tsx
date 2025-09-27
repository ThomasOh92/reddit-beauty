import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions about Thorough Beauty",
  alternates: {
    canonical: "/faq",
  },
  description: `Answers to common questions about our Reddit-sourced skincare rankings: how we analyze reviews, update data, monetize, and take product requests`,
  openGraph: {
    title: `Frequently Asked Questions about Thorough Beauty`,
    description: `Answers to common questions about our Reddit-sourced skincare rankings: how we analyze reviews, update data, monetize, and take product requests.`,
    url: `https://www.thoroughbeauty.com/faq`,
    siteName: "Thorough Beauty",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.thoroughbeauty.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Frequently Asked Questions - Thorough Beauty"
      }
    ]
  },
  twitter: {
    description: "Answers to common questions about our Reddit-sourced skincare rankings: how we analyze reviews, update data, monetize, and take product requests.",
    card: "summary_large_image",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How are products ranked?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We scan hundreds of Reddit threads within each category to identify the most relevant and highly discussed products. For each product, we classify every comment on the product as positive, negative, or neutral, then calculate a conservative Wilson Lower Bound score (at 95% confidence) to balance true sentiment with review volume.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Wilson Lower Bound score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Wilson lower bound gives a “safety-first” estimate of an item’s true positive review rate by adjusting for how many votes it has. That way, something with hundreds of comments looks more reliable than something with just a few, even if they share the same average score.",
      },
    },
    {
      "@type": "Question",
      name: "Which Reddit communities do you analyze?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We don't have a fixed list. Instead, we search for the most relevant threads per product. Some subreddits we make sure to include in all our searches are r/SkincareAddiction, r/AsianBeauty, r/MakeupAddiction, r/30PlusSkinCare as they tend to have the most active discussions on skincare and beauty products.",
      },
    },
    // In your jsonLd.mainEntity array:
    {
      "@type": "Question",
      name: "How do you handle neutral opinions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We exclude neutral comments, like “I use this” or simple product mentions, from our Wilson Lower Bound calculation because they don’t tell us whether someone really loved or disliked an item.\n\nIf we included them in the Wilson Lower Bound score, a popular product with lots of “I use this” posts would look unfairly lukewarm.\n\nYou’ll still see every neutral comment on the product page, so you can judge the full conversation for yourself.",
      },
    },

    {
      "@type": "Question",
      name: "Can rankings be influenced by sponsored posts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We don’t accept any payment to feature a product. All rankings come purely from community sentiment.",
      },
    },
    {
      "@type": "Question",
      name: "How can I suggest a product or subreddit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just drop us a line at tom@thoroughbeauty.com with the product name and subreddit link. We review all suggestions in our next data refresh.",
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <div className="max-w-[600px] md:mx-auto bg-white shadow-md p-4 space-y-6">
      {/* Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-600">
          Everything you need to know about how we rank and surface products.
        </p>
      </div>

      {/* FAQ List */}
      <dl className="space-y-4">
        <div className="bg-base-100 p-6 shadow-lg border border-base-300 rounded-lg">
          <dt className="text-lg font-semibold">How are products ranked?</dt>
          <dd className="mt-2 text-sm">
            We scan hundreds of Reddit threads within each category to identify
            the most relevant and highly discussed products. For each product,
            we classify every comment on the product as positive, negative, or
            neutral, then calculate a conservative Wilson Lower Bound score (at
            95% confidence) to balance true sentiment with review volume.
          </dd>
        </div>

        <div className="bg-base-100 p-6 shadow-lg border border-base-300 rounded-lg">
          <dt className="text-lg font-semibold">
            What is the Wilson Lower Bound score?
          </dt>
          <dd className="mt-2 text-sm">
            The Wilson lower bound gives a “safety-first” estimate of an item’s
            true positive review rate by adjusting for how many votes it has.
            That way, something with hundreds of comments looks more reliable
            than something with just a few, even if they share the same average
            score.
          </dd>
        </div>

        <div className="bg-base-100 p-6 shadow-lg border border-base-300 rounded-lg">
          <dt className="text-lg font-semibold">
            Which Reddit communities do you analyze?
          </dt>
          <dd className="mt-2 text-sm">
            We dynamically identify the most relevant subreddits for each
            product, but always include top skincare and beauty hubs such as{" "}
            <code>r/SkincareAddiction</code>, <code>r/AsianBeauty</code>,{" "}
            <code>r/MakeupAddiction</code>, and <code>r/30PlusSkinCare</code> to
            ensure broad coverage.
          </dd>
        </div>

        <div className="bg-base-100 p-6 shadow-lg border border-base-300 rounded-lg">
          <dt className="text-lg font-semibold">
            How do you handle neutral opinions?
          </dt>
          <dd className="mt-2 text-sm">
            We exclude neutral comments, like “I use this” or simple product
            mentions, from our Wilson Lower Bound calculation because they don’t
            tell us whether someone really loved or disliked an item. <br />
            If we included them in the Wilson Lower Bound score, a popular
            product with lots of “I use this” posts would look unfairly
            lukewarm. <br />
            You’ll still see every neutral comment on the product page, so you
            can judge the full conversation for yourself.
          </dd>
        </div>

        <div className="bg-base-100 p-6 shadow-lg border border-base-300 rounded-lg">
          <dt className="text-lg font-semibold">
            Can rankings be influenced by sponsored posts?
          </dt>
          <dd className="mt-2 text-sm">
            No. We don’t accept any payment to feature a product. All rankings
            come purely from community sentiment.
          </dd>
        </div>

        <div className="bg-base-100 p-6 shadow-lg border border-base-300 rounded-lg">
          <dt className="text-lg font-semibold">
            How can I suggest a product or subreddit?
          </dt>
          <dd className="mt-2 text-sm">
            Just drop us a line at{" "}
            <a
              href="mailto:tom@thoroughbeauty.com"
              className="text-blue-500 underline"
            >
              tom@thoroughbeauty.com
            </a>{" "}
            with the product name and subreddit link. We review all suggestions
            in our next data refresh.
          </dd>
        </div>
      </dl>
    </div>
  );
}
