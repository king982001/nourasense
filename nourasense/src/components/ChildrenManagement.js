import React, { useState } from 'react';
import { calculateAgeFromDOB, formatDate, calculateBMI } from '../utils/helpers';
import { AddChildModal, AddMeasurementModal } from './Modals';

const ChildrenManagement = ({ childrenData, setChildrenData, onShowModal }) => {
  const [addChildModalOpen, setAddChildModalOpen] = useState(false);
  const [addMeasurementModalOpen, setAddMeasurementModalOpen] = useState(false);
  const [selectedChildForMeasurement, setSelectedChildForMeasurement] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'

  const handleAddChild = (childData) => {
    const newChild = {
      id: Date.now(), // Use timestamp for unique ID
      ...childData,
      measurements: []
    };
    setChildrenData([...childrenData, newChild]);
    setAddChildModalOpen(false);
    onShowModal('Child Added', `${newChild.name} has been added successfully.`);
  };

  const handleAddMeasurement = (measurementData) => {
    const updatedChildren = childrenData.map(child => {
      if (child.id === selectedChildForMeasurement) {
        const newMeasurements = [...child.measurements, measurementData].sort((a, b) => new Date(a.date) - new Date(b.date));
        return { ...child, measurements: newMeasurements };
      }
      return child;
    });
    setChildrenData(updatedChildren);
    setAddMeasurementModalOpen(false);
    setSelectedChildForMeasurement(null);
    onShowModal('Measurement Added', 'New growth measurement has been recorded successfully.');
  };

  const openMeasurementModal = (childId) => {
    setSelectedChildForMeasurement(childId);
    setAddMeasurementModalOpen(true);
  };

  const viewChildDetails = (child) => {
    setSelectedChild(child);
    setViewMode('detail');
  };

  const deleteChild = (childId) => {
    if (window.confirm('Are you sure you want to delete this child\'s record?')) {
      setChildrenData(childrenData.filter(child => child.id !== childId));
      onShowModal('Child Deleted', 'Child record has been deleted successfully.');
    }
  };

  const deleteMeasurement = (childId, measurementIndex) => {
    if (window.confirm('Are you sure you want to delete this measurement?')) {
      const updatedChildren = childrenData.map(child => {
        if (child.id === childId) {
          const newMeasurements = child.measurements.filter((_, index) => index !== measurementIndex);
          return { ...child, measurements: newMeasurements };
        }
        return child;
      });
      setChildrenData(updatedChildren);
      onShowModal('Measurement Deleted', 'Measurement has been deleted successfully.');
    }
  };

  if (viewMode === 'detail' && selectedChild) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setViewMode('grid')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">←</span>
            Back to Children List
          </button>
          <button 
            onClick={() => openMeasurementModal(selectedChild.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Measurement
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {selectedChild.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="ml-4">
              <h2 className="text-3xl font-bold text-gray-800">{selectedChild.name}</h2>
              <p className="text-gray-600">{calculateAgeFromDOB(selectedChild.dob)} • {selectedChild.gender === 'male' ? 'Male' : 'Female'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Date of Birth:</strong> {formatDate(selectedChild.dob)}</p>
                <p><strong>Age:</strong> {calculateAgeFromDOB(selectedChild.dob)}</p>
                <p><strong>Gender:</strong> {selectedChild.gender === 'male' ? 'Male' : 'Female'}</p>
                <p><strong>Blood Type:</strong> {selectedChild.bloodType || 'Not specified'}</p>
                <p><strong>Allergies:</strong> {selectedChild.allergies || 'None known'}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Measurements</h3>
              {selectedChild.measurements.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {(() => {
                    const latest = selectedChild.measurements[selectedChild.measurements.length - 1];
                    const bmi = calculateBMI(latest.height, latest.weight);
                    return (
                      <>
                        <p><strong>Date:</strong> {formatDate(latest.date)}</p>
                        <p><strong>Height:</strong> {latest.height} cm</p>
                        <p><strong>Weight:</strong> {latest.weight} kg</p>
                        <p><strong>BMI:</strong> {bmi}</p>
                        {latest.headCircumference && (
                          <p><strong>Head Circumference:</strong> {latest.headCircumference} cm</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No measurements recorded yet</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth History</h3>
            {selectedChild.measurements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Height (cm)</th>
                      <th className="text-left py-2">Weight (kg)</th>
                      <th className="text-left py-2">BMI</th>
                      <th className="text-left py-2">Head Circ. (cm)</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChild.measurements.map((measurement, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2">{formatDate(measurement.date)}</td>
                        <td className="py-2">{measurement.height}</td>
                        <td className="py-2">{measurement.weight}</td>
                        <td className="py-2">{calculateBMI(measurement.height, measurement.weight)}</td>
                        <td className="py-2">{measurement.headCircumference || '-'}</td>
                        <td className="py-2">
                          <button 
                            onClick={() => deleteMeasurement(selectedChild.id, index)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No measurements recorded yet. Add the first measurement to start tracking growth.</p>
            )}
          </div>

          {selectedChild.notes && (
            <div className="bg-yellow-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical Notes</h3>
              <p className="text-sm text-gray-700">{selectedChild.notes}</p>
            </div>
          )}
        </div>

        <AddMeasurementModal 
          isOpen={addMeasurementModalOpen}
          onClose={() => setAddMeasurementModalOpen(false)}
          onSubmit={handleAddMeasurement}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Children</h2>
          <p className="text-gray-600">Manage and monitor multiple children's health records</p>
        </div>
        <button 
          onClick={() => setAddChildModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
        >
          + Add New Child
        </button>
      </div>

      {childrenData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-gray-400">👶</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Children Added Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first child to begin tracking their health and growth.</p>
          <button 
            onClick={() => setAddChildModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childrenData.map(child => {
            const age = calculateAgeFromDOB(child.dob);
            const latestMeasurement = child.measurements[child.measurements.length - 1];
            
            return (
              <div key={child.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {child.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">{child.name}</h3>
                      <p className="text-sm text-gray-600">{age} • {child.gender === 'male' ? 'Male' : 'Female'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteChild(child.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>DOB:</strong> {formatDate(child.dob)}</p>
                  <p><strong>Blood Type:</strong> {child.bloodType || 'Not specified'}</p>
                  {latestMeasurement && (
                    <>
                      <p><strong>Latest Height:</strong> {latestMeasurement.height}cm</p>
                      <p><strong>Latest Weight:</strong> {latestMeasurement.weight}kg</p>
                      <p><strong>BMI:</strong> {calculateBMI(latestMeasurement.height, latestMeasurement.weight)}</p>
                    </>
                  )}
                  {child.allergies && <p><strong>Allergies:</strong> {child.allergies}</p>}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => viewChildDetails(child)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => openMeasurementModal(child.id)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    + Measurement
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Child Modal */}
      <AddChildModal 
        isOpen={addChildModalOpen}
        onClose={() => setAddChildModalOpen(false)}
        onSubmit={handleAddChild}
      />

      {/* Add Measurement Modal */}
      <AddMeasurementModal 
        isOpen={addMeasurementModalOpen}
        onClose={() => setAddMeasurementModalOpen(false)}
        onSubmit={handleAddMeasurement}
      />
    </div>
  );
};

export default ChildrenManagement;