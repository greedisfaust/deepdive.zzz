import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Homepage } from './features/homepage/homepage';
import { AgentDetail } from './features/agents/agent-detail/agent-detail';
import { AgentList } from './features/agents/agent-list/agent-list';
import { Calculator } from './features/calculator/calculator';
import { Gacha } from './features/gacha/gacha';

const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'agents/:id', component: AgentDetail },
  { path: 'agents', component: AgentList },
  { path: 'calculator', component: Calculator },
  { path: 'gacha', component: Gacha },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
