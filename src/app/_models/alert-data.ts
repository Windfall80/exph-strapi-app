export interface AlertData {
  title?: string;
  text?: string;
  input?: 'normal' | 'textarea' | 'select' | 'pills';
  multiple?: boolean;
  inputType?: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week',
  inputRequired?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputOptions?: {id: number, name: string}[];
  showCancelButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  width?: string;
  showDetails?(value: number[]): boolean;
}
