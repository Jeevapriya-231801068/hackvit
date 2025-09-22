import React from 'react';
import type { FormState } from '../types';
import { UploadIcon, WrenchScrewdriverIcon, MapPinIcon, BoltIcon, DocumentTextIcon, SparklesIcon } from './icons';

interface InputFormProps {
  formState: FormState;
  imagePreview: string | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateDescription: () => void;
  isGeneratingDescription: boolean;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  formState,
  imagePreview,
  onFormChange,
  onImageChange,
  onGenerateDescription,
  isGeneratingDescription,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-gray-700 border-b pb-2">Claim Details</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">1. Upload Damage Photo</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Damage preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
            ) : (
              <>
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
              </>
            )}
            <div className="flex text-sm text-gray-600 justify-center pt-2">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={onImageChange} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {imagePreview && (
         <button
            onClick={onGenerateDescription}
            disabled={isGeneratingDescription || !!formState.description}
            className="w-full flex justify-center items-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <SparklesIcon className={`h-5 w-5 mr-2 ${isGeneratingDescription ? 'animate-pulse' : ''}`}/>
            {isGeneratingDescription ? 'Generating...' : 'Generate AI Description'}
          </button>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">2. Damage Description</label>
        <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute top-3.5 left-0 flex items-center pl-3">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="block w-full min-h-[105px] rounded-md border border-gray-300 bg-gray-50 py-3 px-4 pl-10 text-sm text-gray-700">
            {isGeneratingDescription ? (
                <span className="italic text-gray-500">AI is writing a description...</span>
            ) : formState.description ? (
                <p>{formState.description}</p>
            ) : (
                <span className="text-gray-500">Click the "Generate AI Description" button above. The description will appear here and cannot be edited.</span>
            )}
            </div>
        </div>
      </div>


      <InputGroup 
        label="3. Accident Details"
        name="accidentType"
        value={formState.accidentType}
        onChange={onFormChange}
        placeholder="e.g., Rear-end collision"
        icon={<WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />}
      />

      <InputGroup
        name="location"
        value={formState.location}
        onChange={onFormChange}
        placeholder="e.g., Main St & 1st Ave"
        icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputGroup
            label="Impact Speed (km/h)"
            name="impactSpeed"
            type="number"
            value={formState.impactSpeed}
            onChange={onFormChange}
            icon={<BoltIcon className="h-5 w-5 text-gray-400" />}
        />
        <InputGroup
            label="Braking Info"
            name="brakingInfo"
            value={formState.brakingInfo}
            onChange={onFormChange}
            placeholder="e.g., Sudden stop"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || !imagePreview || !formState.description}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Run Assessment'}
      </button>
    </div>
  );
};


interface InputGroupProps {
    label?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    as?: 'input' | 'textarea';
    rows?: number;
    icon?: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, placeholder, type = 'text', as = 'input', rows, icon }) => {
    const commonProps = {
        name,
        id: name,
        value,
        onChange,
        placeholder,
        className: `block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${icon ? 'pl-10' : ''}`
    };

    return (
        <div>
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>}
            <div className="relative rounded-md shadow-sm">
                {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
                {as === 'textarea' ? (
                    <textarea {...commonProps} rows={rows}></textarea>
                ) : (
                    <input type={type} {...commonProps} />
                )}
            </div>
        </div>
    );
};