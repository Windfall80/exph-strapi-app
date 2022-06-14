import { Component, OnInit } from '@angular/core';
import { MatChip, MatChipListChange } from '@angular/material/chips';

@Component({
  selector: 'app-side-search',
  templateUrl: './side-search.component.html',
  styleUrls: ['./side-search.component.scss']
})
export class SideSearchComponent implements OnInit {
  public methods = [
    {id: 0, name: "Tarjeta Débito / Crédito"},
    {id: 1, name: "Cheque"},
    {id: 2, name: "Transferencía bancaria"}
  ];

  public installment = [
    {id: 0, name: "7 Días"},
    {id: 1, name: "15 Días"},
    {id: 2, name: "30 Días"},
    {id: 3, name: "60 Días"},
    {id: 4, name: "90 Días"},
    {id: 5, name: "120 Días"},
    {id: 6, name: "Contra entrega"},
    {id: 7, name: "Inmediata"},
  ];
  constructor() { }

  ngOnInit(): void {
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected(true);
  }

  setMethods(ev: MatChipListChange){
    console.log(ev);
  }

  setInstallments(ev: MatChipListChange){
    console.log(ev);
  }
}
