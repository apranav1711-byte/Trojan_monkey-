import { useState } from "react";
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Copy, Download, 
  ExternalLink, Globe, Clock, Server, FileCode, Brain, Flag, Loader2
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FlappyBird } from "@/components/game/FlappyBird";
import { toast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLogById, HttpEvent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Convert backend HttpEvent to frontend attack data format
const convertToAttackData = (event: HttpEvent) => {
  const severityToRisk: Record<string, "critical" | "high" | "medium" | "low"> = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
  };

  // Extract malicious payload from URL (simplified)
  const extractPayload = (url: string, attackType: string): string => {
    if (attackType === "SQL Injection") {
      const match = url.match(/(['"][^'"]*['"])/);
      return match ? match[1] : url.split("?")[1] || "";
    }
    if (attackType === "XSS") {
      const match = url.match(/<script[^>]*>.*?<\/script>/i);
      return match ? match[0] : url.split("?")[1] || "";
    }
    if (attackType === "Directory Traversal" || attackType === "Path Traversal") {
      const match = url.match(/(\.\.\/)+/);
      return match ? match[0] + "..." : url;
    }
    return url.split("?")[1] || url;
  };

  const maliciousPayload = event.isAttack ? extractPayload(event.url, event.attackType) : "";
  const baseUrl = event.url.split("?")[0] || event.url;

  // Generate AI explanation based on attack type
  const generateExplanation = (event: HttpEvent): string => {
    if (!event.isAttack) {
      return "This request appears to be legitimate and was not flagged as an attack.";
    }

    const explanations: Record<string, string> = {
      "SQL Injection": `This attack attempts to exploit SQL injection vulnerability by injecting malicious SQL code into the request parameters.

**Why it's dangerous:**
- Could expose all user records in the database
- Might allow unauthorized access to admin accounts
- Could lead to data exfiltration or modification

**Detection reasoning:**
${(event.detectionReasons || []).map(r => `- ${r}`).join("\n") || "- SQL injection pattern detected in URL parameters"}

**Recommendation:**
- Implement parameterized queries
- Add input validation and sanitization
- Use WAF rules to block common SQL injection patterns`,
      "XSS": `This attack attempts to inject malicious JavaScript code into the application.

**Why it's dangerous:**
- Could steal user session cookies
- Might redirect users to malicious sites
- Could deface the website

**Detection reasoning:**
${(event.detectionReasons || []).map(r => `- ${r}`).join("\n") || "- XSS pattern detected in request"}

**Recommendation:**
- Sanitize all user input
- Use Content Security Policy (CSP)
- Encode output properly`,
      "Directory Traversal": `This attack attempts to access files outside the web root directory.

**Why it's dangerous:**
- Could expose sensitive system files
- Might allow reading configuration files
- Could lead to system compromise

**Detection reasoning:**
${(event.detectionReasons || []).map(r => `- ${r}`).join("\n") || "- Path traversal pattern detected"}

**Recommendation:**
- Validate and sanitize file paths
- Use whitelist of allowed directories
- Implement proper access controls`,
      "Command Injection": `This attack attempts to execute system commands on the server.

**Why it's dangerous:**
- Could execute arbitrary commands
- Might compromise the entire server
- Could lead to data breach

**Detection reasoning:**
${(event.detectionReasons || []).map(r => `- ${r}`).join("\n") || "- Command injection pattern detected"}

**Recommendation:**
- Avoid executing user input as commands
- Use parameterized commands
- Implement strict input validation`,
    };

    return explanations[event.attackType] || `This attack was detected as ${event.attackType}.

**Severity:** ${event.severity}
**Status:** ${event.isSuccessful ? "Successful" : "Blocked"}

**Detection reasoning:**
${(event.detectionReasons || []).map(r => `- ${r}`).join("\n") || "- Attack pattern detected"}`;
  };

  const requestHeaders = `${event.method} ${event.url} HTTP/1.1
Host: ${event.destIP}
User-Agent: ${event.userAgent || "Unknown"}
Accept: */*
Connection: keep-alive`;

  const responseBody = event.statusCode >= 400
    ? `{
  "error": "${event.statusCode >= 500 ? "Internal Server Error" : event.statusCode === 403 ? "Forbidden" : "Bad Request"}",
  "message": "${event.isAttack ? "Potential attack detected" : "Request failed"}",
  "code": ${event.statusCode},
  "timestamp": "${event.timestamp}"
}`
    : `{
  "status": "success",
  "code": ${event.statusCode},
  "timestamp": "${event.timestamp}"
}`;

  // Calculate IP reputation (simplified - count attacks from same IP)
  const ipReputation = {
    score: event.isAttack ? (event.severity === "CRITICAL" ? 85 : event.severity === "HIGH" ? 70 : 50) : 20,
    reports: event.isAttack ? 1 : 0,
    lastSeen: new Date(event.timestamp).toISOString().split("T")[0],
    category: event.isAttack ? "Suspicious Activity" : "Normal",
  };

  return {
    id: event._id || "unknown",
    timestamp: new Date(event.timestamp).toLocaleString(),
    ip: event.srcIP,
    country: "Unknown",
    url: event.url,
    method: event.method,
    attackType: event.attackType || "NONE",
    riskLevel: severityToRisk[event.severity] || "low",
    status: event.isSuccessful ? "success" : "attempt",
    responseCode: event.statusCode,
    maliciousPayload,
    baseUrl,
    requestHeaders,
    responseBody,
    aiExplanation: generateExplanation(event),
    ipReputation,
    detectionReasons: event.detectionReasons || [],
    isAttack: event.isAttack,
  };
};

export default function AttackDetail() {
  const [isResolved, setIsResolved] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["log", id],
    queryFn: () => getLogById(id!),
    enabled: !!id,
  });

  const attackData = data?.item ? convertToAttackData(data.item) : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied successfully.",
    });
  };

  if (!id) {
    return (
      <PageLayout>
        <div className="min-h-screen px-6 lg:px-10 py-10 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Attack Selected</h2>
            <p className="text-muted-foreground mb-4">Please select an attack from the logs page.</p>
            <Button onClick={() => navigate("/logs")}>Go to Logs</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen px-6 lg:px-10 py-10">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-64 mb-10" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !attackData) {
    return (
      <PageLayout>
        <div className="min-h-screen px-6 lg:px-10 py-10 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Attack</h2>
            <p className="text-muted-foreground mb-4">
              {error ? "Failed to load attack details." : "Attack not found."}
            </p>
            <Button onClick={() => navigate("/logs")}>Go to Logs</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

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
                  {attackData.isAttack ? "Attack Analysis" : "Request Analysis"}
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
                    {attackData.maliciousPayload ? (
                      <>
                        {attackData.baseUrl}
                        <span className="text-destructive bg-destructive/20 px-1 rounded">
                          ?{attackData.maliciousPayload}
                        </span>
                      </>
                    ) : (
                      attackData.url
                    )}
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
                  {attackData.detectionReasons.length > 0 ? (
                    attackData.detectionReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        {reason}
                      </li>
                    ))
                  ) : attackData.isAttack ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Attack pattern detected in {attackData.attackType}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        Severity: {attackData.riskLevel.toUpperCase()}
                      </li>
                    </>
                  ) : (
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      This request was not flagged as malicious
                    </li>
                  )}
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
