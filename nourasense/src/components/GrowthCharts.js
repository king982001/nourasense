import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { calculateAgeFromDOB, calculateBMI } from '../utils/helpers';
import { whoGrowthStandards } from '../utils/constants';

// Register Chart.js components
Chart.register(...registerables);

const GrowthCharts = ({ childrenData, onShowModal }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [chartType, setChartType] = useState('height');
  const [ageRange, setAgeRange] = useState('0-2');
  const [showPercentiles, setShowPercentiles] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (selectedChild && chartRef.current) {
      updateChart();
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedChild, chartType, ageRange, showPercentiles]);

  const updateChart = () => {
    const child = childrenData.find(c => c.id === parseInt(selectedChild));
    if (!child || !child.measurements.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    const measurements = child.measurements.map(m => ({
      x: new Date(m.date),
      y: chartType === 'height' ? m.height : 
         chartType === 'weight' ? m.weight :
         chartType === 'head' ? m.headCircumference :
         parseFloat(calculateBMI(m.height, m.weight))
    })).filter(m => m.y !== undefined && m.y !== null);

    const datasets = [{
      label: `${child.name}'s ${getChartLabel(chartType)}`,
      data: measurements,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
      fill: false
    }];

    // Add WHO percentile lines if enabled
    if (showPercentiles && whoGrowthStandards[child.gender] && whoGrowthStandards[child.gender][chartType]) {
      const percentileData = whoGrowthStandards[child.gender][chartType][ageRange];
      if (percentileData) {
        const percentileColors = {
          p3: 'rgba(239, 68, 68, 0.6)',
          p10: 'rgba(245, 101, 101, 0.6)',
          p25: 'rgba(251, 146, 60, 0.6)',
          p50: 'rgba(34, 197, 94, 0.8)',
          p75: 'rgba(251, 146, 60, 0.6)',
          p90: 'rgba(245, 101, 101, 0.6)',
          p97: 'rgba(239, 68, 68, 0.6)'
        };

        Object.entries(percentileData).forEach(([percentile, values]) => {
          const percentilePoints = values.map((value, index) => ({
            x: new Date(2024, index * 6, 1), // Sample dates
            y: value
          }));

          datasets.push({
            label: `${percentile.toUpperCase()} Percentile`,
            data: percentilePoints,
            borderColor: percentileColors[percentile],
            backgroundColor: 'transparent',
            borderWidth: percentile === 'p50' ? 2 : 1,
            borderDash: percentile === 'p50' ? [] : [5, 5],
            pointRadius: 0,
            fill: false,
            tension: 0.4
          });
        });
      }
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            type: 'time',
            time: { 
              unit: 'month',
              displayFormats: {
                month: 'MMM yyyy'
              }
            },
            title: { 
              display: true, 
              text: 'Date',
              font: { size: 14, weight: 'bold' }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            title: { 
              display: true, 
              text: getChartLabel(chartType),
              font: { size: 14, weight: 'bold' }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${child.name}'s ${getChartLabel(chartType)} Chart`,
            font: { size: 18, weight: 'bold' },
            padding: 20
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              filter: function(legendItem, chartData) {
                // Show main data line and 50th percentile prominently
                return legendItem.text.includes(child.name) || legendItem.text.includes('P50');
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true
          }
        },
        elements: {
          line: {
            tension: 0.4
          }
        }
      }
    });
  };

  const getChartLabel = (type) => {
    const labels = {
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      bmi: 'BMI (kg/m²)',
      head: 'Head Circumference (cm)'
    };
    return labels[type] || 'Measurement';
  };

  const exportChart = () => {
    if (chartInstance.current) {
      const link = document.createElement('a');
      link.download = `${selectedChild ? childrenData.find(c => c.id === parseInt(selectedChild))?.name : 'child'}-growth-chart.png`;
      link.href = chartInstance.current.toBase64Image();
      link.click();
      onShowModal('Chart Exported', 'Growth chart has been downloaded as an image.');
    } else {
      onShowModal('No Chart Available', 'Please select a child and generate a chart first.');
    }
  };

  const generateReport = () => {
    if (!selectedChild) {
      onShowModal('No Child Selected', 'Please select a child to generate a report.');
      return;
    }
    
    const child = childrenData.find(c => c.id === parseInt(selectedChild));
    if (!child || !child.measurements.length) {
      onShowModal('No Data Available', 'Selected child has no measurements to generate a report.');
      return;
    }

    // Simulate report generation
    setTimeout(() => {
      onShowModal('Report Generated', `Growth report for ${child.name} has been generated and downloaded.`);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">WHO Growth Charts</h2>
        <p className="text-gray-600">Track your child's growth according to World Health Organization standards</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="height">Height-for-Age</option>
              <option value="weight">Weight-for-Age</option>
              <option value="bmi">BMI-for-Age</option>
              <option value="head">Head Circumference-for-Age</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <select 
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="0-2">0-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-19">5-19 years</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input 
                type="checkbox"
                checked={showPercentiles}
                onChange={(e) => setShowPercentiles(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show WHO Percentiles</span>
            </label>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Growth Chart</h3>
          <div className="flex space-x-3">
            <button 
              onClick={generateReport}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              📋 Generate Report
            </button>
            <button 
              onClick={exportChart}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              📊 Export Chart
            </button>
          </div>
        </div>
        
        {selectedChild ? (
          <div className="relative h-96">
            <canvas ref={chartRef}></canvas>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📈</span>
              </div>
              <p className="text-gray-500">Select a child to view their growth chart</p>
            </div>
          </div>
        )}
      </div>

      {/* WHO Standards Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            WHO Growth Standards
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
              <span><strong>3rd percentile:</strong> Below normal range - medical evaluation recommended</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-orange-500 mr-2"></div>
              <span><strong>10th-25th percentile:</strong> Lower normal range</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
              <span><strong>25th-75th percentile:</strong> Normal range</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-orange-500 mr-2"></div>
              <span><strong>75th-90th percentile:</strong> Upper normal range</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
              <span><strong>97th percentile:</strong> Above normal range - medical evaluation recommended</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Chart Interpretation Tips
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Consistent growth pattern</strong> is more important than absolute percentile</p>
            <p>• <strong>Sudden changes</strong> in growth pattern may indicate health issues</p>
            <p>• <strong>Multiple measurements</strong> over time provide better assessment</p>
            <p>• <strong>Consider family history</strong> and genetic factors</p>
            <p>• <strong>Consult healthcare provider</strong> for concerning patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthCharts;