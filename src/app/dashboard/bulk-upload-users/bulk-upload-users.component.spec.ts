import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadUsersComponent } from './bulk-upload-users.component';

describe('BulkUploadUsersComponent', () => {
  let component: BulkUploadUsersComponent;
  let fixture: ComponentFixture<BulkUploadUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
