import ConvertKitEmbed from "@/components/convertkit-embed";
import { Metadata } from "next"; 
  
export const metadata: Metadata = {
  title: "Reddit-Backed Starter Routine (AM/PM)",
  alternates: {
    canonical: "/pdf-guide",
  },
};

export default function PdfGuidePage() {
  return (
    <div className="max-w-[600px] md:mx-auto bg-white shadow-md p-4 items-center flex flex-col">
    <ConvertKitEmbed/>

    <div className="divider">Preview</div>

      {/* Carousel */}
      <div className="carousel w-full max-w-[400px]">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="/pdf-cover.png"
            className="w-full" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide3" className="btn btn-circle">❮</a>
            <a href="#slide2" className="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="/pdf-table-of-contents.png"
            className="w-full" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">❮</a>
            <a href="#slide3" className="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="/pdf-how-to-use-this-guide.png"
            className="w-full" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">❮</a>
            <a href="#slide1" className="btn btn-circle">❯</a>
          </div>
        </div>
      </div>
    </div>
  );
}
