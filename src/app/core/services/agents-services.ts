import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { Agent } from '../models/agents.model';
import { AgentIndex } from '../models/agents-index.model';
import { AGENT_INDEX } from '../data/agents-index';



@Injectable({
  providedIn: 'root',
})

export class AgentsServices {
  
  private apiUrl = 'https://api.hakush.in/zzz/data/en/character';
  private corsProxy = 'https://corsproxy.io/?';

  constructor(private http: HttpClient) {}
  
  getAgentIndex() {
    return AGENT_INDEX;
  }

  getAgentByID(id: string): Observable<Agent> {
    // Use proxy to bypass CORS
    const url = `${this.apiUrl}/${id}.json`;
    return this.http.get<Agent>(this.corsProxy + encodeURIComponent(url));
  }
  
  getAgentByRarity(rarity: 'A' | 'S') {
    return AGENT_INDEX.filter(agent => agent.rarity === rarity);
  }
  
  getAgentBySearch(query: string) {
    return AGENT_INDEX.filter(agent => 
      agent.name.toLowerCase().includes(query.toLowerCase())
    );
  }


}

export function getRarityDisplay(rarity: number): 'S' | 'A' {
  return rarity === 5 ? 'S' : 'A';
}