import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import { Subscription } from 'rxjs';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cargado',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, MatButtonModule, CommonModule],
  templateUrl: './cargado.component.html',
  styleUrl: './cargado.component.scss'
})

export class CargadoComponent implements OnInit, OnDestroy {
  options: Option[] = [
    { value: 'primerSemestre', viewValue: 'Primer Semestre' },
    { value: 'segundoSemestre', viewValue: 'Segundo Semestre' },
    { value: 'tercerSemestre', viewValue: 'Tercer Semestre' },
    { value: 'cuartoSemestre', viewValue: 'Cuarto Semestre' },
    { value: 'quintoSemestre', viewValue: 'Quinto Semestre' },
    { value: 'sextoSemestre', viewValue: 'Sexto Semestre' },
    { value: 'basico', viewValue: 'Básico' },
    { value: 'avanzado', viewValue: 'Avanzado' }
  ];

  estudiante: any = null;
  nivelSeleccionado: string = '';
  private subscription!: Subscription;

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.subscription = this.estudianteService.estudianteData$.subscribe(data => {
      this.estudiante = data;
      console.log("Datos recibidos:", data);
    });
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  edit(){

  }

  save(){

  }

  obtenerNotas(){

  }
}
