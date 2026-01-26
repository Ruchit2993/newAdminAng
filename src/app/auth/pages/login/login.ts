import { ChangeDetectorRef, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { email, Field, form, minLength, required } from '@angular/forms/signals';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, SharedModule, Field],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private cd = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  submitted = signal(false);
  error = signal('');
  showPassword = signal(false);

  loginModal = signal<{ email: string; password: string }>({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModal, (schemaPath) => {
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
    minLength(schemaPath.password, 8);
  });

  isFormInvalid = computed(() => {
    return this.loginForm.email().invalid() || this.loginForm.password().invalid();
  });

  onSubmit(event: Event) {
    this.submitted.set(true);
    this.error.set('');
    event.preventDefault();

    if (!this.loginForm.email().invalid() && !this.loginForm.password().invalid()) {
      const credentials = this.loginModal();
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          // console.log('Login', response);
          const token = response.token || response.data?.token;
          if (token) {
            localStorage.setItem('token', token);
          }
          this.toastr.success('Login Successful', 'Success');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          // console.error('Login', err);
          this.error.set('Login failed. Please check your credentials.');
          this.toastr.error('Login failed. Please check your credentials.', 'Error');
          this.cd.detectChanges();
        }
      });
    }

    this.cd.detectChanges();
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
