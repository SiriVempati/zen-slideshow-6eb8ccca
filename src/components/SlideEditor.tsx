import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface Slide {
  index: number;
  title: string;
  bullets: string[];
  speaker_notes: string;
  duration_minutes: number;
  layout_hint: string;
  image_suggestion?: string;
}

interface SlideEditorProps {
  slide: Slide;
  onSave: (slide: Slide) => void;
  onClose: () => void;
}

const SlideEditor = ({ slide, onSave, onClose }: SlideEditorProps) => {
  const [editedSlide, setEditedSlide] = useState<Slide>(slide);

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...editedSlide.bullets];
    newBullets[index] = value;
    setEditedSlide({ ...editedSlide, bullets: newBullets });
  };

  const handleAddBullet = () => {
    setEditedSlide({
      ...editedSlide,
      bullets: [...editedSlide.bullets, ""],
    });
  };

  const handleRemoveBullet = (index: number) => {
    const newBullets = editedSlide.bullets.filter((_, i) => i !== index);
    setEditedSlide({ ...editedSlide, bullets: newBullets });
  };

  const handleSave = () => {
    onSave(editedSlide);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Edit Slide {slide.index}</DialogTitle>
            <Badge variant="secondary">{editedSlide.layout_hint}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Slide Title</Label>
            <Input
              id="title"
              value={editedSlide.title}
              onChange={(e) => setEditedSlide({ ...editedSlide, title: e.target.value })}
            />
          </div>

          {/* Bullets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Content Points</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddBullet} className="gap-1">
                <Plus className="h-3 w-3" />
                Add Point
              </Button>
            </div>
            <div className="space-y-2">
              {editedSlide.bullets.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder={`Point ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveBullet(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Speaker Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Speaker Notes</Label>
            <Textarea
              id="notes"
              value={editedSlide.speaker_notes}
              onChange={(e) => setEditedSlide({ ...editedSlide, speaker_notes: e.target.value })}
              rows={4}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="30"
              value={editedSlide.duration_minutes}
              onChange={(e) => setEditedSlide({ ...editedSlide, duration_minutes: parseInt(e.target.value) || 1 })}
            />
          </div>

          {/* Image Suggestion */}
          {editedSlide.image_suggestion && (
            <div className="space-y-2">
              <Label htmlFor="image">Image Suggestion</Label>
              <Input
                id="image"
                value={editedSlide.image_suggestion}
                onChange={(e) => setEditedSlide({ ...editedSlide, image_suggestion: e.target.value })}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlideEditor;
