import { useState, useCallback } from "react";
import { Upload as UploadIcon, File, X, CheckCircle, Loader2, FileJson, FileText, Database } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FlappyBird } from "@/components/game/FlappyBird";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: "uploading" | "analyzing" | "complete" | "error";
  progress: number;
}

const supportedFormats = [
  { icon: Database, name: "PCAP", desc: "Network capture files" },
  { icon: FileJson, name: "JSON", desc: "Structured log data" },
  { icon: FileText, name: "CSV", desc: "Tabular log exports" },
];

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = (file: File) => {
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        // Start analysis
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "analyzing", progress: 100 } : f
          )
        );

        // Simulate analysis
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, status: "complete" } : f
            )
          );
        }, 2000);
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, progress } : f
          )
        );
      }
    }, 200);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(simulateUpload);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(simulateUpload);
    }
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <PageLayout>
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Upload Logs
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload your HTTP traffic logs for automated attack detection and analysis
            </p>
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "cyber-card p-12 lg:p-16 text-center transition-all duration-300 cursor-pointer group",
              isDragging && "border-primary bg-primary/5 shadow-glow"
            )}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pcap,.json,.csv"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div
                className={cn(
                  "w-24 h-24 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto mb-8 transition-all duration-300",
                  isDragging && "scale-110 border-primary bg-primary/20",
                  "group-hover:scale-105 group-hover:border-primary"
                )}
              >
                <UploadIcon className={cn(
                  "w-10 h-10 text-primary transition-all duration-300",
                  isDragging && "animate-bounce"
                )} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse from your computer
              </p>
              <Button variant="hero" size="lg" className="pointer-events-none">
                Select Files
              </Button>
            </label>
          </div>

          {/* Supported Formats */}
          <div className="mt-10">
            <h4 className="text-sm font-medium text-muted-foreground text-center mb-4">
              Supported Formats
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {supportedFormats.map((format) => (
                <div
                  key={format.name}
                  className="cyber-card p-4 text-center"
                >
                  <format.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-foreground">{format.name}</p>
                  <p className="text-xs text-muted-foreground">{format.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-10 space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Uploaded Files</h4>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="cyber-card p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <File className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="h-1.5" />
                    )}
                    {file.status === "analyzing" && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </div>
                    )}
                    {file.status === "complete" && (
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <CheckCircle className="w-4 h-4" />
                        Analysis complete
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {files.some((f) => f.status === "complete") && (
                <div className="flex justify-center pt-4">
                  <Button variant="hero" size="lg" className="gap-2">
                    View Analysis Results
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FlappyBird />
    </PageLayout>
  );
}
