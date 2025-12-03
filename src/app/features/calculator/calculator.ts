import { Component, Input, OnChanges } from '@angular/core';
import { Agent } from '../../core/models/agents.model';
import { AGENT_INDEX } from '../../core/data/agents-index';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calculator',
  standalone: false,
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator implements OnChanges {  

  // 
  @Input() agent: Agent | null = null;  
  agentList = AGENT_INDEX;
  filteredAgentList = AGENT_INDEX;
  searchTerm: string = '';
  activeFilters: { rarity?: string, specialty?: string, attribute?: string } = {};
  levelPreset: Array<{label: string, current: number, target: number}> = [];
  corelvls = ['0', 'A', 'B', 'C', 'D', 'E', 'F'];
  skillLevels = Array.from({ length: 13 }, (_, i) => i); // 0-12
  
selectedPreset: any = null;
currentCoreSkill = '0';
targetCoreSkill = 'F';

// Skill levels
currentBasicLevel = 0;
targetBasicLevel = 12;
currentDodgeLevel = 0;
targetDodgeLevel = 12;
currentSpecialLevel = 0;
targetSpecialLevel = 12;
currentChainLevel = 0;
targetChainLevel = 12;
currentAssistLevel = 0;
targetAssistLevel = 12;

totmat: Record<string, number> = {};
breakdown: any = { ascension: {}, core: {}, basic: {}, dodge: {}, special: {}, chain: {}, assist: {} };
expneeded: number = 0;
calculated: boolean = false;

constructor(private http: HttpClient) {}

capitalizeFirst(str: string): string {
  if (!str) return '';
  // Handle special cases
  if (str === 'electric') return 'Electric';
  if (str === 'physical') return 'Physical';
  if (str === 'frost') return 'Frost';
  if (str === 'auricink') return 'AuricInk';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

clearAgent() {
  this.agent = null;
  this.calculated = false;
}

filterAgents() {
  this.filteredAgentList = this.agentList.filter(agent => {
    // Search term filter
    const matchesSearch = !this.searchTerm || 
      agent.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    
    // Rarity filter
    const matchesRarity = !this.activeFilters.rarity || 
      agent.rarity === this.activeFilters.rarity;
    
    // Specialty filter
    const matchesSpecialty = !this.activeFilters.specialty || 
      agent.specialty === this.activeFilters.specialty;
    
    // Attribute filter
    const matchesAttribute = !this.activeFilters.attribute || 
      agent.attribute === this.activeFilters.attribute;
    
    return matchesSearch && matchesRarity && matchesSpecialty && matchesAttribute;
  });
}

toggleFilter(type: 'rarity' | 'specialty' | 'attribute', value: string) {
  if (this.activeFilters[type] === value) {
    delete this.activeFilters[type];
  } else {
    this.activeFilters[type] = value;
  }
  this.filterAgents();
}

clearAllFilters() {
  this.activeFilters = {};
  this.searchTerm = '';
  this.filterAgents();
}

clearSearch() {
  this.searchTerm = '';
  this.filterAgents();
}

getPrydwenUrl(): string {
  if (!this.agent) return 'https://www.prydwen.gg/zenless/characters/';
  
  // Convert character name to Prydwen URL format (lowercase, spaces to hyphens)
  const slug = this.agent.Name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters
  
  return `https://www.prydwen.gg/zenless/characters/${slug}`;
}


  // loadMaterialData() { 
  //   console.log('Loading material data');
  //   this.http.get('https://zzz3.hakush.in/item/110001').subscribe({ 
  // }
  // idk where to get material data from
 loadAgent(agentId: string) {
    console.log('Loading agent:', agentId);
    this.http.get<Agent>(`https://api.hakush.in/zzz/data/en/character/${agentId}.json`).subscribe({
      next: (response) => {
        this.agent = response;
        console.log('Agent loaded:', this.agent?.Name);
        this.generateLevelPreset();
        this.calculated = false; 
      },
      error: (error) => console.log('Error loading agent:', error)
    });
  }
  
  ngOnChanges() {
    if (this.agent && this.agent.Level) {
      this.generateLevelPreset();
    }
  }

  generateLevelPreset() {
    console.log('generateLevelPreset called');
    this.levelPreset = [];
    if (!this.agent?.Level) return; 
    
    console.log('Level data from API:', this.agent.Level);
    
    const levelBrackets = Object.values(this.agent.Level).sort(
      (a, b) => a.LevelMin - b.LevelMin
    );
    
    levelBrackets.forEach(bracket => {
      this.levelPreset.push({
        label: `${bracket.LevelMin} → ${bracket.LevelMax}`, 
        current: bracket.LevelMin, 
        target: bracket.LevelMax 
      });
    });

    levelBrackets.forEach(bracket => {
      if (bracket.LevelMin !== 1) {
        this.levelPreset.push({
          label: `1 → ${bracket.LevelMax}`,
          current: 1,
          target: bracket.LevelMax
        });
      }
    });

    this.levelPreset = this.levelPreset
      .filter((preset, index, self) =>
        index === self.findIndex((p) => p.label === preset.label)
      )
      .sort((a, b) => {
        if (a.current !== b.current) return a.current - b.current;
        return a.target - b.target;
      });
      
    this.selectedPreset = this.levelPreset[this.levelPreset.length - 1];
  }

  calcMaterials() {
   console.log('calcMaterials called');
    
    if (!this.agent || !this.selectedPreset) return;
    
    this.totmat = {};
    this.breakdown = { ascension: {}, core: {}, basic: {}, dodge: {}, special: {}, chain: {}, assist: {} };
    this.expneeded = 0;
    
    this.breakdown.ascension = this.calcAscensionMaterials(
      this.agent, 
      this.selectedPreset.current, 
      this.selectedPreset.target
    );
    
    this.breakdown.core = this.calcCoreSkillCost(
      this.agent,
      this.currentCoreSkill,
      this.targetCoreSkill
    );
    
    this.breakdown.basic = this.calcSkillCost(this.agent.Skill?.Basic, this.currentBasicLevel, this.targetBasicLevel);
    this.breakdown.dodge = this.calcSkillCost(this.agent.Skill?.Dodge, this.currentDodgeLevel, this.targetDodgeLevel);
    this.breakdown.special = this.calcSkillCost(this.agent.Skill?.Special, this.currentSpecialLevel, this.targetSpecialLevel);
    this.breakdown.chain = this.calcSkillCost(this.agent.Skill?.Chain, this.currentChainLevel, this.targetChainLevel);
    this.breakdown.assist = this.calcSkillCost(this.agent.Skill?.Assist, this.currentAssistLevel, this.targetAssistLevel);
    
    Object.assign(this.totmat, this.breakdown.ascension);
    this.addMaterials(this.totmat, this.breakdown.core);
    this.addMaterials(this.totmat, this.breakdown.basic);
    this.addMaterials(this.totmat, this.breakdown.dodge);
    this.addMaterials(this.totmat, this.breakdown.special);
    this.addMaterials(this.totmat, this.breakdown.chain);
    this.addMaterials(this.totmat, this.breakdown.assist);
    
    console.log('Material IDs:', Object.keys(this.totmat));
    console.log('Full materials:', this.totmat);
    
    this.calculated = true;
  }
    
  calcAscensionMaterials(agent: Agent, currentLevel: number, targetLevel: number): Record<string, number> {
    const materials: Record<string, number> = {};
    if (!agent.Level || !agent.LevelEXP) return materials;
    
    console.log(`Calculating materials for ${currentLevel} → ${targetLevel}`);
    console.log('Available level brackets:', Object.values(agent.Level));
    
    // Calculate EXP
    for (let i = currentLevel; i < targetLevel; i++) {
      this.expneeded += agent.LevelEXP[i] || 0;
    }
    
    // Calculate materials - add full bracket materials if we complete that bracket
    Object.values(agent.Level).forEach((levelData) => {
      console.log(`Checking bracket ${levelData.LevelMin} → ${levelData.LevelMax}`);
      console.log(`Condition: currentLevel(${currentLevel}) < LevelMax(${levelData.LevelMax}) && targetLevel(${targetLevel}) >= LevelMax(${levelData.LevelMax})`);
      
      // Only count this bracket's materials if we're completing the entire bracket
      // (reaching the bracket's LevelMax from at or below LevelMin)
      if (currentLevel < levelData.LevelMax && targetLevel >= levelData.LevelMax) {
        console.log('Adding materials from this bracket:', levelData.Materials);
        Object.entries(levelData.Materials).forEach(([matId, qty]) => { 
          materials[matId] = (materials[matId] || 0) + qty;
        });
      }
    });
    
    console.log('Final materials:', materials);
    return materials;
  }

  calcCoreSkillCost(agent: Agent, currentCore: string, targetCore: string): Record<string, number> {
    const materials: Record<string, number> = {};
    if (!agent.Passive || !agent.Passive.Materials) return materials;
    
    const currentIndex = this.corelvls.indexOf(currentCore);
    const targetIndex = this.corelvls.indexOf(targetCore);
    
    if (targetIndex <= currentIndex) return materials;
    
    for (let i = currentIndex + 1; i <= targetIndex; i++) {
      const levelKey = (i + 1).toString();
      const levelMaterials = agent.Passive.Materials[levelKey];
      
      if (levelMaterials) {
        Object.entries(levelMaterials).forEach(([matId, quantity]) => {
          materials[matId] = (materials[matId] || 0) + quantity;
        });
      }
    }
    
    return materials;
  }

  calcSkillCost(skillCategory: any, currentLevel: number, targetLevel: number): Record<string, number> {
    const materials: Record<string, number> = {};
    if (!skillCategory || !skillCategory.Material) return materials;
    
    if (targetLevel <= currentLevel) return materials;
    
    for (let i = currentLevel + 1; i <= targetLevel; i++) {
      const levelKey = i.toString();
      const levelMaterials = skillCategory.Material[levelKey];
      
      if (levelMaterials) {
        Object.entries(levelMaterials).forEach(([matId, quantity]) => {
          materials[matId] = (materials[matId] || 0) + (quantity as number);
        });
      }
    }
    
    return materials;
  }
  
  // fixed helper to add materials
  addMaterials(target: Record<string, number>, source: Record<string, number>) {
    Object.entries(source).forEach(([matId, quantity]) => {
      target[matId] = (target[matId] || 0) + quantity;
    });
  }

  getAgentIcon(): string {
    const agentData = this.agentList.find(a => a.id === this.agent?.Id.toString());
    return agentData?.icon || '01';
  }

  getAgentRank(): string {
    const agentData = this.agentList.find(a => a.id === this.agent?.Id.toString());
    return agentData?.rarity || 'S';
  }

  getAgentSpecialty(): string {
    const agentData = this.agentList.find(a => a.id === this.agent?.Id.toString());
    return agentData?.specialty || 'Attack';
  }

  getAgentAttribute(): string {
    const agentData = this.agentList.find(a => a.id === this.agent?.Id.toString());
    return agentData?.attribute || 'physical';
  }

  getMaterialName(matId: string): string {
    // You can create a mapping for material names if needed
    return matId;
  }

  getMaterialIcon(matId: string): string {
    // Material ID to icon mapping
    const materialIcons: Record<string, string> = {
      // Coins/Currency
      '10': 'IconCoin',
      
      // Avatar Rank Stun
      '100212': 'AvatarRankStun01',
      '100222': 'AvatarRankStun02',
      '100232': 'AvatarRankStun03',

      // Avatar Attack Materials
      '100211': 'AvatarRankDamage01',
      '100221': 'AvatarRankDamage02',
      '100231': 'AvatarRankDamage03',

      // Avatar Defense Materials
      '100215': 'AvatarRankShield01',
      '100225': 'AvatarRankShield02',
      '100235': 'AvatarRankShield03',
      
      // Avatar Anom 
      '100213': 'AvatarRankBuff01',
      '100223': 'AvatarRankBuff02',
      '100233': 'AvatarRankBuff03',

      // Avatar Rank Support
      '100214': 'AvatarRankSupport01',
      '100224': 'AvatarRankSupport02',
      '100234': 'AvatarRankSupport03',

      // Avatar Rank Ruin
      '100216': 'AvatarRankRuin01',
      '100226': 'AvatarRankRuin02',
      '100236': 'AvatarRankRuin03',

      // Avatar Skill Physical
      '100110': 'AvatarSkillPhys01',
      '100120': 'AvatarSkillPhys02',
      '100130': 'AvatarSkillPhys03',

      // Avatar Skill Fire
      '100111': 'AvatarSkillFire01',
      '100121': 'AvatarSkillFire02',
      '100131': 'AvatarSkillFire03',

      // Avatar Skill Ice
      '100112': 'AvatarSkillIce01',
      '100122': 'AvatarSkillIce02',
      '100132': 'AvatarSkillIce03',

      // Avatar Skill Thunder (Lightning/Electric)
      '100113': 'AvatarSkillThunder01',
      '100123': 'AvatarSkillThunder02',
      '100133': 'AvatarSkillThunder03',

      // Avatar Skill Ether
      '100115': 'AvatarSkillEther01',
      '100125': 'AvatarSkillEther02',
      '100135': 'AvatarSkillEther03',

      // Boss/Weekly Materials (using placeholders - sprite sheets don't display properly)
      '110005': 'AvatarSkillThunder02', // Boss material placeholder
      '100941': 'AvatarSkillThunder02', // Boss material placeholder
      
      // Core Skill Materials (Thunder/Electric for now)
      '110001': 'AvatarSkillThunder02',
      '110501': 'AvatarSkillThunder01',
      
      
    };
    
    return materialIcons[matId] || matId;
  }

  getMaterialIconUrl(matId: string): string {
    // External URLs for specific materials
    const externalIcons: Record<string, string> = {
      // Boss/Weekly Materials
      '110005': 'https://theriagames.com/wp-content/uploads/2025/07/Sycophants-Refinement.gif',
      '100941': 'https://api.hakush.in/zzz/UI/UltimateSkill.webp',
      '110001': 'https://theriagames.com/wp-content/uploads/2025/07/Ferocious-Grip.gif',
      '110002': 'https://theriagames.com/wp-content/uploads/2025/07/Living-Drive.gif',
      '110003': 'https://theriagames.com/wp-content/uploads/2025/07/Finale-Dance-Shoes.gif',
      '110004': 'https://theriagames.com/wp-content/uploads/2025/07/Scarlet-Engine.gif',
      '110006': 'https://theriagames.com/wp-content/uploads/2025/07/Exuvia-of-Refinement.gif',
      '110007': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/10/19/98205622/a48f8fd2a6242573d075294228f60d33_1363624828956683017.gif',
      '110501': 'https://theriagames.com/wp-content/uploads/2025/07/Higher-Dimensional-Data-Murderous-Obituary.gif',
      '110502': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/09/11/98205622/8e898fbeee9211f3b7addd6246e59e31_2288611851672805385.gif',
      '110503': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/09/11/98205622/06abce34998ba0209066986fcb928c71_6508550882405505369.gif',
      '110504': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/09/11/98205622/f06bdf97cb453bc05652ddc65c8b98a4_5895367297597853624.gif',
      '110505': 'https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/09/02/ca9fb5fa60d5f42a140e0bd882f57a3a_4330404952746229943.gif',
      '110506': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/09/02/98205622/a8f0be46677977b72c80b8a8368c0f0d_5457916609893635147.gif',
      '110507': 'https://theriagames.com/wp-content/uploads/2025/07/Higher-Dimensional-Data-Stealth-Phantom.gif',
      '110508': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/03/21/167256510/22cb054ba9fa18b8145daac348883d6c_8448798113009362360.gif',
      '110509': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/03/21/167256510/77b6615acb56120872e9ac62734f1756_5200052977352303474.gif',
      '110510': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/06/07/99550110/b733faec61d589f438cc9c080588efc8_6798865591489796626.gif',
      '110511': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/09/29/167256510/a36758b429ecc40610fbd7273ee1b18c_5622526255144702916.gif',
      '110512': 'https://static.wikia.nocookie.net/zenless-zone-zero/images/d/d8/Item_Higher_Dimensional_Data_Corrupted_Dreamsteel.gif',
      
      // Skill Materials Tier 3
      '100130': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/08/18/98205622/f1ed0a0eb5e996f57dd848b831f82749_5520313354702891801.png?x-oss-process=image%2Fformat%2Cwebp',
      '100131': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/08/18/98205622/2f0c1a794ed5fba7a087b388f960a9a4_7479068414414273478.png?x-oss-process=image%2Fformat%2Cwebp',
      '100132': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/08/18/98205622/1daa2325cf41501d4a0c73bf9f347935_4006512001939405503.png?x-oss-process=image%2Fformat%2Cwebp',
      '100133': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/08/18/98205622/1c2501056f7f33ec114af1653be2ecaf_4650300863522699389.png?x-oss-process=image%2Fformat%2Cwebp',
      '100135': 'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/08/18/98205622/75aa0876157802859868bb53e6c06423_8473378651772596031.png?x-oss-process=image%2Fformat%2Cwebp',
    };

    if (externalIcons[matId]) {
      return externalIcons[matId];
    }

    return `https://api.hakush.in/zzz/UI/${this.getMaterialIcon(matId)}.webp`;
  }
}