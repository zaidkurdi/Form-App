import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  data: any;
  user: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.data = this.apiService.sharedData;
    this.apiService.home().subscribe({
      next: (res) => {
        this.user = res;
        console.log(this.user);
      },
    });
  }
}
