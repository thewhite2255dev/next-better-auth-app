import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({
  value = 0,
  onChange,
  className,
  ...props
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          {...props}
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={cn("transition-all hover:scale-110", className)}
        >
          <Star
            className={`h-5 w-5 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
