import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductService, Product } from '../product.service';
import { CategoryService, Category } from '../../category/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
})
export class ProductEdit implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  submitted = false;
  selectedFile: File | null = null;
  imagePreview: SafeUrl | string | ArrayBuffer | null = null;
  categories: Category[] = [];
  currentImage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category_id: ['', Validators.required],
      image: ['', Validators.required],
      status: ['Active', Validators.required]
    });
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

  loadCategories(): void {
    const payload = {
      order: [['created_at', 'DESC']],
      search: '',
      filter: { status: [1] },
      offset: 0,
      limit: 100,
      allrecords: false,
      searchfields: ['name']
    };

    this.categoryService.getList(payload as any).subscribe({
      next: (response: any) => {
        console.log('category res', response);
        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response.data && Array.isArray(response.data)) {
          this.categories = response.data;
        } else if (response.rows && Array.isArray(response.rows)) {
          this.categories = response.rows;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.categories = response.data.data;
        } else {
          this.categories = [];
        }
        console.log('Categories', this.categories);
        this.cdr.detectChanges();
      },
    });
  }

  loadProduct(id: number): void {
    this.productService.getById(id).subscribe(product => {
      console.log('Fetched Product for Edit:', product);

      const statusValue = (product.status == 1 || product.status == '1') ? 'Active' : 'Inactive';

      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        image: '',
        status: statusValue
      });

      this.productForm.get('image')?.clearValidators();
      this.productForm.get('image')?.updateValueAndValidity();

      if (product.image) {
        this.currentImage = product.image;
        const fullUrl = `http://localhost:3300/${product.image}`;
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(fullUrl);
      }

      this.cdr.detectChanges();
    });
  }

  get f() { return this.productForm.controls; }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Patch the form control to satisfy Validators.required
      this.productForm.patchValue({
        image: this.selectedFile
      });
      this.productForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile!);
    } else {
      // Handle case where user cancels file selection or selects nothing
      // If we want to strictly keep the previous state if nothing selected, we might do nothing.
      // But typically change event implies interaction.
      // For now, let's keep it simple as per existing logic, but we might want to ensure we don't accidentally clear if cancel.
      // The DOM 'change' event usually only fires on actual change.
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.currentImage = null;
    this.selectedFile = null;
    this.productForm.patchValue({ image: '' });
    this.productForm.get('image')?.setValidators([Validators.required]);
    this.productForm.get('image')?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('category_id', this.productForm.get('category_id')?.value);
    formData.append('status', this.productForm.get('status')?.value === 'Active' ? '1' : '0');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.isEditMode && this.currentImage) {
      formData.append('image', this.currentImage);
    }

    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, formData).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully', 'Success');
          this.router.navigate(['/product']);
        },
      });
    } else {
      this.productService.create(formData).subscribe({
        next: () => {
          this.toastr.success('Product created successfully', 'Success');
          this.router.navigate(['/product']);
        },
      });
    }
  }
}
