import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoryResponse } from 'src/app/models/category.model';
import { SubCategoryResponse } from 'src/app/models/sub-category.model';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class SubCategoryListComponent implements OnInit, OnDestroy {
  subcategories: SubCategoryResponse[] = [];
  filteredSubcategories: SubCategoryResponse[] = [];
  loading = false;
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private subCategoryService: SubCategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubcategories();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSubcategories(): void {
    this.loading = true;
    this.subCategoryService.getAllSubCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subcategories) => {
          this.subcategories = subcategories;
          this.filteredSubcategories = subcategories;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading subcategories:', error);
          this.loading = false;
        }
      });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.filterSubcategories(searchTerm || '');
      });
  }

  private filterSubcategories(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredSubcategories = this.subcategories;
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredSubcategories = this.subcategories.filter(subcategory =>
      subcategory.name.toLowerCase().includes(term) ||
      subcategory.categoryName.toLowerCase().includes(term) ||
      (subcategory.description && subcategory.description.toLowerCase().includes(term))
    );
  }

  onCreateSubcategory(): void {
    this.router.navigate(['/sub-categories/new']);
  }

  onEditSubcategory(id: number): void {
    this.router.navigate(['/subcategories/edit', id]);
  }

  onDeleteSubcategory(subcategory: SubCategoryResponse): void {
    if (confirm(`Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`)) {
      this.subCategoryService.deleteSubCategory(subcategory.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.subcategories = this.subcategories.filter(sc => sc.id !== subcategory.id);
            this.filterSubcategories(this.searchControl.value || '');
          },
          error: (error) => {
            console.error('Error deleting subcategory:', error);
            alert('Error deleting subcategory. Please try again.');
          }
        });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTotalCount(): number {
    return this.subcategories.length;
  }

  getFilteredCount(): number {
    return this.filteredSubcategories.length;
  }
}