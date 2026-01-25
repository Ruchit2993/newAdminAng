import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingPage } from './listing-page';

describe('ListingPage', () => {
  let component: ListingPage;
  let fixture: ComponentFixture<ListingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
