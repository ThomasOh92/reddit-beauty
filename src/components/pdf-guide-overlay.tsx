import Link from 'next/link';
import Image from 'next/image';

interface PdfGuideOverlayProps {
    className?: string;
    backgroundSize?: string;
}

export const PdfGuideOverlay: React.FC<PdfGuideOverlayProps> = ({ 
    className = "", backgroundSize 
}) => {
    // Interpret backgroundSize as a scale factor: "60%" => 0.6, "0.85" => 0.85
    const scale: number = (() => {
        if (!backgroundSize) return 0.85; // default slight shrink
        const n = parseFloat(backgroundSize);
        if (!Number.isFinite(n)) return 0.85;
        return backgroundSize.includes('%') ? n / 100 : n;
    })();
    return (
        <div className={`relative hero rounded-xl max-w-[500px] mx-1 min-h-[50px] shadow-lg overflow-hidden ${className}`}>
            {/* Background-like image */}
            <Image
                src="/pdf-collage.png" // you can convert this to .webp to shrink further
                alt="3 Images of the Reddit Backed Routine PDF in a collage style next to each other"
                fill
                sizes="(max-width: 640px) 90vw, 500px"
                className="z-0"
                style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                }}
            />
            {/* Tint overlay above the image */}
            <div className="hero-overlay rounded-xl z-10 bg-black/40"></div>
            {/* Content above overlay */}
            <div className="hero-content z-20 text-neutral-content text-center p-2 relative">
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