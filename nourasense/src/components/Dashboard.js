import React from 'react';
import { calculateAgeFromDOB, calculateBMI, formatDate } from '../utils/helpers';

const Dashboard = ({ currentUserRole, childrenData, onPageChange }) => {
  // Calculate dashboard statistics
  const totalChildren = childrenData.length;
  const childrenWithRecentMeasurements = childrenData.filter(child => {
    if (child.measurements.length === 0) return false;
    const lastMeasurement = new Date(child.measurements[child.measurements.length - 1].date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastMeasurement > threeMonthsAgo;
  }).length;

  const childrenNeedingAttention = childrenData.filter(child => {
    if (child.measurements.length === 0) return true;
    const latest = child.measurements[child.measurements.length - 1];
    const bmi = parseFloat(calculateBMI(latest.height, latest.weight));
    return bmi < 18.5 || bmi > 25;
  }).length;

  const upcomingCheckups = Math.floor(Math.random() * 5) + 2; // Simulated data

  const StatCard = ({ title, value, icon, color, description, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 ${color}`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  const RecentActivityItem = ({ child, activity, date, type }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'measurement': return '📏';
        case 'checkup': return '🩺';
        case 'vaccination': return '💉';
        case 'referral': return '📋';
        default: return '📝';
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'measurement': return 'text-blue-600';
        case 'checkup': return 'text-green-600';
        case 'vaccination': return 'text-purple-600';
        case 'referral': return 'text-orange-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className={`text-2xl ${getActivityColor(type)}`}>
          {getActivityIcon(type)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{child}</p>
          <p className="text-xs text-gray-600">{activity}</p>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(date)}
        </div>
      </div>
    );
  };

  // Generate recent activities from children data
  const recentActivities = childrenData.flatMap(child => 
    child.measurements.slice(-2).map(measurement => ({
      child: child.name,
      activity: `Height: ${measurement.height}cm, Weight: ${measurement.weight}kg`,
      date: measurement.date,
      type: 'measurement'
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {currentUserRole === 'parent' ? 'Parent' : 'Dr. Smith'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {currentUserRole === 'parent' 
                  ? `You're managing ${totalChildren} ${totalChildren === 1 ? 'child' : 'children'}'s health records`
                  : `You have ${totalChildren} patients in your care today`
                }
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl opacity-20">
                {currentUserRole === 'parent' ? '👨‍👩‍👧‍👦' : '👨‍⚕️'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={currentUserRole === 'parent' ? 'My Children' : 'Total Patients'}
          value={totalChildren}
          icon="👶"
          color="border-blue-500"
          description={`${childrenWithRecentMeasurements} with recent measurements`}
          onClick={() => onPageChange('children')}
        />
        <StatCard
          title="Recent Measurements"
          value={childrenWithRecentMeasurements}
          icon="📏"
          color="border-green-500"
          description="Within last 3 months"
          onClick={() => onPageChange('growth-charts')}
        />
        <StatCard
          title="Need Attention"
          value={childrenNeedingAttention}
          icon="⚠️"
          color="border-orange-500"
          description="BMI outside normal range"
          onClick={() => onPageChange('quick-diagnosis')}
        />
        <StatCard
          title="Upcoming Checkups"
          value={upcomingCheckups}
          icon="📅"
          color="border-purple-500"
          description="Next 30 days"
          onClick={() => onPageChange('appointments')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Add Measurement"
              description="Record new height, weight, or head circumference"
              icon="📏"
              color="border-blue-500"
              onClick={() => onPageChange('children')}
            />
            <QuickActionCard
              title="Quick Diagnosis"
              description="Get instant health assessment and recommendations"
              icon="🩺"
              color="border-green-500"
              onClick={() => onPageChange('quick-diagnosis')}
            />
            <QuickActionCard
              title="View Growth Charts"
              description="Track growth patterns with WHO standards"
              icon="📈"
              color="border-purple-500"
              onClick={() => onPageChange('growth-charts')}
            />
            <QuickActionCard
              title="Create Referral"
              description="Refer to specialists with detailed medical history"
              icon="📋"
              color="border-orange-500"
              onClick={() => onPageChange('referrals')}
            />
            <QuickActionCard
              title="Schedule Appointment"
              description="Book checkups and follow-up visits"
              icon="📅"
              color="border-pink-500"
              onClick={() => onPageChange('appointments')}
            />
            <QuickActionCard
              title="Find Providers"
              description="Locate nearby pediatric healthcare providers"
              icon="📍"
              color="border-indigo-500"
              onClick={() => onPageChange('providers')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.map((activity, index) => (
                  <RecentActivityItem
                    key={index}
                    child={activity.child}
                    activity={activity.activity}
                    date={activity.date}
                    type={activity.type}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl text-gray-300 mb-4">📝</div>
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start by adding measurements or scheduling appointments
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children Overview */}
      {childrenData.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentUserRole === 'parent' ? 'My Children' : 'Patient'} Overview
            </h2>
            <button 
              onClick={() => onPageChange('children')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childrenData.slice(0, 3).map(child => {
              const age = calculateAgeFromDOB(child.dob);
              const latestMeasurement = child.measurements[child.measurements.length - 1];
              const bmi = latestMeasurement ? calculateBMI(latestMeasurement.height, latestMeasurement.weight) : null;
              
              return (
                <div key={child.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {child.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">{child.name}</h3>
                      <p className="text-sm text-gray-600">{age} • {child.gender === 'male' ? 'Male' : 'Female'}</p>
                    </div>
                  </div>
                  
                  {latestMeasurement ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">{latestMeasurement.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{latestMeasurement.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BMI:</span>
                        <span className={`font-medium ${
                          parseFloat(bmi) < 18.5 ? 'text-blue-600' :
                          parseFloat(bmi) > 25 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {bmi}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(latestMeasurement.date)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No measurements yet</p>
                      <button 
                        onClick={() => onPageChange('children')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                      >
                        Add First Measurement
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State for No Children */}
      {childrenData.length === 0 && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">👶</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {currentUserRole === 'parent' ? 'No Children Added Yet' : 'No Patients Assigned'}
            </h3>
            <p className="text-gray-600 mb-6">
              {currentUserRole === 'parent' 
                ? 'Start by adding your first child to begin tracking their health and growth.'
                : 'Patients will appear here once they are assigned to your care.'
              }
            </p>
            <button 
              onClick={() => onPageChange('children')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentUserRole === 'parent' ? 'Add Your First Child' : 'Manage Patients'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;