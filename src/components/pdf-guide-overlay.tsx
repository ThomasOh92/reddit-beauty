import Link from 'next/link';

interface PdfGuideOverlayProps {
    className?: string;
    backgroundSize?: string;
}

export const PdfGuideOverlay: React.FC<PdfGuideOverlayProps> = ({ 
    className = "", backgroundSize 
}) => {
    return (
        <div
            className={`hero rounded-xl max-w-[500px] mx-1 min-h-[50px] shadow-lg ${className}`}
            style={{
            backgroundImage: "url(/pdf-collage.png)",
            backgroundSize: backgroundSize || "60%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            }}
        >
            <div className="hero-overlay rounded-xl shadow-lg"></div>
                <div className="hero-content text-neutral-content text-center p-2">
                    <div className="flex flex-row items-center justify-center">
                    <Link href="/pdf-guide">
                    <h2 className="text-sm font-bold leading-tight">
                        Get our <span className='text-error'>Reddit Backed</span> Routine (PDF)
                    </h2>
                    </Link>
                </div>
            </div>
        </div>
    );
};