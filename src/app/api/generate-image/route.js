import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
        // Get the prompt from the request body
        const { text, userId } = await req.json();

        // Validate the prompt
        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: 'Please provide a valid text prompt' }, { status: 400 });
        }

        // NGrok URL (Replace with your actual ngrok URL)
        const ngrokUrl = 'https://3fe5-35-196-100-2.ngrok-free.app/api/generate-image'; // Make sure to have the /api/generate-image at the end

        // Create the request body for your Colab server
        const requestBody = {
            text: text, // The prompt
            userId: userId, // You can use a default user ID here
        };

        // Send a POST request to your ngrok URL
        const response = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Handle errors from your Colab server
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from ngrok server:', errorData);
            return NextResponse.json(errorData, { status: response.status });
        }

        // Process the response from your Colab server
        const responseData = await response.json();

        if (!responseData.imageData) {
            // Handle errors or unexpected data from the Colab server
            console.error('Unexpected response format from ngrok server:', responseData);
            return NextResponse.json({ error: 'Unexpected response format from ngrok server' }, { status: 500 });
        }

        // The response contains a base64 image
        const base64Image = responseData.imageData;

        console.log('Storing image data in Firestore...');
        const docRef = await addDoc(collection(db, 'images'), {
            userId: userId,
            prompt: text,
            imageData: base64Image,
            likes: [],
            comments: [],
            createdAt: new Date(),
        });

        console.log('Image stored successfully. Document ID:', docRef.id);
        return NextResponse.json({ imageId: docRef.id });

    } catch (error) {
        console.error('Error in generate-image route:', error);
        return NextResponse.json({ error: error.message || 'An error occurred during image generation and storage.' }, { status: 500 });
    }
}
