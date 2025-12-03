export interface Agent {
  Id: number;
  Icon: string;
  Name: string;
  CodeName: string;
  Rarity: number;  // 4 = A-rank, 5 = S-rank
  WeaponType: Record<string, string>;      // e.g., { "2": "Stun" }
  ElementType: Record<string, string>;     // e.g., { "203": "Electric" }
  HitType: Record<string, string>;         // e.g., { "103": "Pierce" }
  Camp: Record<string, string>;            // e.g., { "5": "New Eridu Defense Force" }
  Gender: number;
  PartnerInfo: PartnerInfo;
  Stats: AgentStats;
  Level: Record<string, LevelData>;        // Promotion levels 1-6
  ExtraLevel: Record<string, ExtraLevelData>;
  LevelEXP: number[];                      // EXP required per level
  Skill: AgentSkills;
  Passive: AgentPassive;
  Talent: Record<string, TalentData>;      // Mindscape Cinema (M1-M6)
}

export interface PartnerInfo {
  Birthday: string;
  FullName: string;
  Gender: string;
  IconPath: string;
  ProfileDesc: string;
  OutlookDesc: string;
  Race: string;           // Actually faction/squad
  Stature: string;        // Height
  UnlockCondition: string[];
  TrustLv: Record<string, string>;
}

export interface AgentStats {
  HpMax: number;
  Attack: number;
  Defence: number;
  BreakStun: number;      // Impact
  Crit: number;
  CritDamage: number;
  ElementAbnormalPower: number;  // Anomaly Proficiency
  ElementMystery: number;        // Anomaly Mastery
  SpBarPoint: number;     // Energy
  SpRecover: number;      // Energy Regen
  HpGrowth: number;
  AttackGrowth: number;
  DefenceGrowth: number;
}

export interface LevelData {
  HpMax: number;
  Attack: number;
  Defence: number;
  LevelMax: number;
  LevelMin: number;
  Materials: Record<string, number>;  // Material ID -> Quantity
}

export interface ExtraLevelData {
  MaxLevel: number;
  Extra: Record<string, ExtraProp>;
}

export interface ExtraProp {
  Prop: number;
  Name: string;
  Format: string;
  Value: number;
}

export interface AgentSkills {
  Basic: SkillCategory;
  Dodge: SkillCategory;
  Special: SkillCategory;
  Chain: SkillCategory;
  Assist: SkillCategory;
}

export interface SkillCategory {
  Description: SkillDescription[];
  Material: Record<string, Record<string, number>>;  // Level -> Materials
}

export interface SkillDescription {
  Name: string;
  Desc: string;
  Param?: SkillParam[];
}

export interface SkillParam {
  Name: string;
  Desc: string;
  Param?: Record<string, SkillParamDetail>;
}

export interface SkillParamDetail {
  Main: number;
  Growth: number;
  Format: string;
  DamagePercentage: number;
  DamagePercentageGrowth: number;
  StunRatio: number;
  StunRatioGrowth: number;
}

export interface AgentPassive {
  Level: Record<string, PassiveLevel>;
  Materials: Record<string, Record<string, number>>;
}

export interface PassiveLevel {
  Level: number;
  Id: number;
  Name: string[];
  Desc: string[];
}

export interface TalentData {
  Level: number;
  Name: string;
  Desc: string;
  Desc2: string;  // Lore text
}














export interface UpgradeCost {
  fromLevel: number;
  toLevel: number;
  dennys: number;
  investigatorLogs: {
    trainee: number;
    official: number;
    senior: number;
  };
  certificationSeals: {
    bRank: number;
    aRank: number;
    sRank: number;
  };
}

// calculator-input.model.ts
export interface CalculatorInput {
  id:    string;
  currentLevel: number;
  targetLevel: number;
  currentCoreSkill: string; // 'A' through 'F'
  targetCoreSkill: string;
}