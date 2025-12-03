import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface ColorSet {
  primary: string;
  secondary: string;
  glow: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  private isTransitioning = new BehaviorSubject<boolean>(false);
  public isTransitioning$ = this.isTransitioning.asObservable();

  private defaultColors: ColorSet = {
    primary: 'rgba(255, 107, 53, 0.6)',
    secondary: 'rgba(255, 150, 50, 0.4)',
    glow: 'rgba(255, 120, 60, 0.8)'
  };

  private currentColors = new BehaviorSubject<ColorSet>(this.defaultColors);
  public currentColors$ = this.currentColors.asObservable();

  private colorMap: { [key: string]: ColorSet } = {
    'electric': {
      primary: 'rgba(80, 180, 255, 0.6)',
      secondary: 'rgba(40, 140, 220, 0.4)',
      glow: 'rgba(100, 200, 255, 0.8)'
    },
    'fire': {
      primary: 'rgba(255, 100, 50, 0.6)',
      secondary: 'rgba(255, 150, 50, 0.4)',
      glow: 'rgba(255, 120, 50, 0.8)'
    },
    'ice': {
      primary: 'rgba(130, 210, 255, 0.6)',
      secondary: 'rgba(90, 180, 240, 0.4)',
      glow: 'rgba(160, 230, 255, 0.8)'
    },
    'physical': {
      primary: 'rgba(255, 200, 80, 0.6)',
      secondary: 'rgba(255, 170, 60, 0.4)',
      glow: 'rgba(255, 220, 100, 0.8)'
    },
    'ether': {
      primary: 'rgba(255, 80, 180, 0.6)',
      secondary: 'rgba(220, 60, 150, 0.4)',
      glow: 'rgba(255, 120, 200, 0.8)'
    }
  };

  constructor(private router: Router) {}

  navigateWithTransition(route: string[], attribute?: string): void {
    if (this.isTransitioning.value) return;

    const attr = attribute?.toLowerCase() || '';
    const colors = this.colorMap[attr] || this.defaultColors;
    this.currentColors.next(colors);

    this.isTransitioning.next(true);

    // Navigate at the midpoint when arrow fully covers screen (~500ms)
    setTimeout(() => {
      this.router.navigate(route);
    }, 500);

    // End transition after animation completes
    setTimeout(() => {
      this.isTransitioning.next(false);
    }, 1200);
  }
}
