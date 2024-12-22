import { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function ImageCard({ id, imageData, prompt, likes, comments, userId, createdAt }) {
    const [user] = useAuthState(auth);
    const [newComment, setNewComment] = useState('');

    const handleLike = async () => {
        if (!user) return;
        const imageRef = doc(db, 'images', id);
        if (likes.includes(user.uid)) {
            await updateDoc(imageRef, {
                likes: arrayRemove(user.uid),
            });
        } else {
            await updateDoc(imageRef, {
                likes: arrayUnion(user.uid),
            });
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        const imageRef = doc(db, 'images', id);
        await updateDoc(imageRef, {
            comments: arrayUnion({ userId: user.uid, text: newComment.trim() }),
        });
        setNewComment('');
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/image/${id}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Image link copied to clipboard!');
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={`data:image/png;base64,${imageData}`} alt={prompt} className="w-full h-64 object-cover" />
            <div className="p-4">
                <p className="text-gray-700 mb-2">{prompt}</p>
                <p className="text-sm text-gray-500 mb-4">Created on: {new Date(createdAt).toLocaleString()}</p>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handleLike} className="text-blue-500 hover:text-blue-600">
                        {likes.includes(user?.uid || '') ? 'Unlike' : 'Like'} ({likes.length})
                    </button>
                    <button onClick={handleShare} className="text-green-500 hover:text-green-600">
                        Share
                    </button>
                </div>
                <div className="mb-4">
                    <h4 className="font-bold mb-2">Comments</h4>
                    {comments.map((comment, index) => (
                        <p key={index} className="text-gray-600 mb-1">
                            {comment.text}
                        </p>
                    ))}
                </div>
                <form onSubmit={handleComment} className="flex">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow mr-2 p-2 border rounded"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}
