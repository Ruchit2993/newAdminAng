// angular import
import { Component, inject } from '@angular/core';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
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
  constructor() {
    const config = inject(NgbDropdownConfig);

    config.placement = 'bottom-right';
  }

  logout() {
    // console.log('logout');
    localStorage.clear();
  }
}
