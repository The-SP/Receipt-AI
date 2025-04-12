import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  FileJson,
  Upload,
  Key,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex flex-col max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            About Receipt AI
          </h1>
          <p className="text-muted-foreground mt-2">
            A powerful tool for extracting structured data from bill images
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Simple steps to extract data from your bills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">1. Enter your API Key</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Provide your API key and validate it to access the parsing
                    service.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">2. Upload a Bill</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop or select an image file of your bill or
                    receipt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileJson className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">3. Get Structured Data</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive a JSON response with structured data from your bill,
                    including items, prices, and totals.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Key capabilities of our bill parsing service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <FileJson className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Structured JSON Output</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Extract restaurant name, items, quantities, prices, taxes,
                    and totals in a structured format.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Text Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For non-bill documents, receive text analysis explaining
                    what's in the image.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Credit Management</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track your API credit usage with a visual indicator.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">AI-Powered Recognition</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Leverages advanced AI models (Gemini) to accurately parse
                    bill information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="text-center text-sm text-muted-foreground py-4">
          <p>
            Powered by AI • Fast and accurate
          </p>
        </div>
      </div>
    </main>
  );
}
