"use client";

import { useRef, useState } from "react";
import Together from "together-ai";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { DownloadIcon } from "@radix-ui/react-icons";

function Home() {
    const [input, setInput] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ratio, setRatio] = useState("9:16");
    const [isLoading, setIsLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const imageRef = useRef(null);

    const hRatio = ratio.split(":").map(Number)[0];
    const vRatio = ratio.split(":").map(Number)[1];

    const width = hRatio === 1 ? 512 : hRatio * 64;
    const height = vRatio === 1 ? 512 : vRatio * 64;

    const together = new Together({
        apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
    });

    const handleGenerateImage = async () => {
        setIsLoading(true);

        try {
            console.log(width, height);
            const response = await together.images.create({
                model: "black-forest-labs/FLUX.1-schnell-Free",
                prompt: input,
                width: width,
                height: height,
                response_format: "b64_json",
            });

            const base64Image = response.data[0].b64_json;
            const dataUrl = `data:image/png;base64,${base64Image}`;
            setImageUrl(dataUrl);
        } catch (error) {
            console.error("Error generating image:", error);
            // You might want to add some error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadImage = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'generated-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-10 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-y-auto"
            >
                <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
                    <div className="w-full md:w-1/2 p-6 flex flex-col">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black">
                            AI Image Generator
                        </h2>
                        <div className="flex-grow flex flex-col justify-center">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Describe the image you want to create..."
                                className="mb-4 resize-none rounded-2xl border-2 border-gray-300 focus:border-gray-500 transition-colors"
                                rows={5}
                            />
                            <div className="flex items-center space-x-4 mb-6">
                                <Select value={ratio} onValueChange={setRatio}>
                                    <SelectTrigger className="w-full rounded-full border-2 border-gray-300 focus:border-gray-500 transition-colors">
                                        <SelectValue placeholder="Select ratio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1:1">1:1</SelectItem>
                                        <SelectItem value="4:3">4:3</SelectItem>
                                        <SelectItem value="16:9">16:9</SelectItem>
                                        <SelectItem value="3:4">3:4</SelectItem>
                                        <SelectItem value="9:16">9:16</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    onClick={handleGenerateImage}
                                    disabled={isLoading}
                                    className="flex-shrink-0 bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                                >
                                    {isLoading ? "Generating..." : "Generate Image"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="hidden md:block" />
                    <div className="w-full md:w-1/2 p-6 bg-gray-50/50 flex flex-col">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black">
                            Generated Image
                        </h2>
                        {imageUrl ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex-grow flex flex-col items-center justify-center"
                            >
                                <img
                                    ref={imageRef}
                                    src={imageUrl}
                                    alt="Generated"
                                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg mb-6"
                                />
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={handleDownloadImage}
                                        className="rounded-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-2 px-4 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
                                    >
                                        {downloading ? "Downloading..." : <DownloadIcon />}
                                        <span>Download</span>
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-gray-400">
                                <p className="text-lg italic">
                                    Your generated image will appear here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Home;
    


