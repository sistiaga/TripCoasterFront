// main - MARSISCA - BEGIN 2025-10-11
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatDialogModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userDisplayName = 'Sin iniciar';
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(() => {
      this.userDisplayName = this.authService.getUserDisplayName();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  onUserIconClick(): void {
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
// main - MARSISCA - END 2025-10-11
