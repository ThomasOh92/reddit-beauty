"use client";

interface ProductCardButtonProps {
    externalUrl: string;
    disabled?: boolean;
    variant?: "warning" | "secondary";
}

export const ProductCardButton: React.FC<ProductCardButtonProps> = ({
    externalUrl,
    disabled = false,
    variant = "warning",
}) => {
    const className =
        variant === "secondary"
            ? "btn btn-soft btn-secondary font-bold h-8 flex-1 text-xs"
            : "btn btn-warning text-white font-bold h-8 flex-1 text-xs";

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (disabled) return;
                window.open(externalUrl, "_blank", "noopener,noreferrer");
            }}
            className={className}
            disabled={disabled}
        >
            See Product
        </button>
    );
};