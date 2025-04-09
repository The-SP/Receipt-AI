'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ApiKeyInput } from '@/components/api-key-input';
import { CreditsDisplay } from '@/components/credits-display';
import { FileUpload } from '@/components/file-upload';
import { JsonViewer } from '@/components/json-viewer';

interface ParsedBill {
  restaurant_name: string;
  bill_number: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  sub_total: number;
  taxes: Array<{
    name: string;
    rate: string;
    amount: number;
  }>;
  grand_total: number;
  address: string;
  other_info: string;
}

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [credits, setCredits] = useState<number | null>(null);
  const [parsedData, setParsedData] = useState<ParsedBill | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    // In a real app, you might validate the key here and fetch the credits
    setCredits(5); // Mocked for now
  };

  const handleFileUpload = async (file: File) => {
    if (!apiKey) {
      setError('Please enter an API key first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/proxy/parse_bill', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to parse bill');
      }

      const data = await response.json();
      setParsedData(data);

      // Update credits after successful API call
      setCredits((prev) => (prev !== null ? prev - 1 : null));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
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
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                />
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
                  JSON output from the bill parser
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
