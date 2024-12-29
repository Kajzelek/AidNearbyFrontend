import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, adApplicationId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        onSubmit({ rating, comment });
        setRating(0);
        setComment("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Wystaw opinię</h2>
                <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer text-2xl ${
                                star <= rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <textarea
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Dodaj komentarz..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Anuluj
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        Wyślij
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
