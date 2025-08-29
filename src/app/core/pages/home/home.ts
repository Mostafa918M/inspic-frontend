import { Component, inject, OnInit, Pipe } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { RouterLink } from "@angular/router";
import {  PinItem } from '../../../services/pin';
import { NavHeader } from "../../nav-header/nav-header";
import { RouterOutlet } from "@angular/router";


type Vm =
  | { state: 'loading' }
  | { state: 'error'; error: string }
  | { state: 'loaded'; pins: PinItem[]; message: string };

@Component({
  selector: 'app-home',
  imports: [RouterLink, NavHeader, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
}
