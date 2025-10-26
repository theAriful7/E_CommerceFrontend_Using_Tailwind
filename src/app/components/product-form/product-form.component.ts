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

  // Color and Size Management
  predefinedColors: { name: string; value: string }[] = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Brown', value: '#92400E' },
    { name: 'Orange', value: '#EA580C' },
    { name: 'Navy', value: '#1E3A8A' }
  ];

  predefinedSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  customColorName = '';
  customColorValue = '#000000';
  customSize = '';

  specificationTypes: string[] = [
    'Material',
    'Fabric',
    'Care Instructions',
    'Country of Origin',
    'Warranty',
    'Battery Life',
    'Screen Size',
    'Processor',
    'RAM',
    'Storage',
    'Connectivity',
    'Compatibility'
  ];

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

    // Add initial image URL field
    if (this.imageUrls.length === 0) {
      this.addImageUrl();
    }

    // Add initial specification field
    if (this.specifications.length === 0) {
      this.addSpecification();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      vendorId: ['', [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      discount: [0],
      brand: [''],
      weight: [''],
      length: [''],
      width: [''],
      height: [''],
      shippingClass: ['standard'],
      manageStock: [true],
      seoTitle: [''],
      metaDescription: [''],
      status: ['draft'],
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

  // Color Management
  toggleColor(colorName: string): void {
    const index = this.selectedColors.indexOf(colorName);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(colorName);
    }
  }

  addCustomColor(): void {
    if (this.customColorName && this.customColorValue) {
      this.predefinedColors.push({
        name: this.customColorName,
        value: this.customColorValue
      });
      this.selectedColors.push(this.customColorName);
      this.customColorName = '';
      this.customColorValue = '#000000';
    }
  }

  // Size Management
  toggleSize(size: string): void {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1);
    } else {
      this.selectedSizes.push(size);
    }
  }

  addCustomSize(): void {
    if (this.customSize && !this.predefinedSizes.includes(this.customSize)) {
      this.predefinedSizes.push(this.customSize);
      this.selectedSizes.push(this.customSize);
      this.customSize = '';
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Error loading categories';
      }
    });
  }

  onCategoryChange(): void {
    const categoryId = this.productForm.get('categoryId')?.value;
    if (categoryId) {
      this.subCategoryService.getSubCategoriesByCategory(categoryId).subscribe({
        next: (subCategories) => {
          this.subCategories = subCategories;
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
    this.imageUrls.push(this.fb.control(url, [Validators.pattern('https?://.+')]));
  }

  removeImageUrl(index: number): void {
    this.imageUrls.removeAt(index);
  }

  addSpecification(key: string = '', value: string = ''): void {
    this.specifications.push(this.fb.group({
      key: [key],
      value: [value]
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
    // Populate basic form fields
    this.productForm.patchValue({
      vendorId: product.vendorId || '',
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      discount: product.discount || 0,
      brand: product.brand || '',
      categoryId: product.categoryId || '',
      subCategoryId: product.subCategoryId || '',
      sku: product.sku || '',
      status: product.status || 'draft',
      weight: product.weight || '',
      length: product.length || '',
      width: product.width || '',
      height: product.height || '',
      shippingClass: product.shippingClass || 'standard',
      manageStock: product.manageStock !== undefined ? product.manageStock : true,
      seoTitle: product.seoTitle || '',
      metaDescription: product.metaDescription || ''
    });

    // Clear existing arrays
    while (this.imageUrls.length !== 0) {
      this.imageUrls.removeAt(0);
    }
    while (this.specifications.length !== 0) {
      this.specifications.removeAt(0);
    }

    // Populate image URLs
    if (product.imageUrls && product.imageUrls.length > 0) {
      product.imageUrls.forEach((url: string) => this.addImageUrl(url));
    } else {
      this.addImageUrl();
    }

    // Populate specifications and extract colors/sizes
    if (product.specifications && product.specifications.length > 0) {
      product.specifications.forEach((spec: ProductSpecification) => {
        if (spec.key === 'Color') {
          this.selectedColors.push(spec.value);
        } else if (spec.key === 'Size') {
          this.selectedSizes.push(spec.value);
        } else {
          this.addSpecification(spec.key, spec.value);
        }
      });
    } else {
      this.addSpecification();
    }

    // Load sub-categories if category is set
    const categoryId = this.productForm.get('categoryId')?.value;
    if (categoryId) {
      this.onCategoryChange();
    }
  }

  saveAsDraft(): void {
    this.productForm.patchValue({ status: 'draft' });
    this.onSubmit();
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.productForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.loading = true;
    
    // Prepare specifications including colors and sizes
    const colorSpecifications = this.selectedColors.map(color => ({
      key: 'Color',
      value: color,
      displayOrder: 0
    }));

    const sizeSpecifications = this.selectedSizes.map(size => ({
      key: 'Size',
      value: size,
      displayOrder: 0
    }));

    const otherSpecifications = this.specifications.value
      .filter((spec: any) => spec.key && spec.value && spec.key !== 'Color' && spec.key !== 'Size')
      .map((spec: any) => ({
        ...spec,
        displayOrder: spec.displayOrder || 0
      }));

    const allSpecifications = [
      ...colorSpecifications,
      ...sizeSpecifications,
      ...otherSpecifications
    ];

    const formValue = this.productForm.value;
    const productData: ProductRequest = {
      name: formValue.name,
      description: formValue.description,
      price: parseFloat(formValue.price),
      stock: parseInt(formValue.stock),
      categoryId: parseInt(formValue.categoryId),
      subCategoryId: formValue.subCategoryId ? parseInt(formValue.subCategoryId) : undefined,
      discount: formValue.discount ? parseFloat(formValue.discount) : undefined,
      brand: formValue.brand || undefined,
      imageUrls: formValue.imageUrls.filter((url: string) => url && url.trim() !== ''),
      specifications: allSpecifications
    };

    // Use the vendorId from the form
    const vendorId = parseInt(formValue.vendorId);

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData, vendorId).subscribe({
        next: (product) => {
          this.loading = false;
          this.router.navigate(['/vendor/products']);
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
          this.router.navigate(['/vendor/products']);
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

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Helper method to check if color is selected
  isColorSelected(colorName: string): boolean {
    return this.selectedColors.includes(colorName);
  }

  // Helper method to check if size is selected
  isSizeSelected(size: string): boolean {
    return this.selectedSizes.includes(size);
  }
}