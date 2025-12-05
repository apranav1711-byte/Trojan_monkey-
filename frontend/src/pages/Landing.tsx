import { Link } from "react-router-dom";
import { Shield, Target, BarChart3, Upload, ArrowRight, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

const features = [
  {
    icon: Target,
    title: "URL Attack Classification",
    description: "Advanced ML-powered detection identifies SQL injection, XSS, path traversal, and command injection attacks in real-time.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Shield,
    title: "Attempt vs Success Detection",
    description: "Distinguish between failed attack attempts and successful intrusions with precision analysis of HTTP response codes.",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: BarChart3,
    title: "Visual Dashboard & Reports",
    description: "Comprehensive analytics with interactive charts, exportable reports, and real-time threat monitoring.",
    gradient: "from-neon-purple/20 to-neon-purple/5",
  },
];

const stats = [
  { value: "99.9%", label: "Detection Accuracy" },
  { value: "< 50ms", label: "Analysis Speed" },
  { value: "24/7", label: "Monitoring" },
];

export default function Landing() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 text-center">
          <div className="animate-fade-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Automated HTTP Attack
              <br />
              <span className="text-primary neon-text">Detection & Analysis</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Classify malicious URLs, detect attempts vs successful intrusions, 
              and visualize attack patterns instantly with our cutting-edge security platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button variant="hero-outline" size="xl" className="gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Logs
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 stagger-children">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Security Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to detect, analyze, and respond to HTTP-based attacks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="cyber-card p-8 lg:p-10 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-card p-10 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-cyber-gradient opacity-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Secure Your Infrastructure?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start analyzing your HTTP traffic today and detect attacks before they cause damage.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button variant="hero" size="lg" className="gap-2">
                    <Eye className="w-5 h-5" />
                    View Dashboard
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">HTTP Attack Analyzer</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}
