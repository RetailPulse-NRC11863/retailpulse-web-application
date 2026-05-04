import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatmapZone } from '../../../domain/model/heatmap-zone.entity';

@Component({
  selector: 'app-heatmap-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap-panel.html',
  styleUrls: ['./heatmap-panel.css']
})
export class HeatmapPanelComponent implements OnChanges {
  @Input({ required: true }) heatmapZones: HeatmapZone[] = [];
  
  // A simple grid to represent the store
  grid: { id: string, intensity: number }[] = [];

  ngOnChanges() {
    this.generateGrid();
  }

  generateGrid() {
    // Generate a simple 4x3 grid for the heatmap visualization
    // Mapping existing zones to grid spots based on their intensity
    this.grid = Array(12).fill(null).map((_, index) => {
      // Very naive mapping just for visual effect
      const zone = this.heatmapZones.find(z => 
        (index === 2 && z.zoneId === 'Z001') || 
        (index === 6 && z.zoneId === 'Z002')
      );
      
      return {
        id: `cell-${index}`,
        intensity: zone ? zone.intensity : Math.random() * 0.3 // Default low intensity
      };
    });
  }

  getColorForIntensity(intensity: number): string {
    if (intensity > 0.8) return 'var(--rp-color-danger)';
    if (intensity > 0.5) return 'var(--rp-color-warning)';
    if (intensity > 0.2) return 'var(--rp-color-success)';
    return 'var(--rp-color-surface-hover)';
  }
}
