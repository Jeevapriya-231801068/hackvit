import type { FormState, DamageReport } from '../types';

/**
 * Sends an image to the backend to generate a text description.
 * @param imageFile The image file to analyze.
 * @returns A promise that resolves to the AI-generated description string.
 */
export const generateDescriptionFromImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/api/generate-description', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate description from server.');
  }

  return data.description;
};

/**
 * Sends the image and all form data to the backend for a full analysis.
 * @param imageFile The image file of the damage.
 * @param formState The current state of the claim details form.
 * @returns A promise that resolves to the complete analysis object containing the report, highlighted image, and fraud check.
 */
export const analyzeDamageAndHighlight = async (imageFile: File, formState: FormState) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  // Append all formState fields to the FormData to be sent to the backend.
  Object.entries(formState).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Analysis failed on the server.');
  }

  // The backend is expected to return an object with the same shape as before.
  return {
    report: data.report as DamageReport,
    highlightedImg: data.highlightedImg as string,
    fraudCheck: data.fraudCheck as string,
  };
};
