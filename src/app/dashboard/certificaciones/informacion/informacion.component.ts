import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';


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

@Component({
  selector: 'app-informacion',
  imports: [MatTableModule,MatButtonModule],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss'
})
export class InformacionComponent {
  displayedColumns: string[] = ['position', 'semestre', 'promedio', 'literal', 'obs'];
  dataSource = ELEMENT_DATA;

  print(){
    window.print();
  }
}
