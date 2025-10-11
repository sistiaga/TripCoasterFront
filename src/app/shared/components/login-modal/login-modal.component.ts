// main - MARSISCA - BEGIN 2025-10-11
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginModalComponent>
  ) {
    this.loginForm = this.fb.group({
      emailOrAlias: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      emailOrAlias: this.loginForm.value.emailOrAlias?.trim(),
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.loginForm.reset();
          this.dialogRef.close(true);
        } else {
          this.errorMessage = response.error || response.message || 'Error during login';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error connecting to server';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getEmailOrAliasError(): string {
    const control = this.loginForm.get('emailOrAlias');
    if (control?.hasError('required')) {
      return 'Email or alias is required';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    }
    return '';
  }
}
// main - MARSISCA - END 2025-10-11
