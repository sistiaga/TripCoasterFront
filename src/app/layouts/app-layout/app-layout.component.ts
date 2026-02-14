// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet />
    </main>
    <app-footer></app-footer>
  `
})
export class AppLayoutComponent {}
// feature/landing-page - MARSISCA - END 2026-02-13
