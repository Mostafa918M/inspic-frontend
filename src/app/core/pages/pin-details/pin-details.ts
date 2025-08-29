import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pin, PinItem } from '../../../services/pin';
import { API_BASE } from '../../../api.token';
import { Subscription } from 'rxjs';

const LIKED_KEY = 'liked_pins_v1';

type Vm =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'loaded'; pins: PinItem[]; message: string };

@Component({
  selector: 'app-pin-details',
  imports: [],
  templateUrl: './pin-details.html',
  styleUrl: './pin-details.css'
})
export class PinDetails implements OnInit {
 private route = inject(ActivatedRoute);
 private router = inject(Router);
  private pinService = inject(Pin);
  apiBase = inject(API_BASE);
    vm: Vm = { state: 'loading' };
private sub?: Subscription;
  loading = false;
  pin: any = null;

  private liked = new Set<string>();
  liking: Record<string, boolean> = {};

  ngOnInit() {
    try {
      const raw = localStorage.getItem(LIKED_KEY);
      if (raw) this.liked = new Set<string>(JSON.parse(raw));
    } catch {}

    const id = this.route.snapshot.queryParamMap.get('id') ?? '';
    this.loading = true;

    this.pinService.getPinById(id).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.pin = res?.data?.pin ?? null;
         if (this.pin && typeof this.pin.likeCount !== 'number') {
          this.pin.likeCount = Array.isArray(this.pin.likers) ? this.pin.likers.length : 0;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
    

     this.vm = { state: 'loading' };

    this.sub = this.pinService.getPin().subscribe({
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
  }
  ngOnDestroy() {
  this.sub?.unsubscribe();
}
get safePins() {
  return this.vm.state === 'loaded' ? this.vm.pins : [];
}

 private persistLiked() {
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify([...this.liked]));
    } catch {}
  }

  isLiked(id: string | undefined): boolean {
    return !!id && this.liked.has(id);
  }

  onLike(pin: any): void {
    if (!pin?._id || this.liking[pin._id]) return;
    this.liking[pin._id] = true;

    const currentlyLiked = this.isLiked(pin._id);

    if (!currentlyLiked) {
      this.liked.add(pin._id);
      pin.likeCount = (pin.likeCount ?? 0) + 1;
      this.persistLiked();

      this.pinService.likePin(pin._id).subscribe({
        next: (res) => {
          // sync with server
          pin.likeCount = res?.data?.likeCount ?? pin.likeCount;
        },
        error: () => {
          this.liked.delete(pin._id);
          pin.likeCount = Math.max(0, (pin.likeCount ?? 0) - 1);
          this.persistLiked();
        },
        complete: () => (this.liking[pin._id] = false),
      });
    } else {
      this.liked.delete(pin._id);
      pin.likeCount = Math.max(0, (pin.likeCount ?? 0) - 1);
      this.persistLiked();

      this.pinService.unlikePin(pin._id).subscribe({
        next: (res) => {
          pin.likeCount = res?.data?.likeCount ?? pin.likeCount;
        },
        error: () => {
          this.liked.add(pin._id);
          pin.likeCount = (pin.likeCount ?? 0) + 1;
          this.persistLiked();
        },
        complete: () => (this.liking[pin._id] = false),
      });
    }
  }

  onBack?(): void {
    history.back();
  }
    onShare?(pin: any): void {
      console.log('share', pin);
    }
    onSave?(pin: any): void {
      console.log('save', pin);
    }
    onZoom?(pin: any): void {
      console.log('zoom', pin);
    }

  onComments(pin: any): void {
    console.log('comments', pin);
  }
 
  onDownload(pin: any): void {
      if (!pin?._id) return;

  this.pinService.downloadPin(pin._id).subscribe({
    next: (blob) => {
      const filename =
        pin.media?.originalName ||
        pin.media?.filename ||
        `${(pin?.title || 'pin').replace(/[^\w\-]+/g, '_')}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed', err);
    },
  });
  }


}
