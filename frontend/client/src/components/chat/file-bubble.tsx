
import { FileText, Download, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileBubbleProps {
  fileName: string;
  fileSize: string;
  fileType?: string; // pdf, doc, img
}

export default function FileBubble({ fileName, fileSize, fileType = "doc" }: FileBubbleProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate download
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1500);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 w-64 flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-900/50 rounded flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-blue-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate" title={fileName}>
          {fileName}
        </p>
        <p className="text-xs text-slate-400">
          {fileSize} • {fileType.toUpperCase()}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-white"
        onClick={handleDownload}
        disabled={downloading || downloaded}
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : downloaded ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
