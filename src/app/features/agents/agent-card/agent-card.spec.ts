import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AgentCard } from './agent-card';

describe('AgentCard', () => {
  let component: AgentCard;
  let fixture: ComponentFixture<AgentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentCard],
      imports: [RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
