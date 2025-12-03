import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';

import { Agent } from '../../core/models/agents.model';
import { AgentIndex } from '../../core/models/agents-index.model';
import { AGENT_INDEX } from '../../core/data/agents-index';
import { AgentsServices } from '../../core/services/agents-services';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit, OnDestroy {

  // Carousel state
  currentSlide = 0;
  slides = [0, 1, 2, 3]; // Array matching number of slides - ADD MORE INDICES TO ADD SLIDES
  
  private autoSlideInterval: any;
  private readonly AUTO_SLIDE_DELAY = 10000; // 10 seconds

  // Spotlight Agent
  spotlightAgent: Agent | null = null;
  spotlightAgentIndex: AgentIndex | null = null;
  spotlightLoading = true;

  constructor(private agentsServices: AgentsServices) {}

  ngOnInit(): void {
    this.startAutoSlide();
    this.loadRandomSpotlightAgent();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // ===== SPOTLIGHT AGENT =====
  loadRandomSpotlightAgent(): void {
    // Pick a random agent from the index
    const randomIndex = Math.floor(Math.random() * AGENT_INDEX.length);
    this.spotlightAgentIndex = AGENT_INDEX[randomIndex];
    
    // Fetch full agent data
    this.agentsServices.getAgentByID(this.spotlightAgentIndex.id).subscribe({
      next: (agent) => {
        this.spotlightAgent = agent;
        this.spotlightLoading = false;
      },
      error: (err) => {
        console.error('Failed to load spotlight agent:', err);
        this.spotlightLoading = false;
      }
    });
  }

  getSpotlightImageUrl(): string {
    if (!this.spotlightAgent) return '';
    return `https://api.hakush.in/zzz/UI/${this.spotlightAgent.Icon}.webp`;
  }

  getSpotlightName(): string {
    return this.spotlightAgent?.Name || this.spotlightAgentIndex?.name || 'Agent';
  }

  getSpotlightDescription(): string {
    const profileDesc = this.spotlightAgent?.PartnerInfo?.ProfileDesc;
    if (profileDesc) {
      // Truncate if too long
      return profileDesc.length > 200 ? profileDesc.substring(0, 200) + '...' : profileDesc;
    }
    return 'Check out this agent in our database!';
  }

  getSpotlightRarity(): string {
    return this.spotlightAgentIndex?.rarity === 'S' ? 'S-RANK' : 'A-RANK';
  }

  // ===== CAROUSEL CONTROLS =====
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetAutoSlide();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  // ===== AUTO-SLIDE =====
  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.AUTO_SLIDE_DELAY);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}

