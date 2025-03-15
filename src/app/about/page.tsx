export default function AboutPage() {
    return (
        <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md p-4 space-y-4">
            {/* Header Section */}
            <div className="flex flex-col space-y-4 items-center">
                <h1 className="text-2xl font-bold">About Us</h1>
                <p className="text-sm text-gray-600 text-center">
                    Welcome! We specialize in aggregating and analyzing beauty reviews and recommendations from Reddit to help you make informed decisions.
                </p>
            </div>

            {/* Mission Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Our Mission</h2>
                <p className="mt-4 text-sm">
                    Our mission is to empower beauty enthusiasts by providing insights from Reddit&apos;s vibrant communities, offering reliable and data-driven recommendations.
                </p>
            </div>

            {/* Values Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Our Values</h2>
                <ul className="mt-4 text-sm list-disc list-inside">
                    <li>Transparency in data aggregation</li>
                    <li>Community-driven insights from Reddit</li>
                    <li>Passion for beauty and self-expression</li>
                </ul>
            </div>

            {/* Team Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Meet Our Team</h2>
                <p className="mt-4 text-sm">
                    Our team consists of data analysts, beauty enthusiasts, and tech professionals who are passionate about uncovering the best beauty insights from Reddit&apos;s communities.
                </p>
            </div>

            {/* Contact Section */}
            <div className="bg-base-100 p-6 shadow-lg w-full border-base-300 border rounded-none">
                <h2 className="text-l font-semibold">Get in Touch</h2>
                <p className="mt-4 text-sm">
                    Have questions or feedback? Feel free to reach out to us at <a href="mailto:contact@beautyplatform.com" className="text-blue-500 underline">contact@beautyplatform.com</a>. We&apos;d love to hear your thoughts!
                </p>
            </div>
        </div>
    );
}
