import React from 'react';

const Appointments = ({ onShowModal }) => (
  <div className="max-w-6xl mx-auto px-6 py-8">
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">📅</span>
        Appointment Management
      </h2>
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Appointment management features coming soon!</p>
        <button 
          onClick={() => onShowModal('Feature Coming Soon', 'Appointment scheduling will be available in the next update.')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Schedule Appointment
        </button>
      </div>
    </div>
  </div>
);
export default Appointments;
