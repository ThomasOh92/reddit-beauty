export default function AboutPage() {
    return (
        <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4 space-y-4">
            {/* Header Section */}
            <div className="flex flex-col space-y-4 items-center">
                <h1 className="text-2xl font-bold">About Us</h1>
                <p className="text-sm text-gray-600 text-center">
                    Welcome! We work on aggregating and analyzing the sea of beauty / skincare content from Reddit
                </p>
            </div>

            {/* Mission Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Our Approach</h2>
                <p className="mt-4 text-sm">
                    We take an iterative approach to building our platform. We are constantly refining our analysis approach by using different LLM models, human verification checks, etc. The idea is to provide people who visit our site with insights from Reddit that are actually useful.
                </p>
            </div>

            {/* Team Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">The Team</h2>
                <p className="mt-4 text-sm">
                    We are two developers who enjoy building this platform to help people discover the best insights from Reddit&apos;s communities.
                </p>
            </div>

            {/* Contact Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Get in Touch</h2>
                <p className="mt-4 text-sm">
                    Have questions or feedback? Feel free to reach out to us at <a href="mailto:ohcsthomas@gmail.com" className="text-blue-500 underline">ohcsthomas@gmail.com</a>. We&apos;d love to hear your thoughts!
                </p>
            </div>
        </div>
    );
}
