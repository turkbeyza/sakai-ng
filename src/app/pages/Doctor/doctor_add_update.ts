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
import {DoctorService } from '../service/doctor.service';
import { DoctorModel } from './doctor_model';

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
    selector: 'app-doctor-add-update',
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


<p-dialog [(visible)]="doctorDialog" [style]="{ width: '450px' }" header="Add Doctor" [modal]="true" (onHide)='hideDialog()'>

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
    providers: [MessageService, DoctorService, ConfirmationService]


    
})
export class DoctorAddUpdate implements OnInit, OnChanges {
    
    @Input() doctorDialog: boolean = false;
    @Input() editDoctorData!: DoctorModel;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() doctorSaved = new EventEmitter<void>();


    doctor!: DoctorModel;

    submitted: boolean = false;


    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    exampleForm: any;
    dialog: boolean | undefined;
     


    constructor(
         
        private doctorService: DoctorService,
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
              Type: ['Doctor'],
            //   department: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]]
            });
          }

          ngOnChanges(changes: SimpleChanges): void {
            if (changes['doctorDialog'] && changes['doctorDialog'].currentValue) {
   if (this.editDoctorData) {
    this.exampleForm.patchValue({
        Name: this.editDoctorData.name,
        Surname: this.editDoctorData.surname,
        Type: 'Doctor',
        // department: this.editDoctorData.department
      });
      this.doctor = { ...this.editDoctorData }; // update mode
} else {
    this.doctor = {
      id: '',
      name: '',
      surname: '',
      type:'Doctor',
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
        
                const doctor: DoctorModel = {
                    ...this.doctor,
                    name: formData.Name,
                    surname: formData.Surname,
                    type: formData.Type,
                    // department: formData.department
                };
        
                if (this.doctor?.id) {
                    this.doctorService.updateDoctor(doctor).subscribe
                    ({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Updated',
                                detail: 'Doctor updated successfully'
                            });
                            this.doctorSaved.emit();
                            this.closeDialog();
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update doctor'
                            });
                        }
                    });
                } else {
                    // debugger
                     this.doctorService.addDoctor(doctor).subscribe
                    (
                        {
                        next: () => {
                            
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Added',
                                detail: 'Doctor added successfully'
                            });
                            this.doctorSaved.emit(); 
                            this.closeDialog();
                            this.exampleForm.reset(); 
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add doctor'
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
        this.doctor = { surname: '', id: '', name: '', type:'Doctor' };
        this.submitted = false;
        this.doctorDialog = true;
    }

editDoctor(doctor: DoctorModel) {
  this.doctor = { ...doctor };  
  this.doctorDialog = true;

  this.exampleForm.patchValue({
    Name: doctor.name,
    Surname: doctor.surname,
    Type: doctor.type,

    // department: doctor.department
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
        if (this.doctor.name?.trim()) {
            if (this.doctor.id) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Doctor Updated',
                    life: 3000
                });
            } else {
                this.doctor.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Doctor Created',
                    life: 3000
                });
            }

            this.doctorDialog = false;
            this.doctor = { surname: '', id: '', name: '', type:'Doctor'};
        }
    }
}
