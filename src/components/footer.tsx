const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-100 text-base-content p-6 max-w-[600px] mx-auto bottom-0 border-t border-base-300">
      <aside className="space-y-2 text-center">
        <div className="bg-base-200 rounded-lg p-4 mb-4 border border-base-300">
          <h3 className="text-sm font-semibold mb-2">Reddit-Backed Starter Routine PDF</h3>
          <p className="text-xs text-gray-600 mb-3">
            A no-fluff routine built from thousands of Reddit discussions across skincare categories.
          </p>
          <a 
            href="/pdf-guide" 
            className="inline-block bg-error text-white text-xs px-3 py-2 rounded transition-colors"
          >
            Access PDF Guide
          </a>
        </div>
        
        <p className="text-xs text-gray-600">
          Built by Tom and Lee! Surfacing the best beauty and skincare insights from Reddit.
        </p>
        <p className="text-xs">
          Contact:{" "}
          <a
            href="mailto:tom@thoroughbeauty.com"
            className="text-blue-500 underline"
          >
            Tom@ThoroughBeauty.com
          </a>

          {" | "}
          <a href="/about" className="text-blue-500 underline">
            About
          </a>
          {" | "}
          <a href="/faq" className="text-blue-500 underline">
            FAQ
          </a>
        </p>
        <p className="text-xs mt-2">
          Copyright © {new Date().getFullYear()}. All rights reserved by Thorough Beauty
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
