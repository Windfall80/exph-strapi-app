import { Component, Inject, OnInit } from '@angular/core';
import { MatChip, MatChipListChange } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertData } from "@app/_models";
@Component({
  selector: 'app-alert-template',
  templateUrl: './alert-template.component.html',
  styleUrls: ['./alert-template.component.scss']
})
export class AlertTemplateComponent implements OnInit {
  public value: any = null;
  public details: string = null!;

  private defaults: AlertData = {
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    inputRequired: false,
  }

  constructor(
    public dialogRef: MatDialogRef<AlertTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData
  ) {
    this.data = {...this.defaults, ...this.data};
  }

  ngOnInit(): void {
  }

  setValue(ev: MatChipListChange){
    this.value = ev.value;
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected(true);
  }

}
