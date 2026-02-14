// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  templateUrl: './landing-navbar.component.html',
  styleUrl: './landing-navbar.component.scss'
})
export class LandingNavbarComponent {
  isMobileMenuOpen = false;
  isScrolled = false;

  navLinks = [
    { label: 'LANDING.NAV.HOME', fragment: '' },
    { label: 'LANDING.NAV.FEATURES', fragment: 'features' },
    { label: 'LANDING.NAV.TESTIMONIALS', fragment: 'testimonials' }
  ];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  scrollToSection(fragment: string): void {
    this.closeMobileMenu();
    if (!fragment) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openLoginModal(): void {
    this.closeMobileMenu();
    this.dialog.open(LoginModalComponent, {
      width: '450px',
      disableClose: false,
      autoFocus: true
    });
  }
}
// feature/landing-page - MARSISCA - END 2026-02-13
