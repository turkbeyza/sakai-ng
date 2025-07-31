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
import { Product } from '../service/product.service';
import { ProductService } from '../service/product.service'; 
import { Message } from "primeng/message";
// import { FloatLabel } from "primeng/floatlabel";

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
    Message,
    
],
    template: `


<p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Add Hospital" [modal]="true" (onHide)='hideDialog()'>

 <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="Name" placeholder="Hospital Name" formControlName="Name" [invalid]="isInvalid('Name')" />
        @if (isInvalid('Name')) {
            <p-message severity="error" size="small" variant="simple">lName is required.</p-message>
        }
    </div>
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="address" placeholder="Address" formControlName="address" [invalid]="isInvalid('address')" />
        @if (isInvalid('address')) {
            @if (exampleForm.get('address')?.errors?.['required']) {
                <p-message severity="error" size="small" variant="simple">address is required.</p-message>
            }
            @if (exampleForm.get('address')?.errors?.['address']) {
                <p-message severity="error" size="small" variant="simple">Please enter a valid address.</p-message>
            }
        }

        <div class="flex flex-col gap-1">
  <input pInputText type="text" id="phone" placeholder="Phone Number" formControlName="phone" [invalid]="isInvalid('phone')" />
  @if (isInvalid('phone')) {
    @if (exampleForm.get('phone')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('phone')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid phone number.</p-message>
    }
  }
</div>

    </div>

   
    <!-- <button pButton severity="secondary" type="submit"><span pButtonLabel>Add</span></button> -->


  <button pButton type="save" icon="pi pi-check" label="Save"></button>
</form> 



           
            <ng-template #footer>
               <!-- <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" /> -->
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, ProductService, ConfirmationService]


    
})
export class HospitalAddUpdate implements OnInit {
    
    @Input() productDialog: boolean = false;

    
    @Input() editHospitalData!: Product;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();

   // @Output() deleteProductEvent = new EventEmitter<Product>();
    

    product!: Product;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
exampleForm: any;
    dialog: boolean | undefined;

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
              Name: ['', Validators.required],
              address: ['', [Validators.required, Validators.required]],
              phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]]
            });
          }

          ngOnChanges(): void {
            if (this.editHospitalData) {
              this.exampleForm.patchValue({
                Name: this.editHospitalData.name,
                address: this.editHospitalData.address,
                phone: this.editHospitalData.phone
              });
              this.product = { ...this.editHospitalData };
            }
          }
             

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
      }
      

onSubmit() {
    // if (this.exampleForm.valid) {
    //     const formData = this.exampleForm.value;

    //     const hospital = this.exampleForm.value; // Define the hospital variable
    //     this.productService.addHospital(hospital).subscribe({
    //         next: () => {
    //             this.messageService.add({
    //                 severity: 'success', 
    //                 summary: 'Success',
    //                 detail: 'Hospital added successfully'
    //             });
    //             this.dialog = false;
    //             this.exampleForm.reset();
    //         },
    //         error: () => {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: 'Failed to add hospital'
    //             });
    //         }
    //     });
    // } else {
        // this.messageService.add({
        //     severity: 'warn',
        //     summary: 'Validation Error',
        //     detail: 'Please complete the form before submitting.'
        // });

        // const formData = this.exampleForm.value;
        // console.log('Form verileri:', formData);
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Form Submitted',
        //     detail: `Hospital Name: ${formData.Name}, address: ${formData.address}, Phone: ${formData.phone}`
        // });
        // this.hideDialog();
        // this.exampleForm.markAllAsTouched();
        
            if (this.exampleForm.valid) {
                const formData = this.exampleForm.value;
        
                // Güncellenmiş product objesini oluştur
                const hospital: Product = {
                    ...this.product,
                    name: formData.Name,
                    address: formData.address,
                    phone: formData.phone
                };
        
                if (this.product?.id) {
                    // Güncelleme işlemi
                    this.productService.updateHospital(hospital).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Updated',
                                detail: 'Hospital updated successfully'
                            });
                            this.closeDialog();
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update hospital'
                            });
                        }
                    });
                } else {
                    // Yeni ekleme işlemi
                    this.productService.addHospital(hospital).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Added',
                                detail: 'Hospital added successfully'
                            });
                            this.closeDialog();
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add hospital'
                            });
                        }
                    });
                }
            } else {
                this.exampleForm.markAllAsTouched();
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Validation Error',
                    detail: 'Please complete the form before submitting.'
                });
            }
        }
    closeDialog() {
        throw new Error('Method not implemented.');
    }
    
    openNew() {
        this.product = { address: '', id: '', code: '', name: '', description: '', price: 0, category: '', quantity: 0, inventoryStatus: '', rating: 0, phone: '' };
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

editHospital(hospital: Product) {
  this.product = { ...hospital };  // referans kopyalamadan kaçınmak için spread
  this.productDialog = true;

  this.exampleForm.patchValue({
    Name: hospital.name,
    address: hospital.address,
    phone: hospital.phone
  });
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
            this.product = { address: '', id: '', code: '', name: '', description: '', price: 0, category: '', quantity: 0, inventoryStatus: '', rating: 0, phone: '' };
        }
    }
}
