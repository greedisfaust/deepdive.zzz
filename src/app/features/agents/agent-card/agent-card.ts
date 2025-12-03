import { Component, Input } from '@angular/core';
import { AgentIndex } from '../../../core/models/agents-index.model';

@Component({
  selector: 'app-agent-card',
  standalone: false,
  templateUrl: './agent-card.html',
  styleUrl: './agent-card.css',
})
export class AgentCard {
  
  @Input() agent!: AgentIndex;

  getImageUrl(): string {
    return `assets/agents_icons/${this.agent.icon}.webp`;
  }

  getAttributeIcon(): string {
    const icons: { [key: string]: string } = {
      'electric': 'assets/ui_icons/IconElectric.webp',
      'fire': 'assets/ui_icons/IconFire.webp',
      'ice': 'assets/ui_icons/IconIce.webp',
      'physical': 'assets/ui_icons/IconPhysical.webp',
      'ether': 'assets/ui_icons/IconEther.webp',
      'frost': 'assets/ui_icons/IconFrost.webp',
      'auricink': 'assets/ui_icons/IconAuricInk.webp'
    };
    return icons[this.agent.attribute] || '?';
  }

  getSpecialtyIcon(): string {
    const icons: { [key: string]: string } = {
      'Attack': 'assets/ui_icons/IconAttackType.webp',
      'Defense': 'assets/ui_icons/IconDefense.webp',
      'Support': 'assets/ui_icons/IconSupport.webp',
      'Stun': 'assets/ui_icons/IconStun.webp',
      'Anomaly': 'assets/ui_icons/IconAnomaly.webp',
      'Rupture': 'assets/ui_icons/IconRupture.webp'
    };
    return icons[this.agent.specialty] || '?';
  }

  getFactionIcon(): string {
    const icons: { [key: string]: string } = {
      'Cunning Hares': 'assets/faction_icons/FactionCampGentleHouse.webp',
      'Victoria Housekeeping Co.': 'assets/faction_icons/FactionVictoriaHousekeepingCo.webp',
      'Belobog Heavy Industries': 'assets/faction_icons/FactionBelobogIndustries.webp',
      'Section 6': 'assets/faction_icons/FactionH.S.O-S6.webp',
      'Sons of Calydon': 'assets/faction_icons/FactionSonsOfCalydon.webp',
      'Criminal Investigation Special Response Team': 'assets/faction_icons/FactionN.E.P.S..webp',
      'Stars of Lyra': 'assets/faction_icons/FactionStarsOfLyra.webp',
      'Mockingbird': 'assets/faction_icons/FactionMockingbird.webp',
      'Obol Squad': 'assets/faction_icons/FactionObols.webp',
      'Yunkui Summit': 'assets/faction_icons/FactionSuiban.webp',
      'Spook Shack': 'assets/faction_icons/FactionSpookShack.webp'
    };
    return icons[this.agent.faction] || '?';
  }

  getRarityIcon(): string {
    const icons: { [key: string]: string } = {
      'A': 'assets/ui_icons/agent_rank_a.webp',
      'S': 'assets/ui_icons/agent_rank_s.webp'
    };
    return icons[this.agent.rarity] || '?';
  }

}
