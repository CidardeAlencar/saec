import { Component, inject, model, signal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface PeriodicElement {
  semestre: string;
  position: number;
  promedio: number;
  literal: string;
  obs: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, semestre: 'primer', promedio: 80.20, literal: 'Ochenta punto veinte', obs:'n/a'},
  {position: 2, semestre: 'segundo', promedio: 84.00, literal: 'Ochenta y cuatro punto cero', obs:''},
  {position: 3, semestre: 'final', promedio: 82.10, literal: 'Ochenta y dos punto diez', obs:''},
  // {position: 4, semestre: 'Beryllium', promedio: 9.0122, literal: 'Be', obs:''},
  // {position: 5, semestre: 'Boron', promedio: 10.811, literal: 'B', obs:''},
  // {position: 6, semestre: 'Carbon', promedio: 12.0107, literal: 'C', obs:''},
  // {position: 7, semestre: 'Nitrogen', promedio: 14.0067, literal: 'N', obs:''},
  // {position: 8, semestre: 'Oxygen', promedio: 15.9994, literal: 'O', obs:''},
  // {position: 9, semestre: 'Fluorine', promedio: 18.9984, literal: 'F', obs:''},
  // {position: 10, semestre: 'Neon', promedio: 20.1797, literal: 'Ne', obs:''},
];

export interface DialogData {
  jefe: string;
  comandante: string;
}

@Component({
  selector: 'app-informacion',
  imports: [MatTableModule,MatButtonModule,MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
  readonly jefe = signal('');
  readonly comandante = signal('');
  // readonly name = model('');
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['position', 'semestre', 'promedio', 'literal', 'obs'];
  dataSource = ELEMENT_DATA;


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {jefe: this.jefe(), comandante: this.comandante()},
      // data: {jefe: '', comandante: ''},
      width:'400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result) {
        this.jefe.set(result.jefe);
        this.comandante.set(result.comandante);
      }
    });
  }
  print(){
    window.print();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  // readonly jefe = model(this.data.jefe);
  // readonly comandante = model(this.data.comandante);
  jefe = this.data.jefe;
  comandante = this.data.comandante

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(){
    console.log(this.jefe);
    console.log(this.comandante);
    this.dialogRef.close({ jefe: this.jefe, comandante: this.comandante });
  }
}
