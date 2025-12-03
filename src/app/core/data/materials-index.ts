export interface MaterialIndex {
  id: string;
  name: string;
  rarity: number;
  category: 'exp' | 'denny' | 'ascension' | 'skill' | 'core' | 'chip' | 'other';
  description?: string;
}

export const MATERIAL_INDEX: MaterialIndex[] = [
  // Currency
  { id: '1', name: 'Dennies', rarity: 1, category: 'denny', description: 'Standard currency' },
  
  // EXP Materials
  { id: '110001', name: 'Basic Investigator Log', rarity: 2, category: 'exp', description: 'Provides 1000 EXP' },
  { id: '110002', name: 'Advanced Investigator Log', rarity: 3, category: 'exp', description: 'Provides 5000 EXP' },
  { id: '110003', name: 'Expert Investigator Log', rarity: 4, category: 'exp', description: 'Provides 10000 EXP' },
  
  // Certification Seals (Character Ascension)
  { id: '110011', name: 'Certification Seal - B', rarity: 2, category: 'ascension' },
  { id: '110012', name: 'Certification Seal - A', rarity: 3, category: 'ascension' },
  { id: '110013', name: 'Certification Seal - S', rarity: 4, category: 'ascension' },
  
  // Hamster Cage Pass (Core Skill Materials)
  { id: '110021', name: 'Basic Hamster Cage Pass', rarity: 2, category: 'core' },
  { id: '110022', name: 'Advanced Hamster Cage Pass', rarity: 3, category: 'core' },
  { id: '110023', name: 'Expert Hamster Cage Pass', rarity: 4, category: 'core' },
  
  // Skill Materials - Generic
  { id: '110101', name: 'Basic Combat Analysis', rarity: 2, category: 'skill' },
  { id: '110102', name: 'Advanced Combat Analysis', rarity: 3, category: 'skill' },
  { id: '110103', name: 'Specialized Combat Analysis', rarity: 4, category: 'skill' },
  
  // W-Engine Chips
  { id: '111001', name: 'Basic W-Engine Chip', rarity: 2, category: 'chip' },
  { id: '111002', name: 'Advanced W-Engine Chip', rarity: 3, category: 'chip' },
  { id: '111003', name: 'Specialized W-Engine Chip', rarity: 4, category: 'chip' },
  
  // Weekly Boss Materials
  { id: '120001', name: 'Ferocious Grip', rarity: 4, category: 'skill', description: 'Weekly boss material' },
  { id: '120002', name: "Murderer's Knife", rarity: 4, category: 'skill', description: 'Weekly boss material' },
  { id: '120003', name: 'Ethereal Pursuit', rarity: 4, category: 'skill', description: 'Weekly boss material' },
  { id: '120004', name: 'Living Drive', rarity: 4, category: 'skill', description: 'Weekly boss material' },
  { id: '120005', name: 'Finale Dance Shoes', rarity: 4, category: 'skill', description: 'Weekly boss material' },
  
  // Faction-Specific Ascension Materials
  
  // Cunning Hares
  { id: '130101', name: 'Cunning Hares: Basic Badge', rarity: 2, category: 'ascension' },
  { id: '130102', name: 'Cunning Hares: Advanced Badge', rarity: 3, category: 'ascension' },
  { id: '130103', name: 'Cunning Hares: Specialized Badge', rarity: 4, category: 'ascension' },
  
  // Victoria Housekeeping Co.
  { id: '130201', name: 'Victoria Housekeeping: Basic Seal', rarity: 2, category: 'ascension' },
  { id: '130202', name: 'Victoria Housekeeping: Advanced Seal', rarity: 3, category: 'ascension' },
  { id: '130203', name: 'Victoria Housekeeping: Specialized Seal', rarity: 4, category: 'ascension' },
  
  // Belobog Heavy Industries
  { id: '130301', name: 'Belobog: Basic Emblem', rarity: 2, category: 'ascension' },
  { id: '130302', name: 'Belobog: Advanced Emblem', rarity: 3, category: 'ascension' },
  { id: '130303', name: 'Belobog: Specialized Emblem', rarity: 4, category: 'ascension' },
  
  // Section 6
  { id: '130401', name: 'Section 6: Basic Insignia', rarity: 2, category: 'ascension' },
  { id: '130402', name: 'Section 6: Advanced Insignia', rarity: 3, category: 'ascension' },
  { id: '130403', name: 'Section 6: Specialized Insignia', rarity: 4, category: 'ascension' },
  
  // Criminal Investigation Special Response Team
  { id: '130501', name: 'CISRT: Basic Certificate', rarity: 2, category: 'ascension' },
  { id: '130502', name: 'CISRT: Advanced Certificate', rarity: 3, category: 'ascension' },
  { id: '130503', name: 'CISRT: Specialized Certificate', rarity: 4, category: 'ascension' },
  
  // Sons of Calydon
  { id: '130601', name: 'Sons of Calydon: Basic Medal', rarity: 2, category: 'ascension' },
  { id: '130602', name: 'Sons of Calydon: Advanced Medal', rarity: 3, category: 'ascension' },
  { id: '130603', name: 'Sons of Calydon: Specialized Medal', rarity: 4, category: 'ascension' },
  
  // Obol Squad
  { id: '130701', name: 'Obol Squad: Basic Marker', rarity: 2, category: 'ascension' },
  { id: '130702', name: 'Obol Squad: Advanced Marker', rarity: 3, category: 'ascension' },
  { id: '130703', name: 'Obol Squad: Specialized Marker', rarity: 4, category: 'ascension' },
];

export function getMaterialById(id: string): MaterialIndex | undefined {
  return MATERIAL_INDEX.find(mat => mat.id === id);
}

export function getMaterialsByCategory(category: MaterialIndex['category']): MaterialIndex[] {
  return MATERIAL_INDEX.filter(mat => mat.category === category);
}

export function getMaterialsByRarity(rarity: number): MaterialIndex[] {
  return MATERIAL_INDEX.filter(mat => mat.rarity === rarity);
}
