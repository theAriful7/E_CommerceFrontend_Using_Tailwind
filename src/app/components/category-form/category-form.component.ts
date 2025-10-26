import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryRequest } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading category';
        this.loading = false;
        console.error('Error loading category:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const categoryData: CategoryRequest = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
        next: (category) => {
          this.loading = false;
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          this.error = 'Error updating category';
          this.loading = false;
          console.error('Error updating category:', error);
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: (category) => {
          this.loading = false;
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          this.error = 'Error creating category';
          this.loading = false;
          console.error('Error creating category:', error);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched || this.submitted);
  }
}