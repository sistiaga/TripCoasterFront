// main - MARSISCA - BEGIN 2025-10-11
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout-confirmation',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './logout-confirmation.component.html',
  styleUrl: './logout-confirmation.component.scss'
})
export class LogoutConfirmationComponent {
  constructor(private dialogRef: MatDialogRef<LogoutConfirmationComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// main - MARSISCA - END 2025-10-11
