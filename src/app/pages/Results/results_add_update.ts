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
import { ResultsModel } from './results_model';
import { ResultsService } from '../service/results.service';

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
    selector: 'app-results-add-update',
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


<p-dialog [(visible)]="resultsDialog" [style]="{ width: '450px' }" header="Add Results" [modal]="true" (onHide)='hideDialog()'>

 <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="Name" placeholder="Results Name" formControlName="Name" [invalid]="isInvalid('Name')" />
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

  <button pButton type="save" icon="pi pi-check" label="Save"></button>
</form> 

           
            <ng-template #footer>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, ResultsService, ConfirmationService]


    
})
export class ResultsAddUpdate implements OnInit, OnChanges {
    
    @Input() resultsDialog: boolean = false;
    @Input() editResultsData!: ResultsModel;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() resultsSaved = new EventEmitter<void>();


    results!: ResultsModel;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    exampleForm: any;
    dialog: boolean | undefined;


    constructor(
        private resultsService: ResultsService,
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

          ngOnChanges(changes: SimpleChanges): void {
            if (changes['resultsDialog'] && changes['resultsDialog'].currentValue) {
                debugger
   if (this.editResultsData) {
    this.exampleForm.patchValue({
        appointmentId: this.editResultsData.appointmentId,
        fileName: this.editResultsData.fileName,
        filePath: this.editResultsData.filePath,
        createdAt: this.editResultsData.createdAt,
      });
      this.results = { ...this.editResultsData }; // update mode
} else {
    this.results = {
      id: '',
      appointmentId: '',
      fileName: '',
      filePath: '',
      createdAt: new Date() // add mode
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
        
                const results: ResultsModel = {
                    ...this.results,
                    appointmentId: formData.appointmentId,
                    fileName: formData.fileName,
                    filePath: formData.filePath,
                    createdAt: formData.createdAt,
                };
        
                if (this.results?.id) {
                    this.resultsService.updateResults(results).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Updated',
                                detail: 'Results updated successfully'
                            });
                            this.resultsSaved.emit();
                            this.closeDialog();
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update results'
                            });
                        }
                    });
                } else {
                    
                    this.resultsService.addResults(results).subscribe({
                        next: () => {
                            
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Added',
                                detail: 'Results added successfully'
                            });
                            this.resultsSaved.emit(); 
                            this.closeDialog();
                            this.exampleForm.reset(); 
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add results'
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
        this.results = {   id: '',
        appointmentId: '',
        fileName: '',
        filePath: '',
        createdAt: new Date() };
        this.submitted = false;
        this.resultsDialog = true;
    }

editResults(results: ResultsModel) {
  this.results = { ...results };  
  this.resultsDialog = true;

  this.exampleForm.patchValue({
    appointmentId: results.appointmentId,
    fileName: results.fileName,
    filePath: results.filePath,
    createdAt: results.createdAt,
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
        if (this.results.appointmentId?.trim()) {
            if (this.results.id) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Results Updated',
                    life: 3000
                });
            } else {
                this.results.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Results Created',
                    life: 3000
                });
            }

            this.resultsDialog = false;
            this.results = { id: '',
            appointmentId: '',
            fileName: '',
            filePath: '',
            createdAt: new Date() };
        }
    }
}
