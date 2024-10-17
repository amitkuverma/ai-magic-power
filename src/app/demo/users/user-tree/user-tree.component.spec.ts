import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTreeComponent } from './user-tree.component';

describe('UserTreeComponent', () => {
  let component: UserTreeComponent;
  let fixture: ComponentFixture<UserTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
