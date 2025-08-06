import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Recent Sales</div>
        <p-table [value]="hospitals" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Image</th>
                    <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-hospital>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                        <img src="https://primefaces.org/cdn/primevue/images/hospital/{{ hospital.image }}" class="shadow-lg" alt="{{ hospital.name }}" width="50" />
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ hospital.name }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ hospital.price | currency: 'USD' }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: []
})
export class RecentSalesWidget {
    hospitals!: any[];

    constructor() {}

    ngOnInit() {
        
    }
}
