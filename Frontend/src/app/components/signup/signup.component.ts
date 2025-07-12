import { Attribute, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  name: string = '';
  password: string = '';
  email: string = '';

  errorMessage: string = '';

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.apiService.signUp(form.value).subscribe({
        next: (response: any) => {
          console.log(response);

          if (response.success) {
            this.apiService.sharedData = response.user;
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            this.router.navigate(['home']);
          } else {
            this.errorMessage = response.message;
          }
        },
      });
    }
  }
}
