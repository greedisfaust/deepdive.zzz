import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from '../../core/services/transition.service';

@Component({
  selector: 'app-page-transition',
  standalone: false,
  templateUrl: './page-transition.html',
  styleUrl: './page-transition.css'
})
export class PageTransition implements OnInit, OnDestroy {
  isActive: boolean = false;
  primaryColor: string = 'rgba(255, 107, 53, 0.6)';
  secondaryColor: string = 'rgba(255, 150, 50, 0.4)';
  glowColor: string = 'rgba(255, 120, 60, 0.8)';

  private transitionSub: Subscription | null = null;
  private colorSub: Subscription | null = null;

  constructor(private transitionService: TransitionService) {}

  ngOnInit(): void {
    this.transitionSub = this.transitionService.isTransitioning$.subscribe(
      (value: boolean) => {
        this.isActive = value;
      }
    );

    this.colorSub = this.transitionService.currentColors$.subscribe(
      (colors: { primary: string; secondary: string; glow: string }) => {
        this.primaryColor = colors.primary;
        this.secondaryColor = colors.secondary;
        this.glowColor = colors.glow;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.transitionSub) {
      this.transitionSub.unsubscribe();
    }
    if (this.colorSub) {
      this.colorSub.unsubscribe();
    }
  }
}
