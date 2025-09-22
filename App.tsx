import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { analyzeDamageAndHighlight, generateDescriptionFromImage } from './services/geminiService';
import type { DamageReport, FormState } from './types';
import { useAuth } from './Auth';

const App: React.FC = () => {
  const { user } = useAuth();

  const [formState, setFormState] = useState<FormState>({
    description: "", // Start with an empty description
    location: "City Mall Parking, Level 2",
    accidentType: "Low-speed collision",
    impactSpeed: "10",
    brakingInfo: "Hard braking",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [damageReport, setDamageReport] = useState<DamageReport | null>(null);
  const [highlightedImage, setHighlightedImage] = useState<string | null>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Reset description when image changes
      setFormState(prevState => ({ ...prevState, description: "" }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGenerateDescription = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    setIsGeneratingDescription(true);
    setError(null);
    try {
      const generatedText = await generateDescriptionFromImage(imageFile);
      setFormState(prevState => ({...prevState, description: generatedText}));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to generate description.");
    } finally {
      setIsGeneratingDescription(false);
    }
  }, [imageFile]);

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !formState.description) {
      setError("Please upload an image and provide or generate a damage description.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDamageReport(null);
    setHighlightedImage(null);
    setFraudAnalysis(null);

    try {
      const { report, highlightedImg, fraudCheck } = await analyzeDamageAndHighlight(imageFile, formState);
      setDamageReport(report);
      setHighlightedImage(highlightedImg);
      setFraudAnalysis(fraudCheck);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, formState]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <InputForm
              formState={formState}
              imagePreview={imagePreview}
              onFormChange={handleFormChange}
              onImageChange={handleImageChange}
              onGenerateDescription={handleGenerateDescription}
              isGeneratingDescription={isGeneratingDescription}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-8">
            <ResultsDisplay
              damageReport={damageReport}
              originalImage={imagePreview}
              highlightedImage={highlightedImage}
              fraudAnalysis={fraudAnalysis}
              isLoading={isLoading}
              error={error}
              userRole={user?.role}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;