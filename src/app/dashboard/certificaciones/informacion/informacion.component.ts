import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import { Subscription } from 'rxjs';

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
export class InformacionComponent implements OnInit, OnDestroy{
  estudiante: any = null;
  private subscription!: Subscription;
  readonly jefe = signal('');
  readonly comandante = signal('');
  // readonly name = model('');
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['position', 'semestre', 'promedio', 'literal', 'obs'];
  dataSource = ELEMENT_DATA;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  generandoPDF = false;

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit() {
    this.subscription = this.estudianteService.estudianteData$.subscribe(data => {
      this.estudiante = data;
      console.log("Datos recibidos:", data);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // 📌 Evita fugas de memoria
  }

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
    // window.print();
    this.generandoPDF = true;
    setTimeout(async () => { // ⏳ Espera que el contenido se renderice antes de capturarlo
      const content = this.pdfContent.nativeElement;
      const canvas = await html2canvas(content, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');
      const imgWidth = 216;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('certificacion.pdf');

      this.generandoPDF = false; // 📌 Ocultar la sección después de generar el PDF
    }, 500);
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
  private estudianteService = inject(EstudianteService);
  // readonly jefe = model(this.data.jefe);
  // readonly comandante = model(this.data.comandante);
  jefe = this.data.jefe;
  comandante = this.data.comandante

  onNoClick(): void {
    this.dialogRef.close();
  }

  // save(){
  //   console.log(this.jefe);
  //   console.log(this.comandante);
  //   this.dialogRef.close({ jefe: this.jefe, comandante: this.comandante });
  // }
  async save() {
    console.log("Guardando en Firebase:", this.jefe, this.comandante);
    
    const success = await this.estudianteService.guardarFirmas(this.jefe, this.comandante);
    
    if (success) {
      console.log("Datos guardados correctamente en Firebase");
      this.dialogRef.close({ jefe: this.jefe, comandante: this.comandante });
    } else {
      console.error("Error al guardar en Firebase");
    }
  }
}
