import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneWithMetric } from '../../../application/monitoring-store.service';

@Component({
  selector: 'app-zone-metric-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-metric-tooltip.html',
  styleUrls: ['./zone-metric-tooltip.css']
})
export class ZoneMetricTooltipComponent {
  @Input() zoneDetail: ZoneWithMetric | null = null;

  getColorForIntensity(intensity: number): string {
    if (intensity >= 81) return '#ef4444';
    if (intensity >= 61) return '#f97316';
    if (intensity >= 41) return '#eab308';
    if (intensity >= 21) return '#22c55e';
    return '#3b82f6';
  }

  getIntensityLabel(intensity: number): string {
    if (intensity >= 81) return 'Very High';
    if (intensity >= 61) return 'High';
    if (intensity >= 41) return 'Medium-High';
    if (intensity >= 21) return 'Medium';
    return 'Low';
  }

  getZoneIcon(type: string): string {
    switch (type) {
      case 'ACCESS': return '🚪';
      case 'CHECKOUT': return '💰';
      case 'AISLE': return '🛒';
      case 'SECTION': return '📦';
      case 'PROMO': return '⭐';
      default: return '📍';
    }
  }

  getRecommendation(detail: ZoneWithMetric): string {
    if (!detail.metric) return 'No metric data available.';

    const { intensity, conversionRate, traffic, attentionRequired } = detail.metric;

    if (attentionRequired && intensity >= 81) {
      return 'Critical zone: reinforce stock, maintain promotional visibility and assign additional staff.';
    }
    if (intensity >= 81 && conversionRate < 25) {
      return 'High traffic with low conversion. Review product layout and signage.';
    }
    if (intensity >= 61 && conversionRate >= 30) {
      return 'Good performance. Maintain current layout and monitor trends.';
    }
    if (intensity >= 41 && conversionRate < 20) {
      return 'Moderate traffic with low conversion. Consider promotions or relocation of highlighted products.';
    }
    if (intensity < 30 && traffic < 200) {
      return 'Low traffic zone. Evaluate signage and visual attractions to direct flow.';
    }
    if (detail.zone.type === 'CHECKOUT') {
      return 'Operational checkout zone. Optimize wait times and impulse products.';
    }
    if (detail.zone.type === 'ACCESS') {
      return 'Main entry point. Ensure visibility of promotions and customer welcome.';
    }
    return 'Performance within normal parameters. Continue regular monitoring.';
  }
}
