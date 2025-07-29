import React, { useState } from 'react';
import { calculateAgeFromDOB } from '../utils/helpers';
import { specialties } from '../utils/constants';

const Referrals = ({ childrenData, onShowModal }) => {
  const [formData, setFormData] = useState({
    childId: '',
    patientID: '',
    specialty: '',
    urgency: '',
    chiefComplaint: '',
    clinicalHistory: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onShowModal('Referral Submitted', 'Your referral has been submitted successfully and will be processed within 24 hours.');
    setFormData({
      childId: '',
      patientID: '',
      specialty: '',
      urgency: '',
      chiefComplaint: '',
      clinicalHistory: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'childId' && value) {
      setFormData(prev => ({ 
        ...prev, 
        patientID: `MRN-${value.padStart(6, '0')}` 
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Create New Referral
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Selection */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👶</span>
              Select Patient
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Choose Child *</label>
                <select 
                  name="childId"
                  value={formData.childId}
                  onChange={handleChange}
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a child</option>
                  {childrenData.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.name} ({calculateAgeFromDOB(child.dob)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID/MRN</label>
                <input 
                  type="text" 
                  name="patientID"
                  value={formData.patientID}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Medical Details */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏥</span>
              Medical Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty Required *</label>
                  <select 
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level *</label>
                  <select 
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select urgency</option>
                    <option value="routine">Routine (2-4 weeks)</option>
                    <option value="urgent">Urgent (1-2 weeks)</option>
                    <option value="stat">STAT (24-48 hours)</option>
                    <option value="emergency">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint *</label>
                <textarea 
                  name="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={handleChange}
                  required 
                  rows="3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Describe the primary reason for this referral..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical History</label>
                <textarea 
                  name="clinicalHistory"
                  value={formData.clinicalHistory}
                  onChange={handleChange}
                  rows="4" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Include relevant medical history, medications, allergies..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={() => onShowModal('Draft Saved', 'Your referral has been saved as a draft.')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg"
            >
              Submit Referral
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Referrals;