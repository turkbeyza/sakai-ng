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
import { FileSelectEvent, FileUploadEvent, FileUploadModule, UploadEvent } from 'primeng/fileupload';

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
    FileUploadModule 
    
],
    template: `


<p-dialog [(visible)]="resultsDialog" [style]="{ width: '450px' }" header="Add Results" [modal]="true" (onHide)='hideDialog()'>

 <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="appointmentId" placeholder="AppointmentId" formControlName="appointmentId" [invalid]="isInvalid('appointmentId')" />
        @if (isInvalid('appointmentId')) {
            <p-message severity="error" size="small" variant="simple">lName is required.</p-message>
        }
    </div>
    <div class="flex flex-col gap-1">
        <input pInputText type="text" id="fileName" placeholder="FileName" formControlName="fileName" [invalid]="isInvalid('fileName')" />
        @if (isInvalid('fileName')) {
            @if (exampleForm.get('fileName')?.errors?.['required']) {
                <p-message severity="error" size="small" variant="simple">fileName is required.</p-message>
            }
            @if (exampleForm.get('fileName')?.errors?.['fileName']) {
                <p-message severity="error" size="small" variant="simple">Please enter a valid fileName.</p-message>
            }
        }

        <div class="flex flex-col gap-1">
        <div class="flex flex-col gap-1">

        
   <!-- <p-fileUpload 
    name="file" 
    mode="basic" 
    chooseLabel="Choose PDF" 
    chooseIcon="pi pi-upload" 
    accept="application/pdf" 
    [auto]="true"
    maxFileSize="5000000"
    (onUpload)="onUpload($event)"
    (onClear)="onFileClear()" />
  @if (isInvalid('filePath')) {
    <p-message severity="error" size="small" variant="simple">PDF file is required.</p-message>
  } -->




  <div class="card flex flex-wrap gap-6 items-center justify-between">
    <p-toast />
    <p-fileupload #fu (onSelect)='onSelectEvent($event)' mode="basic" chooseLabel="Choose" chooseIcon="pi pi-upload" name="demo[]"  accept="application/pdf" maxFileSize="1000000" (onUpload)="onUpload($event)" />
</div>

</div> 



  <!-- <div class="flex flex-col gap-1">
  <input pInputText type="text" id="createdAt" placeholder="CreatedAt" formControlName="createdAt" [invalid]="isInvalid('createdAt')" />
  @if (isInvalid('createdAt')) {
    @if (exampleForm.get('createdAt')?.errors?.['required']) {
      <p-message severity="error" size="small" variant="simple">Phone number is required.</p-message>
    }
    @if (exampleForm.get('createdAt')?.errors?.['pattern']) {
      <p-message severity="error" size="small" variant="simple">Please enter a valid filePath.</p-message>
    } -->
  <!-- }
</div> -->


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
  
  onUpload(event: UploadEvent) {
    debugger
    // this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
}
// onFileClear() {
// throw new Error('Method not implemented.');
// }
// onFileSelect($event: FileSelectEvent) {
// throw new Error('Method not implemented.');
// }
    
    @Input() resultsDialog: boolean = false;
    @Input() editResultsData!: ResultsModel;

    @Output() changeProductDialogvisibile = new EventEmitter<boolean>();
    @Output() resultsSaved = new EventEmitter<void>();


    results!: ResultsModel

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

    onSelectEvent(event:FileSelectEvent){
      this.exampleForm.get("file").setValue(event.files[0])
    }
    exportCSV() {
        this.dt.exportCSV();
    }

    
        ngOnInit() {
            this.exampleForm = this.fb.group({
              appointmentId: ['', Validators.required],
              file: [null, [Validators.required, Validators.required]],
              createdAt: ['',]
            });
          }

          ngOnChanges(changes: SimpleChanges): void {
            if (changes['resultsDialog'] && changes['resultsDialog'].currentValue) {
                debugger
   if (this.editResultsData) {
    this.exampleForm.patchValue({
        appointmentId: this.editResultsData.appointmentId,
        file: this.editResultsData.file,
        createdAt: this.editResultsData.createdAt,
      });
      this.results = { ...this.editResultsData }; // update mode
} else {
    this.results = {
      id: '',
      appointmentId: '',
      file: null,
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
      

// onSubmit() {
        
//             if (this.exampleForm.valid) {
                
//                 const formData = this.exampleForm.value;
        
//                 const results: ResultsModel = {
//                     ...this.results,
//                     appointmentId: formData.appointmentId,
//                     fileName: formData.fileName,
//                     filePath: formData.filePath,
//                     createdAt: formData.createdAt,
//                 };
        
//                 if (this.results?.id) {
//                     this.resultsService.updateResults(results).subscribe({
//                         next: () => {
//                             this.messageService.add({
//                                 severity: 'success',
//                                 summary: 'Updated',
//                                 detail: 'Results updated successfully'
//                             });
//                             this.resultsSaved.emit();
//                             this.closeDialog();
//                         },
//                         error: () => {
//                             this.messageService.add({
//                                 severity: 'error',
//                                 summary: 'Error',
//                                 detail: 'Failed to update results'
//                             });
//                         }
//                     });
//                 } else {
                    
//                     this.resultsService.addResults(results).subscribe({
//                         next: () => {
                            
//                             this.messageService.add({
//                                 severity: 'success',
//                                 summary: 'Added',
//                                 detail: 'Results added successfully'
//                             });
//                             this.resultsSaved.emit(); 
//                             this.closeDialog();
//                             this.exampleForm.reset(); 
//                         },
//                         error: () => {
//                             this.messageService.add({
//                                 severity: 'error',
//                                 summary: 'Error',
//                                 detail: 'Failed to add results'
//                             });
//                         }
//                     });
//                 }
//             } else {
//                 this.exampleForm.markAllAsTouched();
//                 this.messageService.add({
//                     severity: 'warn',
//                     summary: 'Validation Error',
//                     detail: 'Please complete the form before submitting.'
//                 });
//             }
//         }


    closeDialog() {
        
        this.changeProductDialogvisibile.emit(false)
    }
    
    openNew() {
        this.results = {   id: '',
        appointmentId: '',
        file: null,
        createdAt: new Date() };
        this.submitted = false;
        this.resultsDialog = true;
    }

editResults(results: ResultsModel) {
  this.results = { ...results };  
  this.resultsDialog = true;

  this.exampleForm.patchValue({
    appointmentId: results.appointmentId,
    file: results.file,
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
            file: null,
            createdAt: new Date() };
        }
    }

    onFileSelect(event: FileSelectEvent) {
        const file = event.files[0];
        if (file) {
          // Sadece dosya adını form'a set ediyoruz
          // Eğer backend'e yükleme yapacaksan burada yükleme çağrısı yapabilirsin
          this.exampleForm.patchValue({ filePath: file.name });
        }
      }
      
      onFileClear() {
        this.exampleForm.patchValue({ filePath: '' });
      }
      
      onSubmit() {
        debugger
        if (this.exampleForm.valid) {
            const data = new FormData();
            const fileToUpload = this.exampleForm.value.file as File;
            data.append('file', fileToUpload, fileToUpload.name);
            data.append('appointmentId', this.exampleForm.value.appointmentId);
            data.append('createdAt', this.exampleForm.value.createdAt);



          const formData = this.exampleForm.value;
      
          const results: ResultsModel = {
            ...this.results,
            appointmentId: formData.appointmentId,
            file: formData.file,
            createdAt: new Date() // CreatedAt otomatik atanıyor
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
            this.resultsService.addResults(data).subscribe({
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
      
}
