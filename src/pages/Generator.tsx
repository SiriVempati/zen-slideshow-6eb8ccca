import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  topic: string;
  slideCount: number;
  audience: string;
  presenter: string;
  designation: string;
  tone: string;
  language: string;
  tags: string;
  notes: string;
  includeImages: boolean;
}

const Generator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    slideCount: 10,
    audience: "",
    presenter: "",
    designation: "",
    tone: "professional",
    language: "english",
    tags: "",
    notes: "",
    includeImages: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your presentation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: formData,
      });

      if (error) throw error;

      // Store in session storage and navigate
      sessionStorage.setItem('presentationData', JSON.stringify(data));
      navigate('/preview');
      
      toast({
        title: "Presentation generated!",
        description: "Your slides are ready to preview and edit",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create Your Presentation</h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details below to generate your AI-powered presentation
          </p>
        </div>

        <Card className="p-6 shadow-medium">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Artificial Intelligence in Healthcare"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
              />
            </div>

            {/* Slide Count */}
            <div className="space-y-2">
              <Label htmlFor="slideCount">Number of Slides (3-50)</Label>
              <Input
                id="slideCount"
                type="number"
                min="3"
                max="50"
                value={formData.slideCount}
                onChange={(e) => setFormData({ ...formData, slideCount: parseInt(e.target.value) || 10 })}
              />
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Healthcare professionals, Students, Business executives"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              />
            </div>

            {/* Presenter Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="presenter">Presenter Name</Label>
                <Input
                  id="presenter"
                  placeholder="Your name"
                  value={formData.presenter}
                  onChange={(e) => setFormData({ ...formData, presenter: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="Your role/title"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
            </div>

            {/* Tone & Language */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Keywords/Tags</Label>
              <Input
                id="tags"
                placeholder="Comma-separated tags (e.g., AI, machine learning, innovation)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            {/* Extra Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements or additional context..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            {/* Include Images Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="includeImages" className="text-base">
                  Include Image Suggestions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Generate image suggestions for each slide
                </p>
              </div>
              <Switch
                id="includeImages"
                checked={formData.includeImages}
                onCheckedChange={(checked) => setFormData({ ...formData, includeImages: checked })}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full gap-2" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Presentation...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Presentation
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Generator;
