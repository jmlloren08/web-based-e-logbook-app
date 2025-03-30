
import React from "react";

export default function Offline() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4">You're Offline</h1>
                <p className="text-gray-600">Please check your internet connection and try again.</p>
            </div>
        </div>
    );
}