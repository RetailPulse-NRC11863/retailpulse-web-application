import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionStore } from '../../../application/subscription-store.service';
import { SubscriptionCardComponent } from '../../components/subscription-card/subscription-card';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent],
  templateUrl: './subscription-page.html',
  styleUrls: ['./subscription-page.css']
})
export class SubscriptionPageComponent implements OnInit {
  store = inject(SubscriptionStore);

  ngOnInit() {
    this.store.loadPlans();
  }
}
