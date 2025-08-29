import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap, map, distinctUntilChanged } from 'rxjs/operators';

import { API_BASE } from '../../../api.token';
import { Pin, PinItem } from '../../../services/pin';

type Vm =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'loaded'; pins: PinItem[]; message: string };

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  apiBase = inject(API_BASE);
  private pin = inject(Pin);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vm: Vm = { state: 'loading' };
  private sub?: Subscription;

  ngOnInit() {
    this.vm = { state: 'loading' };

    this.sub = this.route.queryParamMap.pipe(
      map((p) => (p.get('q') ?? '').trim()),
      distinctUntilChanged(),
      switchMap((q) => {
        if (!q) {
          this.vm = {
            state: 'loaded',
            pins: [],
            message: 'No query provided.',
          };
          return of(null);
        }

        this.vm = { state: 'loading' };

        return this.pin.searchPins(q);
      })
    ).subscribe({
      next: (res: any) => {

        const pins = res?.data?.pins ?? [];
        const message = res?.message ?? '';
        this.vm = { state: 'loaded', pins, message };
      },
      error: (err) => {
        this.vm = {
          state: 'error',
          error: err?.error?.message || 'Failed to search pins.',
        };
      },
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getMediaUrl(uri: string): string {
    return `${this.apiBase}${uri}`;
  }
}
