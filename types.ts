export interface DamagedPart {
  partName: string;
  severity: string;
  estimatedCost: number;
  reasoning: string;
}

export interface DamageReport {
  overallSeverity: string;
  totalEstimatedCost: number;
  damagedParts: DamagedPart[];
}

export interface FormState {
  description: string;
  location: string;
  accidentType: string;
  impactSpeed: string;
  brakingInfo: string;
}

export interface User {
  id: number;
  username: string;
  role: 'adjuster' | 'manager';
}
