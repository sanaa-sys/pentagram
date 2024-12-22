'use client'

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Please fill in both email and password fields.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            console.log("Starting signup process...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User created successfully:", userCredential.user.uid);
            router.push("/");
        } catch (error) {
            console.error("Signup error:", error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError("This email address is already registered. Please try logging in instead.");
                    break;
                case 'auth/invalid-email':
                    setError("Please enter a valid email address.");
                    break;
                case 'auth/operation-not-allowed':
                    setError("Email/password accounts are not enabled. Please contact support.");
                    break;
                case 'auth/weak-password':
                    setError("Please choose a stronger password (at least 6 characters).");
                    break;
                default:
                    setError(`Failed to create account: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen bg-gradient-to-r from-blue-200 to-purple-300">
            <motion.div
                className="flex items-center justify-center min-h-screen"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
            >
                <img src="/logo1.png" alt="Logo" className="rounded-full" />
            </motion.div>
            <motion.div
                className="flex items-center justify-center py-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
            >
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-xl font-bold">Welcome to AI Image Generator</h1>
                        <h1 className="text-xl font-bold">Sign Up</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to create an account
                        </p>
                    </div>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSignup} className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <motion.input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password">Password</label>
                            <motion.input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <p className="text-sm text-gray-500">Password must be at least 6 characters long</p>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

