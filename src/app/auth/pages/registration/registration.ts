// angular import
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { email, Field, form, minLength, required } from '@angular/forms/signals';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../services/auth.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration {
  private cd = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  submitted = signal(false);
  error = signal('');
  showPassword = signal(false);

  registerModel = signal<{ email: string; password: string; confirmPassword: string; /* username: string */ }>({
    email: '',
    password: '',
    confirmPassword: '',
    // username: ''
  });

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });
    required(schemaPath.confirmPassword, { message: 'Confirm Password is required' });
    // required(schemaPath.username, { message: 'Username is required' });
  });

  onSubmit(event: Event) {
    this.submitted.set(true);
    this.error.set('');
    event.preventDefault();

    if (!this.registerForm.email().invalid() &&
      !this.registerForm.password().invalid() &&
      !this.registerForm.confirmPassword().invalid() &&
      !this.passwordsMismatch()
        /* && !this.registerForm.username().invalid() */) {
      const credentials = this.registerModel();
      this.authService.register(credentials).subscribe({
        next: (response) => {
          console.log('Registration Success:', response);
          this.toastr.success('Registration Successful', 'Success');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Registration Error:', err);
          this.error.set('Registration failed. Please try again.');
          this.toastr.error('Registration failed. Please try again.', 'Error');
          this.cd.detectChanges();
        }
      });
    } else {
      // logic to show errors if needed
      this.toastr.error('Please check the form for errors.', 'Validation Error');
    }
    this.cd.detectChanges();
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  passwordsMismatch() {
    const { password, confirmPassword } = this.registerModel();
    return password !== confirmPassword;
  }
}
