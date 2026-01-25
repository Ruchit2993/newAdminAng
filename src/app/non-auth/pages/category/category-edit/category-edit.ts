import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService, Category } from '../category.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: [''], // We still keep this for potential preview or existing URL if needed, or remove validator
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
      console.log('Fetched Category for Edit:', category);

      // Patch name directly
      this.categoryForm.patchValue({
        name: category.name,
        image: '', // Reset file input
        // Map backend status (1/0) to form value ('Active'/'Inactive')
        status: (category.status == 1 || category.status == '1') ? 'Active' : 'Inactive'
      });

      if (category.image) {
        // Assuming backend returns relative path like 'uploads/...'
        this.imagePreview = `http://localhost:3300/${category.image}`;
        console.log('Set Image Preview:', this.imagePreview);
      }
    });
  }

  get f() { return this.categoryForm.controls; }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile!);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    console.log('Form Values:', this.categoryForm.value);
    console.log('Selected File:', this.selectedFile);

    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    formData.append('status', this.categoryForm.get('status')?.value === 'Active' ? '1' : '0');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else {
      console.warn('No file selected! Backend might require an image.');
    }

    // Debug FormData
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, formData).subscribe({
        next: () => {
          console.log('Update successful');
          this.router.navigate(['/category']);
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('Failed to update category: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.categoryService.create(formData).subscribe({
        next: () => {
          console.log('Create successful');
          this.router.navigate(['/category']);
        },
        error: (err) => {
          console.error('Create failed', err);
          alert('Failed to create category: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
