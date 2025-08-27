import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-box',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './form-box.html',
  styleUrl: './form-box.css'
})
export class FormBox {
router = inject(Router);
  is(path: string) { return this.router.url.includes(path); }
}
