import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AgentsServices } from '../../../core/services/agents-services';
import { AgentList } from './agent-list';
import { Component } from '@angular/core';

@Component({ selector: 'app-agent-card', template: '' })
class AgentCardStub {}

class AgentsServicesStub {
  getAgents() {
    return of([]);
  }
}

describe('AgentList', () => {
  let component: AgentList;
  let fixture: ComponentFixture<AgentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentList, AgentCardStub],
      providers: [{ provide: AgentsServices, useClass: AgentsServicesStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
