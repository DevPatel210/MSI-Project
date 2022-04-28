import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadProjectsComponent } from './bulk-upload-projects.component';

describe('BulkUploadProjectsComponent', () => {
  let component: BulkUploadProjectsComponent;
  let fixture: ComponentFixture<BulkUploadProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
