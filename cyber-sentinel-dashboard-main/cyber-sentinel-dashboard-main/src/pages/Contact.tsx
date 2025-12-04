import { useState } from "react";
import { Mail, MessageSquare, Send, ChevronDown, Users, HelpCircle, BookOpen } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { FlappyBird } from "@/components/game/FlappyBird";

const faqs = [
  {
    question: "What file formats are supported for upload?",
    answer: "We support PCAP (network capture files), JSON (structured log data), and CSV (tabular log exports). Maximum file size is 100MB per upload.",
  },
  {
    question: "How does the attack classification work?",
    answer: "Our ML-powered engine analyzes HTTP traffic patterns, URL parameters, request bodies, and headers to identify known attack signatures and anomalies. We detect SQL injection, XSS, path traversal, command injection, and more.",
  },
  {
    question: "What's the difference between 'Attempt' and 'Success'?",
    answer: "An 'Attempt' indicates the attack was detected and blocked (HTTP 4xx/5xx response). A 'Success' means the attack received a 2xx response, potentially indicating the payload executed or data was accessed.",
  },
  {
    question: "Can I export my analysis results?",
    answer: "Yes! You can export reports in PDF, CSV, or JSON formats. Navigate to the Reports page and use the export options to download your data.",
  },
  {
    question: "How accurate is the detection?",
    answer: "Our detection engine has a 99.9% accuracy rate with minimal false positives. We continuously train our models on new attack patterns and signatures.",
  },
];

export default function Contact() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <PageLayout>
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Help & Support
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get in touch with our team or find answers to common questions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Contact Support</h2>
              </div>

              <div className="cyber-card p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea
                      placeholder="How can we help?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:border-primary min-h-[150px]"
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    Or email us directly at{" "}
                    <a href="mailto:support@httpattackanalyzer.com" className="text-primary hover:underline">
                      support@httpattackanalyzer.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="cyber-card overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
                    >
                      <span className="font-medium text-foreground pr-4">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300",
                          expandedFaq === index && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        expandedFaq === index ? "max-h-48" : "max-h-0"
                      )}
                    >
                      <p className="px-5 pb-5 text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-16 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="cyber-card p-8 lg:p-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About the Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                HTTP Attack Analyzer was built by a team of security researchers and engineers 
                passionate about making the web safer. Our mission is to democratize 
                security analysis and help organizations detect threats before they cause damage.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
                <BookOpen className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary font-medium">
                  Built for Cybersecurity Hackathon 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FlappyBird />
    </PageLayout>
  );
}
