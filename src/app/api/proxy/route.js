// src/pages/api/generate-image.js
import axios from 'axios';

export default async function handler(req, res) {
    console.log('API route called');
    if (req.method === 'POST') {
        try {
            const { text } = req.body;

            const response = await axios.post(
                'https://api.openai.com/v1/images/generations',
                {
                    prompt: text,
                    n: 1,
                    size: '1024x1024',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                }
            );

            const imageUrl = response.data.data[0].url;

            res.status(200).json({ imageUrl });
        } catch (error) {
            console.error('Error in generate-image route:', error);
            res.status(500).json({ error: error.message || 'An error occurred during image generation.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
