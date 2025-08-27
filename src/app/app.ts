import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignIn } from "./auth/sign-in/sign-in";
import { SignUp } from "./auth/sign-up/sign-up";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('inspic');
}
