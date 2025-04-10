"use client";

import { useState } from "react";
import { Clipboard, Check, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResponseData {
  type: "json" | "text";
  data: any;
}

interface JsonViewerProps {
  data: ResponseData;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  
  // For JSON data, format it nicely
  // For text data, just display the string directly
  const contentToDisplay = data.type === "json" 
    ? JSON.stringify(data.data, null, 2)
    : typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {data.type === "json" ? (
            <FileJson className="h-5 w-5 mr-2 text-primary" />
          ) : (
            <FileText className="h-5 w-5 mr-2 text-primary" />
          )}
          <span className="font-medium text-sm">
            {data.type === "json" ? "JSON Response" : "Text Response"}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-1" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      
      <div className={`${data.type === "text" ? "bg-white border border-muted p-4" : "bg-muted font-mono"} text-sm p-4 rounded-md overflow-auto max-h-[60vh]`}>
        {data.type === "text" ? (
          <div className="whitespace-pre-wrap">{contentToDisplay}</div>
        ) : (
          <pre className="whitespace-pre-wrap" style={{ fontFamily: "monospace" }}>
            {contentToDisplay}
          </pre>
        )}
      </div>
    </div>
  );
}