import { NextRequest, NextResponse } from 'next/server';

// This URL should be set in your environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Get the API key from the headers
    const apiKey = request.headers.get('X-API-Key');

    if (!apiKey) {
      return NextResponse.json(
        { detail: 'API key is required' },
        { status: 401 }
      );
    }

    // Forward the request to the FastAPI backend
    const response = await fetch(`${API_URL}/validate-key`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    });

    // Get the response data
    const data = await response.json();

    // If the response is not OK, return an error
    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Invalid API key' },
        { status: response.status }
      );
    }

    // Return the data with remaining credits
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { detail: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
