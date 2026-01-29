import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService, Category } from '../category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEdit implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  submitted = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  currentImage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      status: ['Active', Validators.required]
    });
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

  loadCategory(id: number): void {
    this.categoryService.getById(id).subscribe(category => {
      console.log('loadcategory', category);

      this.categoryForm.patchValue({
        name: category.name,
        image: '',
        status: (category.status == 1 || category.status == '1') ? 'Active' : 'Inactive'
      });

      this.categoryForm.get('image')?.clearValidators();
      this.categoryForm.get('image')?.updateValueAndValidity();

      if (category.image) {
        this.currentImage = category.image;
        this.imagePreview = `http://localhost:3300/${category.image}`;
        // console.log('Set Image Preview:', this.imagePreview);
      }
    });
  }

  get f() { return this.categoryForm.controls; }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Patch the form control to satisfy Validators.required
      this.categoryForm.patchValue({
        image: this.selectedFile
      });
      this.categoryForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile!);
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.imagePreview = null;
    this.currentImage = null;
    this.selectedFile = null;
    this.categoryForm.get('image')?.setValidators([Validators.required]);
    this.categoryForm.get('image')?.updateValueAndValidity();
  }

  removeImage(): void {
    this.imagePreview = null;
    this.currentImage = null;
    this.selectedFile = null;
    this.categoryForm.patchValue({ image: '' });
    this.categoryForm.get('image')?.setValidators([Validators.required]);
    this.categoryForm.get('image')?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    // console.log('Form Values', this.categoryForm.value);
    // console.log('Selected File', this.selectedFile);

    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    formData.append('status', this.categoryForm.get('status')?.value === 'Active' ? '1' : '0');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.isEditMode && this.currentImage) {
      formData.append('image', this.currentImage);
    }
    console.log('Form Data', formData);

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, formData).subscribe({
        next: () => {
          this.toastr.success('Category updated successfully', 'Success');
          this.router.navigate(['/category']);
        },
      });
    } else {
      this.categoryService.create(formData).subscribe({
        next: () => {
          this.toastr.success('Category created successfully', 'Success');
          this.router.navigate(['/category']);
        },
      });
    }
  }
}
