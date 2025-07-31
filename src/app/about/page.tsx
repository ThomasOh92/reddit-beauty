import  { Metadata } from "next";

export const metadata: Metadata = {
    title: "About"
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Beauty Aggregate",
  "url": "https://beautyaggregate.com/about",
  "description": "Beauty Aggregate analyzes skincare and beauty discussions from Reddit to provide unbiased product insights and rankings. No sponsored content, no hidden agendas, just data-driven analysis.",
};


export default function AboutPage() {
    return (
        <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4 space-y-4">
            {/* Structured Data for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />

            {/* Header Section */}
            <div className="flex flex-col space-y-4 items-center">
                <h1 className="text-2xl font-bold">About Us</h1>
                <p className="text-sm text-gray-600 text-center">
                    Welcome! We work on aggregating and analyzing the sea of beauty / skincare content from Reddit
                </p>
            </div>

            {/* Approach Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Real Reviews. No Sponsorships</h2>
                <p className="mt-4 text-sm">
                    At Beauty Aggregate, we believe that the best beauty and skincare advice doesn’t come from ads—it comes from real people sharing real experiences. That’s why we built this site: to help you discover the most loved and most talked-about beauty and skincare products according to real users on Reddit.
                </p>
                <p className="mt-4 text-sm">
                    Every product guide and ranking you see here is based on thousands of authentic Reddit comments from skincare communities like r/SkincareAddiction, r/AsianBeauty, r/30PlusSkinCare, and more. We analyze what people are actually saying—what they love, what they hate, and what actually works.
                </p>
            </div>

            {/* Key Points */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Key Points</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-sm">
                    <li>No hidden agendas. If we find an affiliate link, we’ll use it to support the site. If we don’t, we still include the product—because what matters most is helping you make a good decision.</li>
                    <li>No sponsored content. Companies cannot pay to be featured.</li>
                    <li>No review manipulation. We do not remove negative feedback, and we don’t cherry-pick reviews to make products look better than they are.</li>
                </ul>
            </div>

            {/* Technical Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Analysis Approach</h2>
                <p className="mt-4 text-sm">
                    We take an iterative approach to building our platform. We are constantly refining our analysis approach by using different LLM models, human verification checks, etc. The idea is to provide people who visit our site with insights from Reddit that are actually useful.
                </p>
            </div>

            {/* Why Reddit Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Why Reddit?</h2>
                <p className="mt-4 text-sm">
                    Reddit is home to some of the most honest and in-depth skincare discussions on the internet. Unlike traditional beauty blogs or influencer posts, Reddit comments are unsponsored, unfiltered, and often brutally honest. We aggregate and summarize these conversations to save you time and help you cut through the noise.
                </p>
            </div>

            {/* Contact Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Get in Touch</h2>
                <p className="mt-4 text-sm">
                    Have questions or feedback? Feel free to reach out to us at <a href="mailto:reddit.beauty.reviews@gmail.com" className="text-blue-500 underline">reddit.beauty.reviews@gmail.com</a>. We&apos;d love to hear your thoughts!
                </p>
            </div>
        </div>
    );
}
