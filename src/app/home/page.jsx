'use client'

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase";
import { ImageCard } from '@/components/ImageCard';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [lastGeneratedImage, setLastGeneratedImage] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (user) {
            const q = query(
                collection(db, 'images'),
                where('userId', '==', user.uid)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const imageList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setImages(imageList);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: inputText, userId: user.uid }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "An error occurred while generating the image.");
            }

            setInputText("");
            setLastGeneratedImage(data.imageId);
        } catch (error) {
            console.error("Error generating image:", error);
            setError(error.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col justify-between p-8">
            <main className="flex-1 mb-8">
                <h1 className="text-3xl font-bold mb-6">Your Generated Images</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <ImageCard
                            key={image.id}
                            id={image.id}
                            imageData={image.imageData}
                            prompt={image.prompt}
                            likes={image.likes}
                            comments={image.comments}
                            userId={image.userId}
                            createdAt={image.createdAt.toDate()}
                        />
                    ))}
                </div>
            </main>

            <footer className="w-full max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            placeholder="Describe the image you want to generate..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
}

