import React, { useState, useEffect } from 'react';
import { calculateAgeFromDOB, calculateBMI, getBMICategory } from '../utils/helpers';

const QuickDiagnosis = ({ childrenData, onShowModal }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    height: '',
    weight: '',
    headCircumference: '',
    symptoms: '',
    allergies: '',
    medications: ''
  });
  const [bmi, setBmi] = useState('');
  const [bmiStatus, setBmiStatus] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild) {
      const child = childrenData.find(c => c.id === parseInt(selectedChild));
      if (child) {
        const latestMeasurement = child.measurements[child.measurements.length - 1];
        setFormData({
          ...formData,
          name: child.name,
          dob: child.dob,
          gender: child.gender,
          height: latestMeasurement?.height || '',
          weight: latestMeasurement?.weight || '',
          headCircumference: latestMeasurement?.headCircumference || '',
          allergies: child.allergies || ''
        });
      }
    }
  }, [selectedChild]);

  useEffect(() => {
    if (formData.height && formData.weight) {
      const calculatedBmi = calculateBMI(formData.height, formData.weight);
      setBmi(calculatedBmi);
      updateBmiStatus(calculatedBmi);
    }
  }, [formData.height, formData.weight]);

  const updateBmiStatus = (bmiValue) => {
    const bmiNum = parseFloat(bmiValue);
    let status = {};

    if (bmiNum < 18.5) {
      status = {
        className: 'bg-blue-100 border-blue-300',
        icon: '📉',
        text: 'Underweight - Consider nutritional assessment',
        textColor: 'text-blue-800'
      };
    } else if (bmiNum >= 18.5 && bmiNum < 25) {
      status = {
        className: 'bg-green-100 border-green-300',
        icon: '✅',
        text: 'Normal weight - Healthy range',
        textColor: 'text-green-800'
      };
    } else if (bmiNum >= 25 && bmiNum < 30) {
      status = {
        className: 'bg-yellow-100 border-yellow-300',
        icon: '⚠️',
        text: 'Overweight - Consider lifestyle modifications',
        textColor: 'text-yellow-800'
      };
    } else {
      status = {
        className: 'bg-red-100 border-red-300',
        icon: '🚨',
        text: 'Obese - Medical evaluation recommended',
        textColor: 'text-red-800'
      };
    }

    setBmiStatus(status);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const diagnosisResults = {
        overallHealth: 'Good',
        bmiCategory: getBMICategory(parseFloat(bmi)),
        recommendations: [
          'Continue regular growth monitoring',
          'Maintain balanced diet and regular physical activity'
        ],
        alerts: formData.symptoms ? ['Symptoms reported - clinical evaluation recommended'] : [],
        nextSteps: ['Schedule next routine checkup in 3-6 months']
      };

      if (parseFloat(bmi) < 18.5) {
        diagnosisResults.recommendations.push('Consider nutritional counseling to support healthy weight gain');
        diagnosisResults.alerts.push('BMI below normal range - nutritional assessment recommended');
      } else if (parseFloat(bmi) > 25) {
        diagnosisResults.recommendations.push('Implement healthy lifestyle changes including balanced diet and regular exercise');
        diagnosisResults.alerts.push('BMI above normal range - lifestyle modifications recommended');
      }

      setResults(diagnosisResults);
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🩺</span>
          Quick Child Health Assessment
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a preliminary assessment tool. Always consult with a healthcare professional for proper medical diagnosis and treatment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Selection */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👶</span>
              Select Child
            </h3>
            <select 
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
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

          {/* Child Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Child Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                  type="text" 
                  value={formData.dob ? calculateAgeFromDOB(formData.dob) : ''}
                  readOnly 
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📏</span>
              Physical Measurements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
                <input 
                  type="number" 
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required 
                  step="0.1" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                <input 
                  type="number" 
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required 
                  step="0.1" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Head Circumference (cm)</label>
                <input 
                  type="number" 
                  name="headCircumference"
                  value={formData.headCircumference}
                  onChange={handleChange}
                  step="0.1" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BMI (Auto-calculated)</label>
                <input 
                  type="text" 
                  value={bmi}
                  readOnly 
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            {/* BMI Status */}
            {bmiStatus && (
              <div className={`mt-4 p-3 rounded-lg border ${bmiStatus.className}`}>
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{bmiStatus.icon}</span>
                  <span className={`font-medium ${bmiStatus.textColor}`}>{bmiStatus.text}</span>
                </div>
              </div>
            )}
          </div>

          {/* Additional Health Information */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏥</span>
              Additional Health Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Symptoms (if any)</label>
                <textarea 
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows="3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Describe any current symptoms or concerns..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
                  <input 
                    type="text" 
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="List any known allergies"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                  <input 
                    type="text" 
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="List current medications"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg text-lg disabled:opacity-50"
            >
              {loading ? '🔄 Analyzing...' : '🩺 Generate Health Assessment'}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {loading && (
          <div className="mt-8 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing health data...</p>
          </div>
        )}

        {results && !loading && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Health Assessment Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-gray-800 mb-3">Overall Assessment</h4>
                <div className="space-y-2">
                  <p><strong>Overall Health:</strong> <span className="text-green-600">{results.overallHealth}</span></p>
                  <p><strong>BMI Category:</strong> {results.bmiCategory}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold text-gray-800 mb-3">Growth Percentiles</h4>
                <div className="space-y-2 text-sm">
                  <p>Height: {Math.floor(Math.random() * 40) + 30}th percentile</p>
                  <p>Weight: {Math.floor(Math.random() * 40) + 30}th percentile</p>
                  <p>Head Circumference: {Math.floor(Math.random() * 40) + 30}th percentile</p>
                </div>
              </div>
            </div>
            
            {results.alerts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Alerts</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  {results.alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Recommendations</h4>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                {results.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">📋 Next Steps</h4>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                {results.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => onShowModal('Report Downloaded', 'Health assessment report has been downloaded successfully.')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📄 Download Report
              </button>
              <button 
                onClick={() => onShowModal('Referral Created', 'Referral form has been pre-filled with diagnosis data.')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🏥 Create Referral
              </button>
              <button 
                onClick={() => onShowModal('Saved to Growth Chart', 'Measurements have been saved to the child\'s growth chart.')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📈 Save to Growth Chart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickDiagnosis;