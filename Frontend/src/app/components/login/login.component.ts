import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  password: string = '';
  email: string = '';

  errorMessage: string = '';

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.apiService.logIn(form.value).subscribe({
        next: (response: any) => {
          console.log(response);

          if (response.success) {
            this.apiService.sharedData = response.user;
            this.router.navigate(['home']);
          } else {
            this.errorMessage = response.message;
          }
        },
      });
    }
  }
}
