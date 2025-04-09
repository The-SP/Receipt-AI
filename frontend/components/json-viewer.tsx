'use client';

import { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JsonViewerProps {
  data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedJson);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
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

      <div className="bg-muted font-mono text-sm p-4 rounded-md overflow-auto max-h-[60vh] mt-2">
        <pre
          className="whitespace-pre-wrap"
          style={{ fontFamily: 'monospace' }}
        >
          {formattedJson}
        </pre>
      </div>
    </div>
  );
}
