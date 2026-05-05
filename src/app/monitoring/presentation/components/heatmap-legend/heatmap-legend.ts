import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heatmap-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap-legend.html',
  styleUrls: ['./heatmap-legend.css']
})
export class HeatmapLegendComponent {
  readonly levels = [
    { label: 'Low', color: '#3b82f6', range: '0–20' },
    { label: 'Medium', color: '#22c55e', range: '21–40' },
    { label: 'Medium-High', color: '#eab308', range: '41–60' },
    { label: 'High', color: '#f97316', range: '61–80' },
    { label: 'Very High', color: '#ef4444', range: '81–100' }
  ];
}
