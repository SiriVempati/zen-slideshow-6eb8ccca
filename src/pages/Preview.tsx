import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileJson, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SlideCard from "@/components/SlideCard";
import SlideEditor from "@/components/SlideEditor";

interface Slide {
  index: number;
  title: string;
  bullets: string[];
  speaker_notes: string;
  duration_minutes: number;
  layout_hint: string;
  image_suggestion?: string;
}

interface PresentationData {
  metadata: {
    topic: string;
    slide_count: number;
    audience: string;
    presenter: string;
    tone: string;
    language: string;
    date_generated: string;
  };
  slides: Slide[];
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  summary: string[];
}

const Preview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<PresentationData | null>(null);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('presentationData');
    if (!storedData) {
      toast({
        title: "No presentation data",
        description: "Please generate a presentation first",
        variant: "destructive",
      });
      navigate('/generator');
      return;
    }
    
    try {
      setData(JSON.parse(storedData));
    } catch (error) {
      console.error('Failed to parse presentation data:', error);
      navigate('/generator');
    }
  }, [navigate, toast]);

  const handleSaveEdit = (updatedSlide: Slide) => {
    if (!data) return;
    
    const updatedSlides = data.slides.map(slide => 
      slide.index === updatedSlide.index ? updatedSlide : slide
    );
    
    const updatedData = { ...data, slides: updatedSlides };
    setData(updatedData);
    sessionStorage.setItem('presentationData', JSON.stringify(updatedData));
    setEditingSlide(null);
    
    toast({
      title: "Slide updated",
      description: "Your changes have been saved",
    });
  };

  const handleDownloadJSON = () => {
    if (!data) return;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.metadata.topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your presentation JSON is being downloaded",
    });
  };

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/generator">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Generator
            </Button>
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{data.metadata.topic}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{data.metadata.slide_count} Slides</Badge>
                <Badge variant="secondary">{data.metadata.tone}</Badge>
                <Badge variant="secondary">{data.metadata.language}</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleDownloadJSON}>
                <FileJson className="h-4 w-4" />
                Export JSON
              </Button>
              <Button className="gap-2" disabled>
                <Download className="h-4 w-4" />
                Download PPTX
              </Button>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <Card className="mb-8 p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.metadata.presenter && (
              <div>
                <p className="text-sm text-muted-foreground">Presenter</p>
                <p className="font-medium text-foreground">{data.metadata.presenter}</p>
              </div>
            )}
            {data.metadata.audience && (
              <div>
                <p className="text-sm text-muted-foreground">Audience</p>
                <p className="font-medium text-foreground">{data.metadata.audience}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Generated</p>
              <p className="font-medium text-foreground">{new Date(data.metadata.date_generated).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium text-foreground">
                ~{data.slides.reduce((sum, s) => sum + s.duration_minutes, 0)} minutes
              </p>
            </div>
          </div>
        </Card>

        {/* Color Palette */}
        <Card className="mb-8 p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Color Palette</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-lg shadow-soft" style={{ backgroundColor: data.palette.primary }} />
              <div>
                <p className="text-xs text-muted-foreground">Primary</p>
                <p className="text-sm font-mono text-foreground">{data.palette.primary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-lg shadow-soft" style={{ backgroundColor: data.palette.secondary }} />
              <div>
                <p className="text-xs text-muted-foreground">Secondary</p>
                <p className="text-sm font-mono text-foreground">{data.palette.secondary}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-lg shadow-soft" style={{ backgroundColor: data.palette.accent }} />
              <div>
                <p className="text-xs text-muted-foreground">Accent</p>
                <p className="text-sm font-mono text-foreground">{data.palette.accent}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Slides Grid */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Slides</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.slides.map((slide) => (
              <SlideCard
                key={slide.index}
                slide={slide}
                onEdit={() => setEditingSlide(slide)}
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        {data.summary && data.summary.length > 0 && (
          <Card className="p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Presentation Summary</h2>
            <ul className="space-y-2">
              {data.summary.map((point, index) => (
                <li key={index} className="flex gap-2 text-muted-foreground">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      {editingSlide && (
        <SlideEditor
          slide={editingSlide}
          onSave={handleSaveEdit}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
};

export default Preview;
