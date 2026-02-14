// feature/landing-page - MARSISCA - BEGIN 2026-02-13
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userDisplayName = '';
  isLoggedIn = false;
  isMobileMenuOpen = false;
  isScrolled = false;
  private userSubscription?: Subscription;

  navLinks: NavLink[] = [
    { label: 'HEADER.MYTRIPS', route: '/general' },
    { label: 'HEADER.CALENDAR', route: '/calendar' },
    { label: 'HEADER.MAP', route: '/maps' },
    { label: 'HEADER.SETTINGS', route: '/settings' }
  ];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.userDisplayName = this.authService.getUserDisplayName();
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onUserIconClick(): void {
    this.closeMobileMenu();
    if (this.authService.isLoggedIn()) {
      this.openLogoutConfirmation();
    } else {
      this.openLoginModal();
    }
  }

  private openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '450px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Login successful');
      }
    });
  }

  private openLogoutConfirmation(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
// feature/landing-page - MARSISCA - END 2026-02-13
