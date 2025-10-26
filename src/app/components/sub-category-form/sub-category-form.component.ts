import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryResponse } from 'src/app/models/category.model';
import { SubCategoryRequest } from 'src/app/models/sub-category.model';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-sub-category-form',
  templateUrl: './sub-category-form.component.html',
  styleUrls: ['./sub-category-form.component.css']
})
export class SubCategoryFormComponent implements OnInit {
  subCategoryForm: FormGroup;
  categories: CategoryResponse[] = [];
  isEditMode = false;
  subCategoryId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subCategoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.subCategoryId = +params['id'];
        this.loadSubCategory(this.subCategoryId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      categoryId: ['', Validators.required]
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadSubCategory(id: number): void {
    this.loading = true;
    this.subCategoryService.getSubCategoryById(id).subscribe({
      next: (subCategory) => {
        this.subCategoryForm.patchValue({
          name: subCategory.name,
          description: subCategory.description,
          categoryId: subCategory.categoryId
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading sub-category';
        this.loading = false;
        console.error('Error loading sub-category:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.subCategoryForm.invalid) {
      return;
    }

    this.loading = true;
    const subCategoryData: SubCategoryRequest = this.subCategoryForm.value;

    if (this.isEditMode && this.subCategoryId) {
      this.subCategoryService.updateSubCategory(this.subCategoryId, subCategoryData).subscribe({
        next: (subCategory) => {
          this.loading = false;
          this.router.navigate(['/sub-categories']);
        },
        error: (error) => {
          this.error = 'Error updating sub-category';
          this.loading = false;
          console.error('Error updating sub-category:', error);
        }
      });
    } else {
      this.subCategoryService.createSubCategory(subCategoryData).subscribe({
        next: (subCategory) => {
          this.loading = false;
          this.router.navigate(['/sub-categories']);
        },
        error: (error) => {
          this.error = 'Error creating sub-category';
          this.loading = false;
          console.error('Error creating sub-category:', error);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.subCategoryForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched || this.submitted);
  }
}
