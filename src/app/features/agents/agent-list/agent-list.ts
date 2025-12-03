import { AfterViewInit, Component, ViewChild, OnDestroy, NgZone, ElementRef, HostListener } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AgentsServices } from '../../../core/services/agents-services';
import { TransitionService } from '../../../core/services/transition.service';
import { Agent } from '../../../core/models/agents.model';
import { AgentIndex } from '../../../core/models/agents-index.model';

@Component({
  selector: 'app-agent-list',
  standalone: false,
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentList implements OnInit, OnDestroy {
  
  agents: any[] = [];
  displayAgents: any[] = [];
  
  // ===== HOVER PREVIEW =====
  hoveredAgent: AgentIndex | null = null;
  previewAgent: Agent | null = null;
  previewLoading = false;
  private previewCache: Map<string, Agent> = new Map();
  
  // ========== bangboo ==========
  scrollGifUrl = 'https://preview.redd.it/prvyc3kytdve1.gif?width=360&format=mp4&s=39530f76e868d38c573ae4032e7c940b3c645ec8';

  @ViewChild('scrollVideo', { static: false }) scrollVideo?: ElementRef<HTMLVideoElement>;
  private lastScrollTime = 0;
  private lastScrollY = 0;
  private scrollVelocity = 0;
  private videoStopTimeout: any = null;
  // ========== bangboo ==========

  // Physics & State
  private isDragging = false;
  private hasMoved = false;
  private startY = 0;
  private currentTranslateY = 0;
  private previousTranslateY = 0;
  private animationFrameId: number | null = null;
  
  // Layout Constants
  private readonly COLUMNS = 3; 
  private readonly CARD_HEIGHT = 180;
  private readonly GAP = 10;
  private singleSetHeight = 0;

  constructor(
    private agentsService: AgentsServices, 
    private ngZone: NgZone,
    private router: Router,
    private transitionService: TransitionService
  ) {}

  ngOnInit() {
    let rawAgents: any[] = this.agentsService.getAgentIndex() || [];
    
    if (rawAgents.length === 0) return;

    this.agents = rawAgents;

    this.displayAgents = [
      ...this.agents, 
      ...this.agents, 
      ...this.agents, 
      ...this.agents, 
      ...this.agents
    ];

    const rows = Math.ceil(this.agents.length / this.COLUMNS);
    this.singleSetHeight = rows * (this.CARD_HEIGHT + this.GAP);

    this.currentTranslateY = -this.singleSetHeight * 2;
    this.previousTranslateY = this.currentTranslateY;

    window.addEventListener('wheel', this.preventZoom, { passive: false });
    window.addEventListener('keydown', this.preventZoomKeys);
  }

  ngOnDestroy() {
    window.removeEventListener('wheel', this.preventZoom);
    window.removeEventListener('keydown', this.preventZoomKeys);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.videoStopTimeout) {
      clearTimeout(this.videoStopTimeout);
    }
  }

  // ===== HOVER PREVIEW METHODS =====
  onAgentHover(agent: AgentIndex): void {
    if (this.hoveredAgent?.id === agent.id) return;
    
    this.hoveredAgent = agent;
    
    // Check cache first
    if (this.previewCache.has(agent.id)) {
      this.previewAgent = this.previewCache.get(agent.id)!;
      this.previewLoading = false;
      return;
    }
    
    this.previewLoading = true;
    this.agentsService.getAgentByID(agent.id).subscribe({
      next: (fullAgent) => {
        this.previewCache.set(agent.id, fullAgent);
        if (this.hoveredAgent?.id === agent.id) {
          this.previewAgent = fullAgent;
          this.previewLoading = false;
        }
      },
      error: () => {
        this.previewLoading = false;
      }
    });
  }

  onAgentLeave(): void {
    this.hoveredAgent = null;
    this.previewAgent = null;
    this.previewLoading = false;
  }

  getPreviewImageUrl(): string {
    if (!this.previewAgent) return '';
    return `https://api.hakush.in/zzz/UI/${this.previewAgent.Icon}.webp`;
  }

  getPreviewRarityClass(): string {
    const rarityValue = this.previewAgent?.Rarity || 3;
    return rarityValue === 4 ? 'rarity-s' : 'rarity-a';
  }

  getPreviewRarityStars(): number[] {
    const rarityValue = this.previewAgent?.Rarity || 3;
    const count = rarityValue === 4 ? 5 : 4;
    return Array(count).fill(0);
  }

  getPreviewElementType(): string {
    if (!this.previewAgent?.ElementType) return '';
    return Object.values(this.previewAgent.ElementType)[0] || '';
  }

  getPreviewAttributeIcon(): string {
    const element = this.getPreviewElementType().toLowerCase();
    const icons: { [key: string]: string } = {
      'electric': 'assets/ui_icons/IconElectric.webp',
      'fire': 'assets/ui_icons/IconFire.webp',
      'ice': 'assets/ui_icons/IconIce.webp',
      'physical': 'assets/ui_icons/IconPhysical.webp',
      'ether': 'assets/ui_icons/IconEther.webp',
      'auricink': 'assets/ui_icons/IconAuricInk.webp',
      'frost': 'assets/ui_icons/IconFrost.webp'
    };
    return icons[element] || '';
  }

  getPreviewSpecialtyIcon(): string {
    const specialty = this.getPreviewWeaponType().toLowerCase();
    const icons: { [key: string]: string } = {
      'stun': 'assets/ui_icons/IconStun.webp',
      'attack': 'assets/ui_icons/IconAttackType.webp',
      'anomaly': 'assets/ui_icons/IconAnomaly.webp',
      'support': 'assets/ui_icons/IconSupport.webp',
      'rupture': 'assets/ui_icons/IconRupture.webp',
      'defense': 'assets/ui_icons/IconDefense.webp'
    };
    return icons[specialty] || '';
  }

  getPreviewFactionIcon(): string {
    const camp = this.getPreviewCamp();
    
    const icons: { [key: string]: string } = {
      'Cunning Hares': 'assets/ui_icons/IconCampGentleHouse.webp',
      'Victoria Housekeeping Co.': 'assets/ui_icons/IconCampVictoriaHousekeepingCo..webp',
      'Belobog Heavy Industries': 'assets/ui_icons/IconCampBelobogIndustries.webp',
      'Sons of Calydon': 'assets/ui_icons/IconCampSonsOfCalydon.webp',
      'Obol Squad': 'assets/ui_icons/IconCampObols.webp',
      'Criminal Investigation Special Response Team': 'assets/ui_icons/IconCampN.E.P.S..webp',
      'Section 6': 'assets/ui_icons/IconCampH.S.O-S6.webp',
      'Stars of Lyra': 'assets/ui_icons/IconCampStarsOfLyra.webp',
      'Mockingbird': 'assets/ui_icons/IconCampBlackRoot.webp',
      'Yunkui Summit': 'assets/ui_icons/IconCampSuibian.webp',
      'Spook Shack': 'assets/ui_icons/IconCampSpookShack.webp'
    };
    
    return icons[camp] || '';
  }

  getPreviewWeaponType(): string {
    if (!this.previewAgent?.WeaponType) return '';
    return Object.values(this.previewAgent.WeaponType)[0] || '';
  }

  getPreviewCamp(): string {
    if (!this.previewAgent?.Camp) return '';
    return Object.values(this.previewAgent.Camp)[0] || '';
  }

  // ===== SCROLL & DRAG HANDLERS =====

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.isDragging) return;
    
    const speed = 0.8;
    this.scrollList(-event.deltaY * speed);
    
    this.updateVideoOnScroll(Math.abs(event.deltaY));
  }

  onMouseDown(event: MouseEvent) {
    this.startDrag(event.clientY);
  }

  onTouchStart(event: TouchEvent) {
    this.startDrag(event.touches[0].clientY);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.moveDrag(event.clientY);
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    this.moveDrag(event.touches[0].clientY);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onEndDrag() {
    this.isDragging = false;
    this.scheduleVideoPause();
  }

  private startDrag(clientY: number) {
    this.isDragging = true;
    this.hasMoved = false;
    this.startY = clientY;
    this.previousTranslateY = this.currentTranslateY;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private moveDrag(clientY: number) {
    if (!this.isDragging) return;

    if (Math.abs(clientY - this.startY) > 5) {
      this.hasMoved = true;
    }

    const deltaY = clientY - this.startY;
    const newY = this.previousTranslateY + deltaY;
    this.applyScrollPosition(newY);
    
    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastScrollTime;
    if (timeDelta > 0) {
      const scrollDelta = Math.abs(newY - this.lastScrollY);
      this.scrollVelocity = scrollDelta / timeDelta;
      this.updateVideoOnScroll(scrollDelta);
    }
    this.lastScrollTime = currentTime;
    this.lastScrollY = newY;
  }

  private scrollList(deltaY: number) {
    const newY = this.currentTranslateY + deltaY;
    this.applyScrollPosition(newY);
    this.previousTranslateY = this.currentTranslateY;
  }

  private applyScrollPosition(targetY: number) {
    let newY = targetY;

    if (newY > -this.singleSetHeight) {
      newY -= this.singleSetHeight;
      if (this.isDragging) this.previousTranslateY -= this.singleSetHeight;
    }
    else if (newY < -this.singleSetHeight * 3) {
      newY += this.singleSetHeight;
      if (this.isDragging) this.previousTranslateY += this.singleSetHeight;
    }

    this.currentTranslateY = newY;
  }

  // ===== HELPERS =====

  onAgentClick(agent: any) {
    if (!this.hasMoved) {
      this.transitionService.navigateWithTransition(['/agents', agent.id], agent.attribute);
    }
  }

  getTransform(): string {
    return `translateY(${this.currentTranslateY}px)`;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  private preventZoom = (e: WheelEvent) => {
    if (e.ctrlKey) e.preventDefault();
  };

  private preventZoomKeys = (e: KeyboardEvent) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
      e.preventDefault();
    }
  };

  private updateVideoOnScroll(scrollDelta: number) {
    const video = this.scrollVideo?.nativeElement;
    if (!video) return;

    if (this.videoStopTimeout) {
      clearTimeout(this.videoStopTimeout);
      this.videoStopTimeout = null;
    }

    if (video.paused) {
      video.play().catch(() => {});
    }

    const minRate = 0.25;
    const maxRate = 3;
    const normalizedSpeed = Math.min(scrollDelta / 50, 1);
    const playbackRate = minRate + (normalizedSpeed * (maxRate - minRate));
    video.playbackRate = playbackRate;

    this.scheduleVideoPause();
  }

  private scheduleVideoPause() {
    const video = this.scrollVideo?.nativeElement;
    if (!video) return;

    if (this.videoStopTimeout) {
      clearTimeout(this.videoStopTimeout);
    }

    this.videoStopTimeout = setTimeout(() => {
      if (video && !video.paused) {
        video.pause();
      }
    }, 150);
  }
}