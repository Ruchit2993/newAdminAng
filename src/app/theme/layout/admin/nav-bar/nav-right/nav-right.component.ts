// angular import
import { Component } from '@angular/core';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  standalone: true,
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  // public props
  visibleUser = {
    name: 'Admin User',
    avatar: 'assets/images/user/avatar-1.jpg'
  };

  // constructor
  constructor(private router: Router, private ngbDropdownConfig: NgbDropdownConfig) {
    this.ngbDropdownConfig.placement = 'bottom-right';
  }

  logout() {
    // console.log('logout');
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
