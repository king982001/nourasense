import React from 'react';

const FindProviders = ({ onShowModal }) => (
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">📍</span>
        Find Nearby Providers
      </h2>
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Provider directory features coming soon!</p>
        <button 
          onClick={() => onShowModal('Feature Coming Soon', 'Provider search will be available in the next update.')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search Providers
        </button>
      </div>
    </div>
  </div>
);

export default FindProviders;