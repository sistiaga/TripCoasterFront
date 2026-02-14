// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingNavbarComponent } from '../../shared/components/landing-navbar/landing-navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, LandingNavbarComponent, FooterComponent],
  template: `
    <app-landing-navbar></app-landing-navbar>
    <main class="public-layout__main">
      <router-outlet />
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    // feature/landing-page - MARSISCA - BEGIN 2026-02-13
    .public-layout__main {
      padding-top: 72px;
    }
    // feature/landing-page - MARSISCA - END 2026-02-13
  `]
})
export class PublicLayoutComponent {}
// feature/landing-page - MARSISCA - END 2026-02-13
