import React from 'react';

const NotFound = () => {
    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg w-96 lg:w-2/6">
                <h1 className="text-7xl font-extrabold text-red-600">404</h1>
                <p className="mt-4 text-xl text-gray-700">Oops! The page you're looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFound;
