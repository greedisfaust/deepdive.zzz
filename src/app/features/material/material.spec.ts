import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialComponent } from './material';

describe('MaterialComponent', () => {
  let component: MaterialComponent;
  let fixture: ComponentFixture<MaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load material data on init', () => {
    component.materialId = '110001';
    component.quantity = 10;
    component.ngOnInit();
    
    expect(component.materialData).toBeTruthy();
    expect(component.materialData?.id).toBe('110001');
    expect(component.materialData?.quantity).toBe(10);
  });

  it('should return correct rarity class', () => {
    component.materialData = {
      id: '110001',
      name: 'Test Material',
      rarity: 3,
      quantity: 5
    };
    
    expect(component.getRarityClass()).toBe('rarity-3');
  });

  it('should return default rarity class when no material data', () => {
    component.materialData = null;
    expect(component.getRarityClass()).toBe('rarity-1');
  });

  it('should generate material icon path', () => {
    component.materialId = '110001';
    component.materialData = {
      id: '110001',
      name: 'Test Material',
      rarity: 1,
      quantity: 1
    };
    
    const iconPath = component.getMaterialIcon();
    expect(iconPath).toContain('110001');
  });
});
