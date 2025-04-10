"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string, credits: number | null) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateApiKey = async () => {
    if (!value) return;
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const response = await fetch("/api/proxy/validate-key", {
        method: "GET",
        headers: {
          "X-API-Key": value
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setValidationError(data.detail || "Invalid API key");
        onChange("", null); // Reset API key and credits
      } else {
        // Pass the validated key and the credits back to parent
        onChange(value, data.remaining_credits);
      }
    } catch (error) {
      setValidationError("Failed to validate API key");
      onChange("", null);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key">API Key</Label>
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            value={value}
            onChange={(e) => {
              onChange(e.target.value, null);
              setValidationError(null);
            }}
            placeholder="Enter your API key"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={validateApiKey}
          disabled={!value || isValidating}
        >
          {isValidating ? "Validating..." : "Validate"}
        </Button>
      </div>
      {validationError ? (
        <p className="text-xs text-red-500">{validationError}</p>
      ) : (
        <p className="text-xs text-gray-500">
          Enter your API key to access the bill parsing service
        </p>
      )}
    </div>
  );
}