import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryFormComponent } from './sub-category-form.component';

describe('SubCategoryFormComponent', () => {
  let component: SubCategoryFormComponent;
  let fixture: ComponentFixture<SubCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
