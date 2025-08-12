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
import { PatientModel } from './patient_model';
import { PatientService } from '../service/patient.service';

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
    selector: 'app-patient-add-update',
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


<p-dialog [(visible)]="patientDialog" [style]="{ width: '450px' }" header="Add Patient" [modal]="true" (onHide)='hideDialog()'>

 <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="Name" placeholder="Name" formControlName="Name" [invalid]="isInvalid('Name')" />
        @if (isInvalid('Name')) {
            <p-message severity="error" size="small" variant="simple">lName is required.</p-message>
        }
    </div>
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="Surname" placeholder="Surname" formControlName="Surname" [invalid]="isInvalid('Surname')" />
        @if (isInvalid('Surname')) {
            @if (exampleForm.get('Surname')?.errors?.['required']) {
                <p-message severity="error" size="small" variant="simple">surname is required.</p-message>
            }
            <!-- @if (exampleForm.get('surname')?.errors?.['surname']) {
                <p-message severity="error" size="small" variant="simple">Please enter a valid surname.</p-message>
            } -->
        }

        <!-- <div class="flex flex-col gap-1">
  <input pInputText type="text" id="department" placeholder="Phone Number" formControlName="department" [invalid]="isInvalid('department')" />
  @if (isInvalid('department')) {
    @if (exampleForm.get('department')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('department')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid department number.</p-message>
    } -->
  <!-- } -->
<!-- </div> -->

    </div>

  <button pButton type="save" icon="pi pi-check" label="Save"></button>
</form> 

           
            <ng-template #footer>
            </ng-template>
        </p-dialog>
    `,
    providers: [MessageService, PatientService, ConfirmationService]


    
})
export class PatientAddUpdate implements OnInit, OnChanges {
    
    @Input() patientDialog: boolean = false;
    @Input() editPatientData!: PatientModel;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() patientSaved = new EventEmitter<void>();


    patient!: PatientModel;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    exampleForm: any;
    dialog: boolean | undefined;
     


    constructor(
         
        private patientService: PatientService,
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
              Surname: ['', [Validators.required, Validators.required]],
              Type: ['Patient'],
            //   department: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]]
            });
          }

          ngOnChanges(changes: SimpleChanges): void {
            if (changes['patientDialog'] && changes['patientDialog'].currentValue) {
   if (this.editPatientData) {
    this.exampleForm.patchValue({
        Name: this.editPatientData.name,
        Surname: this.editPatientData.surname,
        Type: 'Patient',
        // department: this.editPatientData.department
      });
      this.patient = { ...this.editPatientData }; // update mode
} else {
    this.patient = {
      id: '',
      name: '',
      surname: '',
      type:'Patient',
    //   department: '',
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
        
                const patient: PatientModel = {
                    ...this.patient,
                    name: formData.Name,
                    surname: formData.Surname,
                    type: formData.Type,
                    // department: formData.department
                };
        
                if (this.patient?.id) {
                    this.patientService.updatePatient(patient).subscribe
                    ({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Updated',
                                detail: 'Patient updated successfully'
                            });
                            this.patientSaved.emit();
                            this.closeDialog();
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update patient'
                            });
                        }
                    });
                } else {
                    // debugger
                     this.patientService.addPatient(patient).subscribe
                    (
                        {
                        next: () => {
                            
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Added',
                                detail: 'Patient added successfully'
                            });
                            this.patientSaved.emit(); 
                            this.closeDialog();
                            this.exampleForm.reset(); 
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add patient'
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
        this.patient = { surname: '', id: '', name: '', type:'Patient' };
        this.submitted = false;
        this.patientDialog = true;
    }

editPatient(patient: PatientModel) {
  this.patient = { ...patient };  
  this.patientDialog = true;

  this.exampleForm.patchValue({
    Name: patient.name,
    Surname: patient.surname,
    Type: patient.type,

    // department: patient.department
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
        if (this.patient.name?.trim()) {
            if (this.patient.id) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Patient Updated',
                    life: 3000
                });
            } else {
                this.patient.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Patient Created',
                    life: 3000
                });
            }

            this.patientDialog = false;
            this.patient = { surname: '', id: '', name: '', type:'Patient'};
        }
    }
}
