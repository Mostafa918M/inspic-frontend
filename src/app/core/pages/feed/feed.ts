import { Router } from '@angular/router';
import { Pin, PinItem } from '../../../services/pin';
import { Subscription } from 'rxjs';
import { API_BASE } from '../../../api.token';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

type Vm =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'loaded'; pins: PinItem[]; message: string };

@Component({
  selector: 'app-feed',
  imports: [],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit, OnDestroy {
  apiBase = inject(API_BASE);
  private pin = inject(Pin);
  private router = inject(Router);

  vm: Vm = { state: 'loading' };

  private subFeed?: Subscription;
  private subPopular?: Subscription;

  // Popular section state
  popularLoading = true;
  popularError = '';
  popularMessage = '';
  popularPins: PinItem[] = [];

  ngOnInit() {
    // Feed
    this.vm = { state: 'loading' };
    this.subFeed = this.pin.getPin().subscribe({
      next: (res) => {
        this.vm = {
          state: 'loaded',
          pins: res?.data?.pins ?? [],
          message: res?.message ?? '',
        };
      },
      error: (err) => {
        this.vm = {
          state: 'error',
          error: err?.error?.message || 'Failed to load pins.',
        };
      },
    });

    // Popular
    this.popularLoading = true;
    this.subPopular = this.pin.getPopularPins().subscribe({
      next: (res) => {
        this.popularLoading = false;
        this.popularPins = res?.data?.pins ?? [];
        this.popularMessage = res?.message ?? '';
      },
      error: (err) => {
        this.popularLoading = false;
        this.popularError = err?.error?.message || 'Failed to load popular pins.';
      },
    });
  }

  ngOnDestroy() {
    this.subFeed?.unsubscribe();
    this.subPopular?.unsubscribe();
  }

  onPinClick(pin: PinItem) {
    this.router.navigate(['pin'], { queryParams: { id: pin._id } });
  }

  getMediaUrl(uri: string): string {
    return `${this.apiBase}${uri}`;
  }
}
