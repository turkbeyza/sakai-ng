import { Component, OnInit, Output,  EventEmitter, signal, ViewChild, Inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product } from '../service/product.service';
import { ProductService } from '../service/product.service'; 


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-hospital-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>

                
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProduct" />
            

            </ng-template>

            
            <ng-template pTemplate="body" let-hospital>
    <tr>
      <td>{{ hospital.name }}</td>
      <td>{{ hospital.address }}</td>
      <td>{{ hospital.phone }}</td>
      <td>
      <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2"
  (click)="editProduct(hospital)">
</button>

      </td>
    </tr>
  </ng-template>



                <!-- <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" /> -->


            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt

            [value]="products"

            
            [value]="products"

            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name']"
            [tableStyle]="{ 'min-width': '75rem' }"

            [(selection)]="selectedProduct"

            [(selection)]="selectedProducts"

            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"

            selectionMode ='single'


        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Products</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>

                    <!-- <th style="min-width: 16rem">Code</th> -->

                    <th pSortableColumn="name" style="min-width:16rem">
                        Name
                        <p-sortIcon field="name" />
                    </th>

                   <!-- <th>Image</th> -->
                   <!--   <th pSortableColumn="price" style="min-width: 8rem">
                        Price
                        <p-sortIcon field="price" /> 

                    <th>Image</th>
                    <th pSortableColumn="price" style="min-width: 8rem">
                        Price
                        <p-sortIcon field="price" />

                    </th>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Category
                        <p-sortIcon field="category" />
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Reviews
                        <p-sortIcon field="rating" />
                    </th>
                    <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                        Status
                        <p-sortIcon field="inventoryStatus" />
                    </th>
                    <th style="min-width: 12rem"></th>

                </tr> -->

                <th pSortableColumn="phone" style="min-width: 12rem">
            Phone Number
            <p-sortIcon field="phone" />
        </th>

        <!-- <th style="min-width: 12rem"></th> 
    </tr> -->
    
    <th pSortableColumn="address" style="width: 100%">
            Address
            <p-sortIcon field="address" />
        </th>
        <th style="min-width: 12rem " > Edit </th>

        </tr>

            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>

                    <td style="min-width: 16rem">{{ product.name }}</td>
                    <td>{{ product.phone }}</td>
                    <td>{{ product.address }}</td>
                    <!-- <td> -->
                    <!-- <button pButton icon="pi pi-trash" (click)="deleteProduct(product)"></button> -->


                    <!-- <td style="min-width: 12rem">{{ product.code }}</td> -->
                    <!-- <td style="min-width: 16rem">{{ product.name }}</td> -->
                    <!-- <td> -->
                    <!-- </td> -->
                    <!-- <td>{{ product.price | currency: 'USD' }}</td>
                    <td>{{ product.category }}</td>
                    <td> -->
                        <!-- <p-rating [(ngModel)]="product.rating" [readonly]="true" /> -->
                    <!-- </td> -->
                    <!-- <td>
                    
                    </td> -->
                    <td>

                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" />
                        <!-- <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" /> -->
                    </td>
                </tr>
            </ng-template>
        </p-table>
        <!-- <p-dialog 
            [(visible)]="editDialogVisible" 
            [style]="{ width: '450px' }" 
            header="Edit Hospital" 
            [modal]="true" 
            class="p-fluid">
            
            <ng-template #content>
                <div class="field">
                    <label for="name">Name</label>
                    <input 
                        pInputText 
                        id="name" 
                        [(ngModel)]="editProduct.name" 
                        required 
                        autofocus 
                        [class.ng-invalid.ng-dirty]="submitted && !editProduct.name" />
                    <small class="p-error" *ngIf="submitted && !editProduct.name">Name is required.</small>
                </div>

        <p-confirmdialog [style]="{ width: '450px' }" /> -->
        <p-dialog 
    [(visible)]="editDialogVisible" 
    [style]="{ width: '450px' }" 
    header="Edit Hospital" 
    [modal]="true" 
    class="p-fluid"
>
    <ng-template #content>
        <div class="field">
            <label for="name">Name</label>
            <input 
                pInputText 
                id="name" 
                [(ngModel)]="editingProduct.name" 
                required 
                autofocus 
                [class.ng-invalid.ng-dirty]="submitted && !editingProduct.name" 
            />
            <small class="p-error" *ngIf="submitted && !editingProduct.name">Name is required.</small>
        </div>

        <div class="field">
            <label for="phone">Phone</label>
            <input 
                pInputText 
                id="phone" 
                [(ngModel)]="editingProduct.phone" 
                required 
                [class.ng-invalid.ng-dirty]="submitted && !editingProduct.phone" 
            />
            <small class="p-error" *ngIf="submitted && !editingProduct.phone">Phone is required.</small>
        </div>

        <div class="field">
            <label for="address">Address</label>
            <input 
                pInputText 
                id="address" 
                [(ngModel)]="editingProduct.address" 
                required 
                [class.ng-invalid.ng-dirty]="submitted && !editingProduct.address" 
            />
            <small class="p-error" *ngIf="submitted && !editingProduct.address">Address is required.</small>
        </div>

        <div class="flex justify-content-end mt-4">
            <button pButton label="Cancel" icon="pi pi-times" (click)="hideEditDialog()" class="p-button-text"></button>
            <button pButton label="Save" icon="pi pi-check" (click)="saveProduct()"></button>
        </div>
    </ng-template>
</p-dialog>
<p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class HospitalList implements OnInit {


hospital: any;


    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();

    @Output() editEvent = new EventEmitter<Product>();


    products: any[] = [];

    product!: Product;

    selectedProduct!: Product[];

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    editDialogVisible: boolean = false;
    editingProduct: any = {};

    @ViewChild('dt') dt!: Table;


    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(

        @Inject(ProductService) private productService: ProductService,


        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }


    loadHospitals(): void {
        this.productService.getHospitals().subscribe(data => {
          this.hospital = data;
        });
      }

    loadDemoData() {

       // debugger
        this.productService.getHospitals().subscribe({
            next: (data: any) => {
                //debugger
                this.products = data;
                console.log(data);
            },
            error: (err: any) => console.log(err)
        });
          


        this.cols = [
             { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
             { field: 'name', header: 'Name' },
        //   //  { field: 'image', header: 'Image' },
             { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.changeProductDialogvisibile.emit(true);
        this.loadDemoData();
        
    }


    // editProduct(product: Product) {
    //     this.product = { ...product };
    // }

      // EDIT FONKSIYONU - DÜZELTİLDİ
      editProduct(product: any) {
        console.log('editProduct called with:', product);
        
        // Null/undefined kontrolü
        if (!product) {
            console.error('Product is undefined or null');
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No hospital selected',
                life: 3000
            });
            return;
        }
        
        // Seçilen hastahanenin tüm bilgilerini kopyala
        this.editingProduct = {
            id: product.id || '',
            name: product.name || '',
            phone: product.phone || '',
            address: product.address || ''
        };
        
        console.log('Editing product:', this.editingProduct);
        
        this.editDialogVisible = true;
        this.submitted = false;
    }

    // YENİ FONKSIYONLAR
    hideEditDialog() {
        this.editDialogVisible = false;
        this.submitted = false;
        this.editingProduct = {
            id: '',
            name: '',
            phone: '',
            address: ''
        };
    }

   
    saveProduct() {
        debugger
        this.submitted = true;

        // Validasyon kontrolü
        if (!this.editingProduct.name || !this.editingProduct.phone || !this.editingProduct.address) {
            return;
        }

        console.log('Saving product:', this.editingProduct);

        // API çağrısı - ProductService'te updateHospital metodu olmalı
        this.productService.updateHospital(this.editingProduct).subscribe({
            next: (data: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Hospital Updated',
                    life: 3000
                });
                this.loadDemoData(); // Listeyi yenile
                this.hideEditDialog();
                this.selectedProduct=[]; // Dialog'u kapat
            },
            error: (err: any) => {
                console.log(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update hospital',
                    life: 3000
                });
            }
        });
    }





    deleteSelectedProducts() {


        debugger
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',

            accept: ( ) => { 
                debugger
                this.productService.deleteHospital(this.selectedProduct[0].id).subscribe({
                    next: (data: any) => {
                        // this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Products Deleted',
                            life: 3000
                        });
                          this.loadDemoData();
                          this.selectedProduct=[];
                    },
                    error: (err: any) => console.log(err)
                });
                
            }
        });
    }


    hideDialog() {
        this.submitted = false;
    }

    @Output() deleteProductEvent = new EventEmitter<Product>();






    deleteProduct(product: Product) {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to delete ' + product.name + '?',
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.products.set(this.products().filter((val) => val.id !== product.id));
        //         this.product = {};
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Deleted',
        //             life: 3000
        //         });
        //     }
        // });
    }

    findIndexById(id: string): number {
         let index = -1;
        // for (let i = 0; i < this.products().length; i++) {
        //     if (this.products()[i].id === id) {
        //         index = i;
        //         break;
        //     }
        // }

         return index;

}
    

    

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

}
