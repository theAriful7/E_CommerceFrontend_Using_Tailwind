import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryResponse } from 'src/app/models/category.model';
import { ProductSpecification, ProductRequest } from 'src/app/models/product.model';
import { SubCategoryResponse } from 'src/app/models/sub-category.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: CategoryResponse[] = [];
  subCategories: SubCategoryResponse[] = [];
  isEditMode = false;
  productId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      discount: [0],
      brand: [''],
      imageUrls: this.fb.array([]),
      specifications: this.fb.array([])
    });
  }

  get imageUrls(): FormArray {
    return this.productForm.get('imageUrls') as FormArray;
  }

  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
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

  onCategoryChange(): void {
    const categoryId = this.productForm.get('categoryId')?.value;
    if (categoryId) {
      this.subCategoryService.getSubCategoriesByCategory(categoryId).subscribe({
        next: (subCategories) => {
          this.subCategories = subCategories;
          // Reset sub-category when category changes
          this.productForm.patchValue({ subCategoryId: '' });
        },
        error: (error) => {
          console.error('Error loading sub-categories:', error);
        }
      });
    } else {
      this.subCategories = [];
      this.productForm.patchValue({ subCategoryId: '' });
    }
  }

  addImageUrl(url: string = ''): void {
    this.imageUrls.push(this.fb.control(url, Validators.required));
  }

  removeImageUrl(index: number): void {
    this.imageUrls.removeAt(index);
  }

  addSpecification(key: string = '', value: string = '', displayOrder: number = 0): void {
    this.specifications.push(this.fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required],
      displayOrder: [displayOrder]
    }));
  }

  removeSpecification(index: number): void {
    this.specifications.removeAt(index);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.populateForm(product);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading product';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  populateForm(product: any): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      discount: product.discount || 0,
      brand: product.brand || '',
      categoryId: '', // You'll need to load this from your API
      subCategoryId: product.subCategoryId || ''
    });

    // Load categories and sub-categories for the product
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      // Find and set the correct category
      // This might require additional API endpoint to get category by product
    });

    // Clear existing arrays
    while (this.imageUrls.length !== 0) {
      this.imageUrls.removeAt(0);
    }
    while (this.specifications.length !== 0) {
      this.specifications.removeAt(0);
    }

    // Populate image URLs
    product.imageUrls.forEach((url: string) => this.addImageUrl(url));

    // Populate specifications
    product.specifications.forEach((spec: ProductSpecification) => 
      this.addSpecification(spec.key, spec.value, spec.displayOrder)
    );
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const productData: ProductRequest = this.productForm.value;

    // For demo purposes - you should get vendorId from authentication service
    const vendorId = 1; // Replace with actual vendor ID from auth service

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData, vendorId).subscribe({
        next: (product) => {
          this.loading = false;
          this.router.navigate(['/products', product.id]);
        },
        error: (error) => {
          this.error = 'Error updating product';
          this.loading = false;
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.createProduct(productData, vendorId).subscribe({
        next: (product) => {
          this.loading = false;
          this.router.navigate(['/products', product.id]);
        },
        error: (error) => {
          this.error = 'Error creating product';
          this.loading = false;
          console.error('Error creating product:', error);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched || this.submitted);
  }
}
