import { Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { HospitalList } from './hospital_list';
import { HospitalAddUpdate } from './hospital_add_update';

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
    selector: 'app-crud',
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
    ConfirmDialogModule,
    HospitalList,
    HospitalAddUpdate
],


    
    template: `<app-hospital-list 
    (changeProductDialogvisibile)='changeProductDialogvisibile($event)'/>

    <!-- (editEvent)="editHospital($event)" -->
    
    <app-hospital-add-update (changeProductDialogvisibile)='changeProductDialogvisibile($event)' [productDialog]= 'productDialog'
    (hospitalSaved)="onHospitalSaved()"  />

    <!-- [editHospitalData]="product" -->


    

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Hospital implements OnInit {
    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    @ViewChild(HospitalList) hospitallist!: HospitalList;

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

    loadDemoData() {
        // this.productService.getProducts().then((data) => {
        //     this.products.set(data);
        // });

    

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = { address: null, phone: null }; // 'address' ve 'phone' özellikleri eklendi
        this.submitted = false;
        this.productDialog = true;
    }


    onHospitalSaved() {
        debugger
        this.hospitallist.loadDemoData();
        this.productDialog = false; 
      }
      

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    changeProductDialogvisibile(visible:boolean) {
        this.productDialog = visible;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

   


    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                this.product = { address: null, phone: null }; // Initialize with required properties
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

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

    saveProduct() {
        this.submitted = true;
        let _products = this.products();
        if (this.product.name?.trim()) {
            if (this.product.id) {
                _products[this.findIndexById(this.product.id)] = this.product;
                this.products.set([..._products]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
                this.products.set([..._products, this.product]);
            }

            this.productDialog = false;
            this.product = { address: null, phone: null }; // Initialize with required properties
        }
    }
}
