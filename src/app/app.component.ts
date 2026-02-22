// Angular import
import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [SpinnerComponent, RouterModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);

  title = 'datta-able';

  // life cycle hook
  ngOnInit() {
    // Temporary test: Show spinner for 2 seconds on load
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
