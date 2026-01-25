import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category, CategoryService } from '../category.service';
import { clippingParents } from '@popperjs/core';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit {
  categories: Category[] = [];
  showDeleteModal = false;
  categoryToDeleteId: number | null = null;

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        console.log('Category List Data Received:', data);
        this.categories = data;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Category List Fetch Error:', err);
      }
    });
  }

  openDeleteModal(id: number): void {
    console.log('Open Delete Modal:', id);
    this.categoryToDeleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.categoryToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.categoryToDeleteId) {
      this.categoryService.delete(this.categoryToDeleteId).subscribe(() => {
        this.loadCategories();
        this.closeDeleteModal();
      });
    }
  }
}
