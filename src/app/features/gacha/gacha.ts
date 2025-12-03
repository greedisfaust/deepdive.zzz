import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../../core/models/agents.model';
import { AGENT_INDEX } from '../../core/data/agents-index';

@Component({
  selector: 'app-gacha',
  standalone: false,
  templateUrl: './gacha.html',
  styleUrl: './gacha.css',
})
export class Gacha {
  agentList = AGENT_INDEX;
  pulledAgent: Agent | null = null;
  isAnimating = false;
  pullHistory: any[] = [];
  
  // Pity system
  pityCounter = 0;
  guaranteedSRank = 90;
  softPityStart = 73;
  
  // Pull statistics
  totalPulls = 0;
  sRankPulls = 0;
  aRankPulls = 0;

  constructor(private http: HttpClient) {
    this.loadPityFromStorage();
  }

  // Single pull
  doSinglePull() {
    if (this.isAnimating) return;
    this.performPull(1);
  }

  // 10-pull
  doTenPull() {
    if (this.isAnimating) return;
    this.performPull(10);
  }

  performPull(count: number) {
    this.isAnimating = true;
    const results: any[] = [];

    for (let i = 0; i < count; i++) {
      this.pityCounter++;
      this.totalPulls++;
      
      const rarity = this.determineRarity();
      const pool = this.agentList.filter(a => a.rarity === rarity);
      const pulled = pool[Math.floor(Math.random() * pool.length)];
      
      results.push({
        agent: pulled,
        rarity: rarity,
        pityCount: this.pityCounter
      });

      // Track stats
      if (rarity === 'S') {
        this.sRankPulls++;
        this.pityCounter = 0; // Reset pity on S-rank
      } else if (rarity === 'A') {
        this.aRankPulls++;
      }
    }

    // Add to history
    this.pullHistory = [...results.reverse(), ...this.pullHistory].slice(0, 50);
    
    // Show the last pulled character
    const lastPull = results[results.length - 1];
    this.loadAgentDetails(lastPull.agent.id);
    
    // Save pity
    this.savePityToStorage();

    // Animation delay
    setTimeout(() => {
      this.isAnimating = false;
    }, 2000);
  }

  determineRarity(): 'S' | 'A' {
    // Hard pity at 90
    if (this.pityCounter >= this.guaranteedSRank) {
      return 'S';
    }

    // Soft pity increases rates starting at 73
    let sRankRate = 0.6;
    if (this.pityCounter >= this.softPityStart) {
      const softPityBonus = (this.pityCounter - this.softPityStart) * 6;
      sRankRate += softPityBonus;
    }

    const roll = Math.random() * 100;
    
    if (roll < sRankRate) {
      return 'S';
    } else if (roll < 13) { // ~12.4% A-rank rate
      return 'A';
    } else {
      return 'A'; // Default to A-rank (no B-rank in this game)
    }
  }

  loadAgentDetails(agentId: string) {
    this.http.get<Agent>(`https://api.hakush.in/zzz/data/en/character/${agentId}.json`).subscribe({
      next: (response) => {
        this.pulledAgent = response;
      },
      error: (error) => console.log('Error loading agent:', error)
    });
  }

  closeResult() {
    this.pulledAgent = null;
  }

  resetPity() {
    if (confirm('Are you sure you want to reset your pity counter and pull history?')) {
      this.pityCounter = 0;
      this.totalPulls = 0;
      this.sRankPulls = 0;
      this.aRankPulls = 0;
      this.pullHistory = [];
      this.savePityToStorage();
    }
  }

  savePityToStorage() {
    localStorage.setItem('zzz_gacha_pity', JSON.stringify({
      pityCounter: this.pityCounter,
      totalPulls: this.totalPulls,
      sRankPulls: this.sRankPulls,
      aRankPulls: this.aRankPulls,
      pullHistory: this.pullHistory
    }));
  }

  loadPityFromStorage() {
    const saved = localStorage.getItem('zzz_gacha_pity');
    if (saved) {
      const data = JSON.parse(saved);
      this.pityCounter = data.pityCounter || 0;
      this.totalPulls = data.totalPulls || 0;
      this.sRankPulls = data.sRankPulls || 0;
      this.aRankPulls = data.aRankPulls || 0;
      this.pullHistory = data.pullHistory || [];
    }
  }

  capitalizeFirst(str: string): string {
    if (!str) return '';
    if (str === 'electric') return 'Electric';
    if (str === 'physical') return 'Physical';
    if (str === 'frost') return 'Frost';
    if (str === 'auricink') return 'AuricInk';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getPulledAgentRarity(): string {
    if (!this.pulledAgent) return 's';
    const agentData = this.agentList.find(a => a.id === this.pulledAgent!.Id.toString());
    return (agentData?.rarity || 'S').toLowerCase();
  }

  getSRankRate(): string {
    if (this.pityCounter >= this.guaranteedSRank) return '100%';
    if (this.pityCounter >= this.softPityStart) {
      const rate = 0.6 + (this.pityCounter - this.softPityStart) * 6;
      return rate.toFixed(1) + '%';
    }
    return '0.6%';
  }
}
