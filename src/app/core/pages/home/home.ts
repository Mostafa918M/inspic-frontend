import { Component, inject, OnInit, Pipe } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { RouterLink } from "@angular/router";
import { Pin, PinItem } from '../../../services/pin';
import { NavHeader } from "../../nav-header/nav-header";
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { catchError, map, of, startWith } from 'rxjs';
import { API_BASE } from '../../../api.token';

type Vm =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'loaded'; pins: PinItem[]; message: string };

@Component({
  selector: 'app-home',
  imports: [RouterLink, NavHeader,DatePipe,NgIf,NgFor,AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  apiBase = inject(API_BASE);
   private pin = inject(Pin);
  private router = inject(Router);

  vm$ = this.pin.getPin().pipe(
    map(res => ({
      state: 'loaded',
      pins: res.data.pins,
      message: res.message
    }) as Vm),
    startWith({ state: 'loading' } as Vm),
    catchError(err =>
      of({ state: 'error', error: err?.error?.message || 'Failed to load pins.' } as Vm)
    )
  );

getMediaUrl(uri: string): string {
  return `${this.apiBase}${uri}`;
}

  ngOnInit() {}



}
