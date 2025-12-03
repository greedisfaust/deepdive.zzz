import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';

import { App } from './app';
import { Navbar } from './features/navbar/navbar';
import { Homepage } from './features/homepage/homepage';
import { AgentCard } from './features/agents/agent-card/agent-card';
import { AgentDetail } from './features/agents/agent-detail/agent-detail';
import { RouterModule } from '@angular/router';
import { AgentList } from './features/agents/agent-list/agent-list';
import { Calculator } from './features/calculator/calculator';
import { MaterialComponent } from './features/material/material';
import { PageTransition } from './features/page-transition/page-transition';
import { TransitionService } from './core/services/transition.service';
import { Gacha } from './features/gacha/gacha';

@NgModule({
  declarations: [
    App,
    Navbar,
    Homepage,
    AgentCard,
    AgentDetail,
    AgentList,
    Calculator,
    MaterialComponent,  
    PageTransition,
    Gacha
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    TransitionService
  ],
  bootstrap: [App]
})
export class AppModule { }
