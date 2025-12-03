import { Component, Input } from '@angular/core';

export interface Material {
  id: string;
  name: string;
  rarity: number;
  icon?: string;
  quantity: number;
}

@Component({
  selector: 'app-material',
  standalone: false,
  templateUrl: './material.html',
  styleUrl: './material.css',
})
export class MaterialComponent {
  @Input() materialId: string = '';
  @Input() quantity: number = 0;
  @Input() showLabel: boolean = true;
  
  materialData: Material | null = null;

  ngOnInit() {
    this.loadMaterialData();
  }

  ngOnChanges() {
    if (this.materialId) {
      this.loadMaterialData();
    }
  }

  loadMaterialData() {
    // TODO: Load from materials index or API
    // For now, create a placeholder
    this.materialData = {
      id: this.materialId,
      name: `Material ${this.materialId}`,
      rarity: 1,
      quantity: this.quantity
    };
  }

  getMaterialIcon(): string {
    return this.materialData?.icon || `/assets/materials/${this.materialId}.png`;
  }

  getRarityClass(): string {
    if (!this.materialData) return 'rarity-1';
    return `rarity-${this.materialData.rarity}`;
  }
}
