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
import { Message } from "primeng/message";
import { OnChanges, SimpleChanges } from '@angular/core';
import { FavoritesModel } from './favorites_model';
import { FavoritesService } from '../service/favorites_service';

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
    selector: 'app-favorites-add-update',
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


<p-dialog [(visible)]="favoritesDialog" [style]="{ width: '450px' }" header="Add Favorites" [modal]="true" (onHide)='hideDialog()'>

 <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="patientUserId" placeholder="patientUserId" formControlName="patientUserId" [invalid]="isInvalid('patientUserId')" />
        @if (isInvalid('patientUserId')) {
            <p-message severity="error" size="small" variant="simple">lName is required.</p-message>
        }
    </div>
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="doctorUserId" placeholder="doctorUserId" formControlName="doctorUserId" [invalid]="isInvalid('doctorUserId')" />
        @if (isInvalid('doctorUserId')) {
            @if (exampleForm.get('doctorUserId')?.errors?.['required']) {
                <p-message severity="error" size="small" variant="simple">address is required.</p-message>
            }
            @if (exampleForm.get('doctorUserId')?.errors?.['doctorUserId']) {
                <p-message severity="error" size="small" variant="simple">Please enter a valid address.</p-message>
            }
        }

        <!-- <div class="flex flex-col gap-1">
  <input pInputText type="text" id="phone" placeholder="Phone Number" formControlName="phone" [invalid]="isInvalid('phone')" />
  @if (isInvalid('phone')) {
    @if (exampleForm.get('phone')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('phone')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid phone number.</p-message>
    }
  }
</div> -->

    </div>

  <button pButton type="save" icon="pi pi-check" label="Save"></button>
</form> 

           
            <ng-template #footer>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, FavoritesService, ConfirmationService]


    
})
export class FavoritesAddUpdate implements OnInit, OnChanges {
    
    @Input() favoritesDialog: boolean = false;
    @Input() editFavoritesData!: FavoritesModel;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() favoritesSaved = new EventEmitter<void>();


    favorites!: FavoritesModel;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    exampleForm: any;
    dialog: boolean | undefined;


    constructor(
        private favoritesService: FavoritesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    
        ngOnInit() {
            this.exampleForm = this.fb.group({
              patientUserId: ['', Validators.required],
              doctorUserId: ['', [Validators.required, Validators.required]],
            });
          }

          ngOnChanges(changes: SimpleChanges): void {
            if (changes['favoritesDialog'] && changes['favoritesDialog'].currentValue) {
                debugger
   if (this.editFavoritesData) {
    this.exampleForm.patchValue({
        patientUserId: this.editFavoritesData.patientUserId,
        doctorUserId: this.editFavoritesData.doctorUserId,
      });
      this.favorites = { ...this.editFavoritesData }; // update mode
} else {
    this.favorites = {
      id: '',
      patientUserId: '',
      doctorUserId: '',
    };
    this.exampleForm.reset(); // add mode

            } 
          }
        }
          
             

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
      }
      

onSubmit() {
        
            if (this.exampleForm.valid) {
                
                const formData = this.exampleForm.value;
        
                const favorites: FavoritesModel = {
                    ...this.favorites,
                    patientUserId: formData.patientUserId,
                    doctorUserId: formData.doctorUserId,
                };
        
                if (this.favorites?.id) {
                    this.favoritesService.updateFavorites(favorites).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Updated',
                                detail: 'Favorites updated successfully'
                            });
                            this.favoritesSaved.emit();
                            this.closeDialog();
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update favorites'
                            });
                        }
                    });
                } else {
                    
                    this.favoritesService.addFavorites(favorites).subscribe({
                        next: () => {
                            
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Added',
                                detail: 'Favorites added successfully'
                            });
                            this.favoritesSaved.emit(); 
                            this.closeDialog();
                            this.exampleForm.reset(); 
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add favorites'
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
        
        this.changeProductDialogvisibile.emit(false)
    }
    
    openNew() {
        this.favorites = { patientUserId: '', doctorUserId: '' };
        this.submitted = false;
        this.favoritesDialog = true;
    }

editFavorites(favorites: FavoritesModel) {
  this.favorites = { ...favorites };  
  this.favoritesDialog = true;

  this.exampleForm.patchValue({
    patientUserId: favorites.patientUserId,
    doctorUserId: favorites.doctorUserId,
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
        if (this.favorites.patientUserId?.trim()) {
            if (this.favorites.id) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Favorites Updated',
                    life: 3000
                });
            } else {
                this.favorites.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Favorites Created',
                    life: 3000
                });
            }

            this.favoritesDialog = false;
            this.favorites = { patientUserId: '', doctorUserId: '' };
        }
    }
}
