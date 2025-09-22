import React from 'react';
import type { DamageReport } from '../types';
import { Spinner } from './Spinner';
import { ShieldExclamationIcon, CheckCircleIcon, CurrencyDollarIcon, PhotoIcon, QuestionMarkCircleIcon } from './icons';

interface ResultsDisplayProps {
  damageReport: DamageReport | null;
  originalImage: string | null;
  highlightedImage: string | null;
  fraudAnalysis: string | null;
  isLoading: boolean;
  error: string | null;
  userRole?: 'adjuster' | 'manager';
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  damageReport,
  originalImage,
  highlightedImage,
  isLoading,
  error,
  fraudAnalysis,
  userRole
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }
  
  if (!damageReport || !originalImage) {
    return <InitialState />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-8 animate-fade-in">
      {/* Visual Analysis Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><PhotoIcon className="h-6 w-6 mr-2 text-blue-600"/>Visual Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageCard title="Original Photo" src={originalImage} />
          <ImageCard title="AI-Highlighted Damage" src={highlightedImage} />
        </div>
      </section>

      {/* Cost & Severity Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryCard 
                icon={<ShieldExclamationIcon className="h-8 w-8 text-red-500" />}
                title="Overall Severity"
                value={damageReport.overallSeverity}
                color="text-red-600"
            />
            <SummaryCard 
                icon={<CurrencyDollarIcon className="h-8 w-8 text-green-500" />}
                title="Total Estimated Cost"
                value={`$${damageReport.totalEstimatedCost.toLocaleString()}`}
                color="text-green-600"
            />
        </div>
      </section>

      {/* Itemized Report Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Itemized Damage Report</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Estimate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Reasoning</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {damageReport.damagedParts.map((part, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{part.partName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{part.severity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${part.estimatedCost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[300px]">{part.reasoning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Fraud Analysis Section */}
      {userRole === 'manager' && fraudAnalysis && (
        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><CheckCircleIcon className="h-6 w-6 mr-2 text-indigo-600"/>Fraud & Tampering Check</h2>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-lg">
            <p className="text-sm">{fraudAnalysis}</p>
          </div>
        </section>
      )}

    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white p-6 rounded-lg shadow-lg text-center">
    <Spinner />
    <h3 className="text-lg font-semibold text-gray-700 mt-4">Running AI Analysis...</h3>
    <p className="text-sm text-gray-500 mt-2">Please wait a moment while we assess the damage, estimate costs, and check for anomalies.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white p-6 rounded-lg shadow-lg text-center">
    <ShieldExclamationIcon className="h-16 w-16 text-red-400" />
    <h3 className="text-lg font-semibold text-red-700 mt-4">Analysis Failed</h3>
    <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md mt-2">{message}</p>
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white p-6 rounded-lg shadow-lg text-center border-2 border-dashed border-gray-300">
    <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400" />
    <h3 className="text-lg font-semibold text-gray-700 mt-4">Ready for Assessment</h3>
    <p className="text-sm text-gray-500 mt-2 max-w-sm">Upload a photo of the vehicle damage and fill in the claim details to start the AI-powered analysis.</p>
  </div>
);

const ImageCard: React.FC<{ title: string, src: string | null }> = ({ title, src }) => (
    <div className="border rounded-lg p-2 bg-gray-50">
        <h3 className="text-sm font-medium text-center text-gray-600 mb-2">{title}</h3>
        {src ? (
          <img src={src} alt={title} className="w-full h-64 object-contain rounded" />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
    </div>
);


const SummaryCard: React.FC<{ icon: React.ReactNode, title: string, value: string, color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 border">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);
