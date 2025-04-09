import { NextRequest, NextResponse } from 'next/server';

// This URL should be set in your environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Get the API key from the headers
    const apiKey = request.headers.get('X-API-Key');

    if (!apiKey) {
      return NextResponse.json(
        { detail: 'API key is required' },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the FastAPI backend
    const response = await fetch(`${API_URL}/parse_bill`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });

    // Get the response data
    const data = await response.json();

    // If the response is not OK, return an error
    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || 'Failed to parse bill' },
        { status: response.status }
      );
    }

    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json(
      { detail: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
