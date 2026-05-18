import { motion } from "motion/react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  name: string;
  imageUrl: string;
  score?: number;
  index: number;
  onClick?: () => void;
}

export function ProductCard({
  name,
  imageUrl,
  score,
  index,
  onClick,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={onClick ? "cursor-pointer h-full" : "h-full"}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        <div className="h-[260px] sm:h-[430px] bg-white flex items-center justify-center">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-4 min-h-[120px] flex flex-col justify-end">
          <h3 className="text-lg mb-3 min-h-[56px] flex items-end">{name}</h3>

          {score !== undefined && (
            <Badge className="bg-green-600 text-white hover:bg-green-700 w-fit">
              Safety Score: {score}/100
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
