import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from 'src/app/models/category.model';
import { SubCategoryResponse } from 'src/app/models/sub-category.model';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class SubCategoryListComponent implements OnInit{
subCategories: SubCategoryResponse[] = [];
  categories: CategoryResponse[] = [];
  filteredSubCategories: SubCategoryResponse[] = [];
  selectedCategoryId: number = 0;
  loading = false;
  error = '';

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();
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

  loadSubCategories(): void {
    this.loading = true;
    this.subCategoryService.getAllSubCategories().subscribe({
      next: (subCategories) => {
        this.subCategories = subCategories;
        this.filteredSubCategories = subCategories;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading sub-categories';
        this.loading = false;
        console.error('Error loading sub-categories:', error);
      }
    });
  }

  filterByCategory(): void {
    if (this.selectedCategoryId === 0) {
      this.filteredSubCategories = this.subCategories;
    } else {
      this.subCategoryService.getSubCategoriesByCategory(this.selectedCategoryId).subscribe({
        next: (subCategories) => {
          this.filteredSubCategories = subCategories;
        },
        error: (error) => {
          this.error = 'Error filtering sub-categories';
          console.error('Error filtering sub-categories:', error);
        }
      });
    }
  }

  deleteSubCategory(id: number): void {
    if (confirm('Are you sure you want to delete this sub-category?')) {
      this.subCategoryService.deleteSubCategory(id).subscribe({
        next: () => {
          this.subCategories = this.subCategories.filter(sc => sc.id !== id);
          this.filteredSubCategories = this.filteredSubCategories.filter(sc => sc.id !== id);
        },
        error: (error) => {
          this.error = 'Error deleting sub-category';
          console.error('Error deleting sub-category:', error);
        }
      });
    }
  }
}
