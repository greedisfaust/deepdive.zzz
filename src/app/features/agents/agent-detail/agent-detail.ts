import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AgentsServices } from '../../../core/services/agents-services';
import { Agent } from '../../../core/models/agents.model';

@Component({
  selector: 'app-agent-detail',
  standalone: false,
  templateUrl: './agent-detail.html',
  styleUrls: ['./agent-detail.css'],
})
export class AgentDetail implements OnInit {
  agent: Agent | undefined;
  loading = true;
  error: string | undefined;

  // UI State
  selectedLevelIndex = 6;
  levelDisplayValues = [1, 10, 20, 30, 40, 50, 60];
  
  activeSkillTab: 'basic' | 'dodge' | 'special' | 'chain' | 'assist' | 'core' = 'basic';

  // Skill level for each tab (1-16)
  skillLevels: { [key: string]: number } = {
    basic: 12,
    dodge: 12,
    special: 12,
    chain: 12,
    assist: 12,
    core: 6  // Changed from 5 to 6 (0=base, 1=A, 2=B, 3=C, 4=D, 5=E, 6=F)
  };

  // Show/hide slider for each tab
  showSkillSlider: { [key: string]: boolean } = {
    basic: false,
    dodge: false,
    special: false,
    chain: false,
    assist: false,
    core: false
  };

  coreLevelLabels = ['0', 'A', 'B', 'C', 'D', 'E', 'F']; // Added '0' at the start

  // Icon mapping
  private iconMap: { [key: string]: string } = {
    'Icon_Normal': '/assets/ui_icons/basic_attack.webp',
    'Icon_Special': '/assets/ui_icons/special_attacknormal.webp',
    'Icon_SpecialReady': '/assets/ui_icons/special_attack.webp',
    'Icon_Evade': '/assets/ui_icons/dodge.webp',
    'Icon_QTE': '/assets/ui_icons/chain_attack.webp',
    'Icon_UltimateReady': '/assets/ui_icons/chain_attack.webp',
    'Icon_Switch': '/assets/ui_icons/assist.webp',
    'Icon_CoreSkill': '/assets/ui_icons/core_skill.webp'
  };

  constructor(
    private route: ActivatedRoute,
    private agentsServices: AgentsServices,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
  // Subscribe to route param changes instead of just reading the snapshot
  this.route.paramMap.subscribe(params => {
    const agentId = params.get('id');
    if (agentId) {
      this.loadAgent(agentId);
      }
    });
  }

  loadAgent(id: string): void {
    this.loading = true;
    this.agentsServices.getAgentByID(id).subscribe({
      next: (agent) => {
        this.agent = agent;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load agent';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // ===== IMAGE & BASIC INFO =====
  getImageUrl(): string {
    if (!this.agent) return '';
    return `https://api.hakush.in/zzz/UI/${this.agent.Icon}.webp`;
  }

  getRarityLabel(): string {
    const rarityValue = this.agent?.Rarity || 3;
    return rarityValue === 4 ? 'S-Rank' : 'A-Rank';
  }

  getRarityClass(): string {
    const rarityValue = this.agent?.Rarity || 3;
    return rarityValue === 4 ? 'rarity-s' : 'rarity-a';
  }

  getRarityStars(): number[] {
    const rarityValue = this.agent?.Rarity || 3;
    const count = rarityValue === 4 ? 5 : 4;
    return Array(count).fill(0);
  }

  getElementType(): string {
    if (!this.agent?.ElementType) return '';
    return Object.values(this.agent.ElementType)[0] || '';
  }

  getWeaponType(): string {
    if (!this.agent?.WeaponType) return '';
    return Object.values(this.agent.WeaponType)[0] || '';
  }

  getCamp(): string {
    if (!this.agent?.Camp) return '';
    return Object.values(this.agent.Camp)[0] || '';
  }

  getHitType(): string {
    if (!this.agent?.HitType) return '';
    return Object.values(this.agent.HitType)[0] || '';
  }

  getAttributeIcon(): string {
    const element = this.getElementType().toLowerCase();
    const icons: { [key: string]: string } = {
      'electric': '/assets/ui_icons/IconElectric.webp',
      'fire': '/assets/ui_icons/IconFire.webp',
      'ice': '/assets/ui_icons/IconIce.webp',
      'physical': '/assets/ui_icons/IconPhysical.webp',
      'ether': '/assets/ui_icons/IconEther.webp',
      'frost': '/assets/ui_icons/IconFrost.webp'
    };
    return icons[element] || '';
  }

  // ===== FORMATTED STATS =====
  getCritRate(): string {
    const crit = this.agent?.Stats?.Crit || 0;
    return (crit / 100).toFixed(1);
  }

  getCritDamage(): string {
    const critDmg = this.agent?.Stats?.CritDamage || 0;
    return (critDmg / 100).toFixed(1);
  }

  // ===== LEVEL & STATS =====
  getCurrentLevelData() {
    if (!this.agent?.Level) return null;
    if (this.selectedLevelIndex === 0) return null;
    const key = String(this.selectedLevelIndex + 1);
    return this.agent.Level[key];
  }

  getDisplayLevel(): number {
    return this.levelDisplayValues[this.selectedLevelIndex];
  }

  getStatHP(): number {
    const baseHP = this.agent?.Stats?.HpMax || 0;
    const hpGrowth = this.agent?.Stats?.HpGrowth || 0;
    if (!this.agent?.Level || this.selectedLevelIndex === 0) return baseHP;
    const levelData = this.agent.Level[String(this.selectedLevelIndex)];
    const levelBonus = levelData?.HpMax || 0;
    const displayLevel = this.levelDisplayValues[this.selectedLevelIndex];
    const growthBonus = (hpGrowth / 10000) * displayLevel;
    return Math.round(baseHP + levelBonus + growthBonus);
  }

  getStatATK(): number {
    const baseATK = this.agent?.Stats?.Attack || 0;
    const atkGrowth = this.agent?.Stats?.AttackGrowth || 0;
    if (!this.agent?.Level || this.selectedLevelIndex === 0) return baseATK;
    const levelData = this.agent.Level[String(this.selectedLevelIndex)];
    const levelBonus = levelData?.Attack || 0;
    const displayLevel = this.levelDisplayValues[this.selectedLevelIndex];
    const growthBonus = (atkGrowth / 10000) * displayLevel;
    return Math.round(baseATK + levelBonus + growthBonus);
  }

  getStatDEF(): number {
    const baseDEF = this.agent?.Stats?.Defence || 0;
    const defGrowth = this.agent?.Stats?.DefenceGrowth || 0;
    if (!this.agent?.Level || this.selectedLevelIndex === 0) return baseDEF;
    const levelData = this.agent.Level[String(this.selectedLevelIndex)];
    const levelBonus = levelData?.Defence || 0;
    const displayLevel = this.levelDisplayValues[this.selectedLevelIndex];
    const growthBonus = (defGrowth / 10000) * displayLevel;
    return Math.round(baseDEF + levelBonus + growthBonus);
  }

  onLevelChange(index: number): void {
    this.selectedLevelIndex = index;
  }

  // ===== SKILL TAB & SLIDER =====
  onSkillTabClick(tab: 'basic' | 'dodge' | 'special' | 'chain' | 'assist' | 'core'): void {
    if (this.activeSkillTab === tab) {
      // Toggle slider visibility if clicking the same tab
      this.showSkillSlider[tab] = !this.showSkillSlider[tab];
    } else {
      // Switch tab and show slider
      this.activeSkillTab = tab;
      // Hide all other sliders, show current
      Object.keys(this.showSkillSlider).forEach(key => {
        this.showSkillSlider[key] = key === tab;
      });
    }
  }

  onSkillLevelChange(tab: string, value: number): void {
    this.skillLevels[tab] = Number(value);
  }

  getSkillLevel(tab: string): number {
    return this.skillLevels[tab] || 1;
  }

  // ===== SKILL MATERIALS/MULTIPLIERS - DYNAMIC APPROACH =====
  // Change getSkillMaterials to return grouped data by skill name
  getSkillMaterials(skillType: string): any[] {
    if (!this.agent?.Skill) return [];
    
    const skillMap: { [key: string]: any } = {
      'basic': this.agent.Skill.Basic,
      'dodge': this.agent.Skill.Dodge,
      'special': this.agent.Skill.Special,
      'chain': this.agent.Skill.Chain,
      'assist': this.agent.Skill.Assist
    };
    
    const skill = skillMap[skillType];
    if (!skill?.Description) return [];
    
    const currentLevel = this.skillLevels[skillType];
    const groupedResults: any[] = [];
    
    // Process each description that has Param data
    skill.Description.forEach((desc: any) => {
      if (!desc.Param || desc.Param.length === 0) return;
      
      const skillGroup: any = {
        skillName: desc.Name || 'Unknown Skill',
        multipliers: []
      };
      
      // Each Param entry contains multiplier data
      desc.Param.forEach((paramInfo: any) => {
        const paramName = paramInfo.Name;
        const paramData = paramInfo.Param;
        
        // Check if this is a text-based parameter (like Energy Cost)
        if (!paramData && paramInfo.Desc) {
          // This is a static value (e.g., "60" for Energy Cost)
          skillGroup.multipliers.push({
            name: paramName,
            value: paramInfo.Desc,
            statId: 'static',
            type: 'energy',
            isStatic: true
          });
          return;
        }
        
        if (!paramData) return;
        
        const skillId = Object.keys(paramData)[0];
        const multiplierData = paramData[skillId];
        
        if (!multiplierData) return;
        
        // Calculate value: Main + (Growth * (Level - 1))
        const main = multiplierData.Main || 0;
        const growth = multiplierData.Growth || 0;
        const calculatedValue = main + (growth * (currentLevel - 1));
        
        // Determine the type
        let type = 'other';
        if (paramName.includes('DMG Multiplier')) {
          type = 'dmg';
        } else if (paramName.includes('Daze Multiplier')) {
          type = 'daze';
        } else if (paramName.includes('Energy Cost')) {
          type = 'energy';
        }
        
        skillGroup.multipliers.push({
          name: paramName,
          value: calculatedValue,
          statId: skillId,
          type: type,
          isStatic: false
        });
      });
      
      if (skillGroup.multipliers.length > 0) {
        groupedResults.push(skillGroup);
      }
    });
    
    return groupedResults;
  }

  private getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return (v - 20) % 10 < 4 && v - 20 > -1 ? s[(v - 20) % 10] : s[Math.min(v, 4)] || s[0];
  }

  private getStatLabel(statId: string, descriptions: any[], skillType: string): string {
    const statIdMap: { [key: string]: string } = {
      '10': 'DMG Multiplier',
      '100123': 'Daze Multiplier',
      '100133': 'DMG Multiplier',
      '100113': 'Energy Cost',
      '100143': 'Chain Attack Defensive Assist Daze',
      '100153': 'Heavy Attack Defensive Assist Daze',
      '100163': 'Light Attack Defensive Assist Daze',
      '100941': 'Anomaly Buildup',
      '100951': 'Anomaly Proficiency',
    };
    
    const desc = descriptions.find((d: any) => d.Param && d.Param.includes(Number(statId)));
    if (desc?.Name) {
      return desc.Name;
    }
    
    if (statIdMap[statId]) {
      return statIdMap[statId];
    }
    
    return `Attribute ${statId}`;
  }

  getMultiplierValue(material: any): string {
    const value = material.value;
    
    if (value === undefined || value === null) return 'N/A';
    
    // Handle static values (like Energy Cost = "60")
    if (material.isStatic) {
      return String(value);
    }
    
    if (typeof value !== 'number') return String(value);
    
    const type = material.type;
    
    // Energy Cost - whole number
    if (type === 'energy') {
      return value.toString();
    }
    
    // DMG and Daze Multipliers - stored as large integers
    // Example: 4250 = 42.5%, 20780 = 207.8%
    return (value / 100).toFixed(1) + '%';
  }
  
  // ===== TEXT PARSING =====
  parseDescription(text: string, skillType?: string): SafeHtml {
    if (!text) return this.sanitizer.bypassSecurityTrustHtml('');
    
    let parsed = text;

    // 1. Handle Layout placeholders
    parsed = parsed.replace(/{LAYOUT_CONSOLECONTROLLER#stick}{LAYOUT_FALLBACK#joystick}/g, 'Joystick');
    parsed = parsed.replace(/{LAYOUT_[^}]+#([^}]+)}/g, '$1');

    // CAL calculation logic removed as requested.
    
    parsed = parsed.replace(/<IconMap:([^>]+)>/g, (match, iconName) => {
      const iconPath = this.iconMap[iconName] || '';
      if (iconPath) {
        return `<img src="${iconPath}" class="inline-icon" alt="${iconName}">`;
      }
      return '';
    });
    
    parsed = parsed.replace(/<color=(#[A-Fa-f0-9]{6})>([^<]*)<\/color>/g, 
      (match, color, content) => `<span style="color: ${color}; font-weight: 500;">${content}</span>`
    );
    
    parsed = parsed.replace(/\\n/g, '<br>');
    
    return this.sanitizer.bypassSecurityTrustHtml(parsed);
  }

  // ===== SKILLS =====
  getBasicSkills() {
    const skills = this.agent?.Skill?.Basic?.Description || [];
    return skills.filter(skill => skill.Desc && skill.Desc.trim() !== '');
  }

  getDodgeSkills() {
    const skills = this.agent?.Skill?.Dodge?.Description || [];
    return skills.filter(skill => skill.Desc && skill.Desc.trim() !== '');
  }

  getSpecialSkills() {
    const skills = this.agent?.Skill?.Special?.Description || [];
    return skills.filter(skill => skill.Desc && skill.Desc.trim() !== '');
  }

  getChainSkills() {
    const skills = this.agent?.Skill?.Chain?.Description || [];
    return skills.filter(skill => skill.Desc && skill.Desc.trim() !== '');
  }

  getAssistSkills() {
    const skills = this.agent?.Skill?.Assist?.Description || [];
    return skills.filter(skill => skill.Desc && skill.Desc.trim() !== '');
  }

  getCurrentCoreSkill() {
    if (!this.agent?.Passive?.Level) return null;
    
    const currentIndex = this.skillLevels['core'];
    
    // Get all level entries and sort by Level property
    const allLevels = Object.entries(this.agent.Passive.Level);
    if (allLevels.length === 0) return null;
    
    const sortedLevels = allLevels.sort(([, a]: [string, any], [, b]: [string, any]) => 
      (a.Level || 0) - (b.Level || 0)
    );
    
    if (currentIndex >= sortedLevels.length) return null;
    
    const [levelId, level] = sortedLevels[currentIndex];
    if (!level) return null;
    
    return {
      Name: level.Name?.join(' / ') || 'Core Skill',
      Desc: level.Desc?.join('\n\n') || ''
    };
  }

  getSkillTabIcon(tab: string): string {
    const icons: { [key: string]: string } = {
      'basic': '/assets/ui_icons/basic_attack.webp',
      'dodge': '/assets/ui_icons/dodge.webp',
      'special': '/assets/ui_icons/special_attack.webp',
      'chain': '/assets/ui_icons/chain_attack.webp',
      'assist': '/assets/ui_icons/assist.webp',
      'core': '/assets/ui_icons/core_skill.webp'
    };
    return icons[tab] || '';
  }

  // ===== MINDSCAPE CINEMA =====
  getTalents() {
    if (!this.agent?.Talent) return [];
    return Object.entries(this.agent.Talent).map(([key, value]) => ({
      level: key,
      ...value
    }));
  }
}