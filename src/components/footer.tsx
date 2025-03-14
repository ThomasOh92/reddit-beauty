const Footer = () => {
  return (

    <footer className="footer sm:footer-horizontal footer-center bg-base-100 text-base-content p-4 max-w-[600px] mx-auto bottom-0">
        <aside>
            <p className="text-xs">Copyright © {new Date().getFullYear()}. All rights reserved by Reddit Beauty</p>
        </aside>
    </footer>
  );
}

// bg-base-100 shadow-sm justify-between max-w-[600px] mt-2 mx-auto border-b border-gray-300 pb-4
export default Footer;