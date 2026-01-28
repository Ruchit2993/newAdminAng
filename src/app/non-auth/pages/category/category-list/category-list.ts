import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../category.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbPaginationModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList implements OnInit {
  categories: Category[] = [];
  showDeleteModal = false;
  categoryToDeleteId: number | null = null;

  // Pagination properties
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  // Search & Filter properties
  searchTerm = '';
  statusFilter = -1; // -1 for All

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    // Ensure statusFilter is treated as a number
    const status = +this.statusFilter;
    const filterStatus = status === -1 ? [0, 1] : [status];

    const payload = {
      order: [['created_at', 'DESC']],
      search: this.searchTerm, // Search functionality can be added later
      filter: { status: filterStatus },
      offset: (this.page - 1) * this.pageSize,
      limit: this.pageSize,
      allrecords: false,
      searchfields: ['name']
    };

    // Cast payload as any here to avoid typescript checks if strict mode complains about array type mismatch but structure matches requirements
    this.categoryService.getList(payload as any).subscribe({
      next: (response) => {
        console.log('Category List Data Received:', response);
        this.categories = response.data || [];
        this.collectionSize = response.totalRecords;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Category List Fetch Error:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadCategories();
  }

  onSearch(): void {
    this.page = 1;
    this.loadCategories();
  }

  onStatusFilterChange(): void {
    this.page = 1;
    this.loadCategories();
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
      this.categoryService.delete(this.categoryToDeleteId).subscribe({
        next: () => {
          this.toastr.success('Category deleted successfully', 'Success');
          this.loadCategories();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Delete Category Error:', err);
          this.toastr.error('Failed to delete category', 'Error');
          this.closeDeleteModal();
        }
      });
    }
  }
}
