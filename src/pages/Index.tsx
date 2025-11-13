import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Presentation, FileEdit, Download, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              AI PowerPoint Generator
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Generate professional PowerPoint presentations instantly. Just provide your topic, and let AI create beautiful, content-rich slides in seconds.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/generator">
                <Button size="lg" className="gap-2 shadow-medium">
                  <Presentation className="h-5 w-5" />
                  Create Presentation
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Globe className="h-5 w-5" />
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Create professional presentations with advanced AI technology
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Generate complete presentations in seconds. No more hours of manual work.
              </p>
            </Card>

            <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <FileEdit className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Fully Editable
              </h3>
              <p className="text-muted-foreground">
                Preview and edit every slide. Customize content to match your needs perfectly.
              </p>
            </Card>

            <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Download className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Export Ready
              </h3>
              <p className="text-muted-foreground">
                Download as JSON or PowerPoint. Share your presentations anywhere.
              </p>
            </Card>

            <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Smart Content
              </h3>
              <p className="text-muted-foreground">
                AI-generated content tailored to your audience and presentation style.
              </p>
            </Card>

            <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Presentation className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Professional Design
              </h3>
              <p className="text-muted-foreground">
                Beautiful layouts and color schemes that make your content shine.
              </p>
            </Card>

            <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Multi-Language
              </h3>
              <p className="text-muted-foreground">
                Create presentations in multiple languages for global audiences.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Create Amazing Presentations?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Join thousands of professionals using AI to create stunning presentations
          </p>
          <Link to="/generator">
            <Button size="lg" variant="secondary" className="gap-2 shadow-large">
              <Presentation className="h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
