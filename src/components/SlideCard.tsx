import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock, Image } from "lucide-react";

interface Slide {
  index: number;
  title: string;
  bullets: string[];
  speaker_notes: string;
  duration_minutes: number;
  layout_hint: string;
  image_suggestion?: string;
}

interface SlideCardProps {
  slide: Slide;
  onEdit: () => void;
}

const SlideCard = ({ slide, onEdit }: SlideCardProps) => {
  return (
    <Card className="group relative overflow-hidden shadow-soft hover:shadow-medium transition-shadow">
      <div className="absolute top-2 right-2 z-10">
        <Button
          size="sm"
          variant="secondary"
          className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Edit className="h-3 w-3" />
          Edit
        </Button>
      </div>

      <div className="p-6">
        {/* Slide Number */}
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Slide {slide.index}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {slide.duration_minutes}m
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-4 text-lg font-semibold text-card-foreground line-clamp-2">
          {slide.title}
        </h3>

        {/* Bullets */}
        <ul className="mb-4 space-y-2">
          {slide.bullets.slice(0, 3).map((bullet, index) => (
            <li key={index} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span>
              <span className="line-clamp-1">{bullet}</span>
            </li>
          ))}
          {slide.bullets.length > 3 && (
            <li className="text-xs text-muted-foreground pl-4">
              +{slide.bullets.length - 3} more points
            </li>
          )}
        </ul>

        {/* Layout & Image Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {slide.layout_hint}
          </Badge>
          {slide.image_suggestion && (
            <div className="flex items-center gap-1">
              <Image className="h-3 w-3" />
              Image
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SlideCard;
