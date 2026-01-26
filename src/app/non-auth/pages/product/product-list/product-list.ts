import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../product.service';
import { CategoryService, Category } from '../../category/category.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbPaginationModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: Category[] = []; // Store categories for mapping
  showDeleteModal = false;
  productToDeleteId: number | null = null;

  // Pagination properties
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  // Search & Filter properties
  searchTerm = '';
  statusFilter = -1; // -1 for All

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCategories(); // Load categories first
    this.loadProducts();
  }

  loadCategories(): void {
    // payload for categories
    const payload = {
      order: [['created_at', 'DESC']],
      search: '',
      filter: { status: [1] },
      offset: 0,
      limit: 100,
      allrecords: false,
      searchfields: ['name']
    };

    // Fetch all active categories for display mapping using getList (robust)
    this.categoryService.getList(payload as any).subscribe({
      next: (response: any) => {
        console.log('ProductList: Categories loaded', response);
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
        // Trigger detection
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load categories for list', err)
    });
  }

  getCategoryName(categoryId: number): string {
    if (!categoryId) return 'N/A';
    // Ensure both are treated as numbers/strings for comparison if needed
    const category = this.categories.find(c => c.id == categoryId);
    return category ? category.name : 'Unknown';
  }

  loadProducts(): void {
    const filterStatus = this.statusFilter === -1 ? [0, 1] : this.statusFilter;

    const payload = {
      order: [['created_at', 'DESC']],
      search: this.searchTerm,
      filter: { status: filterStatus },
      offset: (this.page - 1) * this.pageSize,
      limit: this.pageSize,
      allrecords: false,
      searchfields: ['name']
    };

    this.productService.getList(payload as any).subscribe({
      next: (response) => {
        console.log('Product List Data Received:', response);
        this.products = response.data || [];
        this.collectionSize = response.totalRecords;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Product List Fetch Error:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadProducts();
  }

  onSearch(): void {
    this.page = 1;
    this.loadProducts();
  }

  onStatusFilterChange(): void {
    this.page = 1;
    this.loadProducts();
  }

  openDeleteModal(id: number): void {
    this.productToDeleteId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.productToDeleteId) {
      this.productService.delete(this.productToDeleteId).subscribe(() => {
        this.loadProducts();
        this.closeDeleteModal();
      });
    }
  }
}
