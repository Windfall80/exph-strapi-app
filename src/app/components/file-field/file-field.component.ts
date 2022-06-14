import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})
export class FileFieldComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() size: 'sm'|'md'|'lg' = 'md';
  @Input() direction: 'col'|'row' = 'col';
  @Input() itemAlign: 'start'|'center'|'end' = 'center'
  @Input() accept: string;
  @Input() showStatus: boolean = false;
  @Input() statusPosition: 'before'|'after' = 'before';
  @Input() showPreview: boolean = false;
  @Input() filePlaceholder: any = null;
  @Input() placeholder: string;
  @Input() hint: string;
  public imgSrc: any;

  constructor() { }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.form.get(`${this.field}_source`)?.patchValue(file);
      if(this.showPreview){
        if(file.type.startsWith('image/')){
          var reader = new FileReader();
          reader.onload = (event:any) => { this.imgSrc = event.target.result; }
          reader.readAsDataURL(event.target.files[0]);
        } else {
          this.imgSrc = null;
        }
      }
    } else {
      this.form.get(`${this.field}_source`)?.patchValue(null);
      this.imgSrc = null;
    }
    this.form.get(`${this.field}`)?.updateValueAndValidity({emitEvent: true});
  }

  public getFilename(dir: string){
    if(dir){
      var fileName = dir.split("\\").pop();
      return fileName;
    }
    return null;
  }

  public clear(){
    this.form.get(`${this.field}`)?.patchValue(null);
    this.form.get(`${this.field}_source`)?.patchValue(null);
    this.imgSrc = null;
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

}
