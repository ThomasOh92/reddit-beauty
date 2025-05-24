const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-100 text-base-content p-6 max-w-[600px] mx-auto bottom-0 border-t border-base-300 mt-4">
      <aside className="space-y-2 text-center">
        <p className="text-xs text-gray-600">
          Built by Thom and Lee, two developers passionate about surfacing the most helpful community knowledge.
        </p>
        <p className="text-xs">
          Contact: <a href="mailto:reddit.beauty.reviews@gmail.com" className="text-blue-500 underline">reddit.beauty.reviews@gmail.com</a>
        </p>
        <p className="text-xs mt-2">
          Copyright © {new Date().getFullYear()}. All rights reserved by Reddit Beauty.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;