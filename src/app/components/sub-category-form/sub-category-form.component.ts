import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryResponse } from 'src/app/models/category.model';
import { SubCategoryRequest } from 'src/app/models/sub-category.model';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.css']
})
export class SubCategoryFormComponent implements OnInit, OnDestroy {
  subcategoryForm: FormGroup;
  categories: CategoryResponse[] = [];
  isEditMode = false;
  subcategoryId?: number;
  loading = false;
  submitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subcategoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      categoryId: ['', Validators.required]
    });
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.loading = false;
        }
      });
  }

  private checkEditMode(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.isEditMode = true;
          this.subcategoryId = +id;
          this.loadSubcategory(this.subcategoryId);
        }
      });
  }

  private loadSubcategory(id: number): void {
    this.loading = true;
    this.subCategoryService.getSubCategoryById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subcategory) => {
          this.subcategoryForm.patchValue({
            name: subcategory.name,
            description: subcategory.description || '',
            categoryId: subcategory.categoryId
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading subcategory:', error);
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.subcategoryForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const subCategoryRequest: SubCategoryRequest = this.subcategoryForm.value;

    if (this.isEditMode && this.subcategoryId) {
      this.updateSubcategory(subCategoryRequest);
    } else {
      this.createSubcategory(subCategoryRequest);
    }
  }

  private createSubcategory(request: SubCategoryRequest): void {
    this.subCategoryService.createSubCategory(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.router.navigate(['/subcategories']);
        },
        error: (error) => {
          console.error('Error creating subcategory:', error);
          this.submitting = false;
        }
      });
  }

  private updateSubcategory(request: SubCategoryRequest): void {
    if (!this.subcategoryId) return;

    this.subCategoryService.updateSubCategory(this.subcategoryId, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.router.navigate(['/subcategories']);
        },
        error: (error) => {
          console.error('Error updating subcategory:', error);
          this.submitting = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/subcategories']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.subcategoryForm.controls).forEach(key => {
      const control = this.subcategoryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  get name() { return this.subcategoryForm.get('name'); }
  get description() { return this.subcategoryForm.get('description'); }
  get categoryId() { return this.subcategoryForm.get('categoryId'); }

  get title(): string {
    return this.isEditMode ? 'Edit Subcategory' : 'Create Subcategory';
  }

  get submitButtonText(): string {
    return this.submitting 
      ? (this.isEditMode ? 'Updating...' : 'Creating...') 
      : (this.isEditMode ? 'Update Subcategory' : 'Create Subcategory');
  }
}
