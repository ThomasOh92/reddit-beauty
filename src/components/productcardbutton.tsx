"use client";

interface ProductCardButtonProps {
    externalUrl: string;
}

export const ProductCardButton: React.FC<ProductCardButtonProps> = ({
    externalUrl
}) => {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(externalUrl, "_blank", "noopener,noreferrer");
            }}
            className="btn btn-warning text-white font-bold h-8 flex-1 text-xs"
        >
            See Prorduct
        </button>
    );
};