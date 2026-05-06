import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './product-search-box.html',
  styleUrls: ['./product-search-box.css']
})
export class ProductSearchBoxComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  query = '';
  readonly Search = Search;
  readonly X = X;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.search.emit(searchTerm);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onModelChange(newQuery: string) {
    this.query = newQuery;
    if (this.query.trim()) {
      this.searchSubject.next(this.query);
    } else {
      this.onClear();
    }
  }

  onSearch() {
    if (this.query.trim()) {
      this.search.emit(this.query);
    }
  }

  onClear() {
    this.query = '';
    this.clear.emit();
  }
}
