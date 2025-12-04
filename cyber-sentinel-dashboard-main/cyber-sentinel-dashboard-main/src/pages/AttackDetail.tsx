import { useState } from "react";
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Copy, Download, 
  ExternalLink, Globe, Clock, Server, FileCode, Brain, Flag
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FlappyBird } from "@/components/game/FlappyBird";
import { toast } from "@/hooks/use-toast";

const attackData = {
  id: "ATK-2024-0315-001",
  timestamp: "2024-03-15 14:32:18 UTC",
  ip: "192.168.1.105",
  country: "Unknown",
  url: "/api/users?id=1' OR '1'='1'--",
  method: "GET",
  attackType: "SQL Injection",
  riskLevel: "critical",
  status: "attempt",
  responseCode: 403,
  maliciousPayload: "1' OR '1'='1'--",
  requestHeaders: `GET /api/users?id=1' OR '1'='1'-- HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Connection: keep-alive`,
  responseBody: `{
  "error": "Forbidden",
  "message": "Potential SQL injection detected",
  "code": 403,
  "timestamp": "2024-03-15T14:32:18Z"
}`,
  aiExplanation: `This attack attempts to exploit SQL injection vulnerability by injecting a boolean-based payload. The attacker used the classic "OR '1'='1'" technique to bypass authentication or extract data.

**Why it's dangerous:**
- Could expose all user records in the database
- Might allow unauthorized access to admin accounts
- Could lead to data exfiltration or modification

**Detection reasoning:**
- Single quote (') detected in parameter value
- SQL boolean operator OR found
- Comment terminator (--) used to ignore remaining query

**Recommendation:**
- Implement parameterized queries
- Add input validation and sanitization
- Use WAF rules to block common SQL injection patterns`,
  ipReputation: {
    score: 85,
    reports: 12,
    lastSeen: "2024-03-14",
    category: "Suspicious Scanner",
  },
};

export default function AttackDetail() {
  const [isResolved, setIsResolved] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied successfully.",
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-up">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/50">
                    {attackData.riskLevel}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                    {attackData.status}
                  </Badge>
                  {isResolved && (
                    <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Attack Analysis
                </h1>
                <p className="text-muted-foreground mt-1">
                  ID: {attackData.id}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button 
                  variant={isResolved ? "outline" : "cyber-green"}
                  className="gap-2"
                  onClick={() => setIsResolved(!isResolved)}
                >
                  <Flag className="w-4 h-4" />
                  {isResolved ? "Reopen" : "Mark Resolved"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Full URL */}
              <div className="cyber-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Request URL
                </h3>
                <div className="code-block relative group">
                  <code className="text-sm text-foreground break-all">
                    {attackData.url.split(attackData.maliciousPayload)[0]}
                    <span className="text-destructive bg-destructive/20 px-1 rounded">
                      {attackData.maliciousPayload}
                    </span>
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(attackData.url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Attack Classification */}
              <div className="cyber-card p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Attack Classification
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Type</p>
                    <p className="text-lg font-semibold text-primary">{attackData.attackType}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Method</p>
                    <p className="text-lg font-semibold text-foreground">{attackData.method}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Response Code</p>
                    <p className={cn(
                      "text-lg font-semibold",
                      attackData.responseCode >= 400 ? "text-secondary" : "text-destructive"
                    )}>
                      {attackData.responseCode}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Outcome</p>
                    <div className="flex items-center gap-2">
                      {attackData.status === "attempt" ? (
                        <>
                          <Shield className="w-5 h-5 text-secondary" />
                          <span className="text-lg font-semibold text-secondary">Blocked</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-destructive" />
                          <span className="text-lg font-semibold text-destructive">Success</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request & Response */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="cyber-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    HTTP Request
                  </h3>
                  <div className="code-block max-h-48 overflow-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {attackData.requestHeaders}
                    </pre>
                  </div>
                </div>
                <div className="cyber-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-secondary" />
                    HTTP Response
                  </h3>
                  <div className="code-block max-h-48 overflow-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {attackData.responseBody}
                    </pre>
                  </div>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="cyber-card p-6 lg:p-8 border-primary/30">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Analysis
                </h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  {attackData.aiExplanation.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Attack Info */}
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="text-sm text-foreground font-mono">{attackData.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Source IP</p>
                      <p className="text-sm text-foreground font-mono">{attackData.ip}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* IP Reputation */}
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">IP Reputation</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Threat Score</span>
                      <span className={cn(
                        "text-sm font-bold",
                        attackData.ipReputation.score >= 70 ? "text-destructive" : 
                        attackData.ipReputation.score >= 40 ? "text-warning" : "text-secondary"
                      )}>
                        {attackData.ipReputation.score}/100
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          attackData.ipReputation.score >= 70 ? "bg-destructive" : 
                          attackData.ipReputation.score >= 40 ? "bg-warning" : "bg-secondary"
                        )}
                        style={{ width: `${attackData.ipReputation.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Reports</p>
                      <p className="font-semibold text-foreground">{attackData.ipReputation.reports}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-semibold text-foreground">{attackData.ipReputation.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Malicious */}
              <div className="cyber-card p-6 border-destructive/30">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Why It's Malicious
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    SQL escape character (') in parameter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    Boolean injection pattern detected
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    SQL comment terminator (--)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    Known attack signature match
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FlappyBird />
    </PageLayout>
  );
}
