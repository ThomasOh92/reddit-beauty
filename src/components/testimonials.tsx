const Testimonials = () => {

const testimonials = [
    {
        user: "u/Jazzlike-Sea-7054",
        text: "Wow, this is amazing. 😍 Thank you for the time and compilation!",
        link: "https://www.reddit.com/r/Sephora/comments/1ku9c2k/comment/mu0ip0d/?context=3"
    },
    {
        user: "u/AppropriateLeg6419",
        text: "This is awesome, thank you! I’ve really been struggling to find the perfect blush and now I can concentrate my efforts on this list!",
        link: "https://www.reddit.com/r/Makeup/comments/1kuc985/comment/mu0jmi7/?context=3"
    },
    {
        user: "u/Soft-Horror4721",
        text: "This is so cool! Thank you for doing this. Can't wait to see more categories added",
        link: "https://www.reddit.com/r/PaleMUA/comments/1kucae1/comment/mu0eb0h/?context=3"
    },
    {
        user: "u/Odd-Presentation868",
        text: "Out here doing the Lord’s work. 🙏🏻",
        link: "https://www.reddit.com/r/Makeup/comments/1kuc985/comment/mu0h3cl/?context=3"
    },
    {
        user: "u/GlitterBlood773",
        text: "I love you. This is so fabulous. Thank you neighbor.",
        link: "https://www.reddit.com/r/30PlusSkinCare/comments/1kirl6k/reddit_sunscreen_rankings_by_upvoted/"
    },
    {
        user: "u/jonilui",
        text: "Now do this for all types of skincare :) I would be forever in your debt!",
        link: "https://www.reddit.com/r/30PlusSkinCare/comments/1kirl6k/reddit_sunscreen_rankings_by_upvoted/"
    },
    {
        user: "u/Conscious-Goddess",
        text: "Omg, you rock! Literally just posted about needing sunscreen recs and your post was right underneath. Thanks for your diligence and time spent creating this 💖",
        link: "https://www.reddit.com/r/SkincareAddicts/comments/1kf9nlz/comment/mqqcldl/?context=3"
    }
];

  return (
    <section className="mt-4 mb-4 max-w-[600px] mx-auto flex justify-center">
      <div className="bg-white shadow pt-4 pb-4">
        <div className="grid gap-1">
          {testimonials.map((t, i) => (
            <a
              key={i}
              href={t.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-base-100 p-2 pl-4 pr-4 transition cursor-pointer group"
              style={{ textDecoration: "none" }}
              aria-label={`Read testimonial from ${t.user}`}
            >
              <p className="text-xs text-gray-700 flex items-center">
                <span className="mr-2 group-hover:underline group-hover:text-blue-700 transition">
                  <em>{t.text}</em> <span className="text-xs text-gray-500">— {t.user}</span>
                </span>
                <svg
                  className="ml-2 text-blue-500"
                  width={16}
                  height={16}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

