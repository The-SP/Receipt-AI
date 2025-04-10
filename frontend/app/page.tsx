"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ApiKeyInput } from "@/components/api-key-input";
import { CreditsDisplay } from "@/components/credits-display";
import { JsonViewer } from "@/components/json-viewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedBillItem {
  name?: string;
  quantity?: number;
  price?: number;
  [key: string]: any; // Allow for additional fields
}

interface ParsedBillTax {
  name?: string;
  rate?: string;
  amount?: number;
  [key: string]: any; // Allow for additional fields
}

interface ParsedBill {
  restaurant_name?: string;
  bill_number?: string;
  date?: string;
  items?: ParsedBillItem[];
  sub_total?: number;
  taxes?: ParsedBillTax[];
  grand_total?: number;
  address?: string;
  other_info?: string;
  [key: string]: any; // Allow for additional fields not defined in the interface
}

interface ParsedResponse {
  type: "json" | "text";
  data: ParsedBill | string;
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const [credits, setCredits] = useState<number | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeyChange = (key: string, remainingCredits: number | null) => {
    setApiKey(key);
    setCredits(remainingCredits);
  };

  const handleFileUpload = async (file: File) => {
    if (!apiKey) {
      setError("Please enter an API key first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedData(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/proxy/parse_bill", {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to parse bill");
      }
      
      const data = await response.json();
      
      // Check if the response matches our expected format
      if (data && (data.type === "json" || data.type === "text")) {
        setParsedData(data as ParsedResponse);
      } else {
        setParsedData({
          type: "text",
          data: data
        });
      }
      
      // Update credits after successful API call
      setCredits((prev) => (prev !== null ? prev - 1 : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col items-center space-y-6 max-w-4xl mx-auto">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Bill Parser</CardTitle>
              <CardDescription>
                Upload an image of a bill to extract the information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <ApiKeyInput value={apiKey} onChange={handleApiKeyChange} />
                {credits !== null && <CreditsDisplay credits={credits} />}
                {apiKey && credits !== null ? (
                  <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
                ) : (
                  <div className="p-4 bg-muted/50 rounded-md text-center">
                    <p className="text-muted-foreground">Please enter and validate your API key to upload bills</p>
                  </div>
                )}
                {error && (
                  <div className="p-4 mt-4 bg-red-50 text-red-500 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {parsedData && (
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Parsed Results</CardTitle>
                <CardDescription>
                  {parsedData.type === "json" 
                    ? "Structured data extracted from the bill" 
                    : "Text content extracted from the document"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JsonViewer data={parsedData} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}