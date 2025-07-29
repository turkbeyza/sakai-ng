import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Product, ProductService } from '../service/product.service';
import { Message } from "primeng/message";

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
    selector: 'app-hospital-add-update',
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
    ReactiveFormsModule,
    Message
],
    template: `


<p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Add Hospital" [modal]="true" (onHide)='hideDialog()'>

<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="hospitalName" placeholder="hospitalName" formControlName="hospitalName" [invalid]="isInvalid('hospitalName')" />
        @if (isInvalid('hospitalName')) {
            <p-message severity="error" size="small" variant="simple">hospitalName is required.</p-message>
        }
    </div>
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="location" placeholder="location" formControlName="location" [invalid]="isInvalid('location')" />
        @if (isInvalid('location')) {
            @if (exampleForm.get('location')?.errors?.['required']) {
                <p-message severity="error" size="small" variant="simple">Location is required.</p-message>
            }
            @if (exampleForm.get('location')?.errors?.['location']) {
                <p-message severity="error" size="small" variant="simple">Please enter a valid location.</p-message>
            }
        }

        <div class="flex flex-col gap-1">
  <input pInputText type="text" id="phoneNumber" placeholder="Phone Number" formControlName="phoneNumber" [invalid]="isInvalid('phoneNumber')" />
  @if (isInvalid('phoneNumber')) {
    @if (exampleForm.get('phoneNumber')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('phoneNumber')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid phone number.</p-message>
    }
  }
</div>

    </div>
    <button pButton severity="secondary" type="submit"><span pButtonLabel>Add</span></button>
</form>
           
            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class HospitalAddUpdate implements OnInit {
    @Input() productDialog: boolean = false;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    

    product!: Product;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
exampleForm: any;

//exampleForm!: FormGroup;


    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    
        ngOnInit() {
            this.exampleForm = this.fb.group({
              hospitalName: ['', Validators.required],
              location: ['', [Validators.required, Validators.required]],
              phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]]
            });
          }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
      }
      

onSubmit() {
  if (this.exampleForm.valid) {
    const formData = this.exampleForm.value;
    console.log('Form verileri:', formData);
    this.messageService.add({
      severity: 'success',
      summary: 'Form Submitted',
      detail: `Hospital Name: ${formData.hospitalName}, Location: ${formData.location}, Phone: ${formData.phoneNumber}`
    });
    this.hideDialog();
  } else {
    this.exampleForm.markAllAsTouched();
  }
}

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }



    hideDialog() {
        this.changeProductDialogvisibile.emit(false)
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
        //let _products = this.products();
        if (this.product.name?.trim()) {
            if (this.product.id) {
               // _products[this.findIndexById(this.product.id)] = this.product;
                //this.products.set([..._products]);
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
               // this.products.set([..._products, this.product]);
            }

            this.productDialog = false;
            this.product = {};
        }
    }
}
