import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import { Subscription } from 'rxjs';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-cargado',
  imports: [MatProgressSpinnerModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, MatButtonModule, CommonModule],
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

  materiasBasico = [
    { codigo: 'BAS-CMI-01-02', nombre: 'Correspondencia Militar' },
    { codigo: 'BAS-DCO-01-04', nombre: 'Documentación del Primero de Comp., Edron o Btr.' },
    { codigo: 'BAS-DOU-01-07', nombre: 'Doctrina de Operaciones Urbanas' },
    { codigo: 'BAS-EFM-01-01', nombre: 'Entrenamiento Físico Militar' },
    { codigo: 'BAS-EST-01-05', nombre: 'Estudio del Terreno' },
    { codigo: 'BAS-PLA-01-06', nombre: 'Planeamiento' },
    { codigo: 'BAS-RMI-01-01', nombre: 'Redacción Militar' },
    { codigo: 'COM-GEN-01-03', nombre: 'Normativa de Género' },
    { codigo: 'COM-LID-01-02', nombre: 'Liderazgo' },
    { codigo: 'PROY-I-II', nombre: 'Proyectos I y II' },
    { codigo: 'TEC-GAE-01-02', nombre: 'Geoprocesamiento y Análisis Espacial' },
    { codigo: 'TEC-MDT-01-04', nombre: 'Modelamiento Digital del Terreno y Simulación' },
    { codigo: 'TEC-PRS-01-05', nombre: 'Programación SIG.' },
    { codigo: 'TEC-RGE-01-03', nombre: 'Redes Geodésicas I' },
    { codigo: 'TEC-TOA-01-01', nombre: 'Topografía Automatizada' },
    { codigo: 'TEC-TOV-01-06', nombre: 'Topografía Vial' },
    { codigo: 'promedioDisciplina', nombre: 'Promedio disciplina' },
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' }
  ];
  materiasAvanzado = [
    { codigo: 'BAS-ASI-01-02', nombre: 'Asignatura Militar I' },
    { codigo: 'BAS-ASO-01-03', nombre: 'Asignatura Operativa' },
    { codigo: 'BAS-ASP-01-01', nombre: 'Asignatura Profesional' },
    { codigo: 'BAS-PICB-01-07', nombre: 'Plan Integral de Capacitación Básica' },
    { codigo: 'COM-CPM-01-01', nombre: 'Comunicación para el Mando' },
    { codigo: 'COM-SSU-01-02', nombre: 'Seguridad y Soporte de Unidades' },
    { codigo: 'EJT-AEM-01-01', nombre: 'Ejercicio de Aplicación Militar' },
    { codigo: 'PFD-EFM-01-01', nombre: 'Educación Física Militar' },
    { codigo: 'TEC-BDG-01-06', nombre: 'Base de Datos Geográficos' },
    { codigo: 'TEC-CTE-01-09', nombre: 'Cartografía Temática' },
    { codigo: 'TEC-GPR-01-04', nombre: 'Gestión de Proyectos' },
    { codigo: 'TEC-SCT-01-08', nombre: 'Sistemas de Control Topográfico' },
    { codigo: 'TEC-TIN-01-07', nombre: 'Tecnología de Información' },
    { codigo: 'TIT-TTE-01-01', nombre: 'Trabajo de Titulación' },
    { codigo: 'promedioDisciplina', nombre: 'Promedio disciplina' },
    { codigo: 'promedioFisico', nombre: 'Promedio fisico' }
  ];

  notasRegistradas: { [codigo: string]: number | null } = {};
  estudiante: any = null;
  nivelSeleccionado: string = '';
  cargandoNotas: boolean = false;
  editarNotas: boolean = false;
  codigo1Generado = '';
  codigo2Generado = '';
  codigo1Ingresado = '';
  codigo2Ingresado = '';
  puedeEditarTodo = false;
  private subscription!: Subscription;


  constructor(private estudianteService: EstudianteService, private firestore: Firestore) {}

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
    this.editarNotas = !this.editarNotas;
    this.codigo1Generado = Math.floor(100000 + Math.random() * 900000).toString();
    this.codigo2Generado = Math.floor(100000 + Math.random() * 900000).toString();
    this.enviarCodigosPorCorreo();
  }

  enviarCodigosPorCorreo() {
    console.log(`Código 1 para cidarandresdac@gmail.com: ${this.codigo1Generado}`);
    console.log(`Código 2 para cidardealencar@gmail.com: ${this.codigo2Generado}`);
  }


  editEnable() {
    if (
      this.codigo1Ingresado === this.codigo1Generado &&
      this.codigo2Ingresado === this.codigo2Generado
    ) {
      this.puedeEditarTodo = true;
      // editar aca
      alert('Autenticación correcta. Edición habilitada.');
    } else {
      alert('Códigos incorrectos. Intenta nuevamente.');
    }
  }


  getInputId(codigo: string): string {
    return 'nota_' + codigo.replace(/-/g, '_');
  }

  getHintId(codigo: string): string {
    return 'hint_' + codigo.replace(/-/g, '_');
  }


  async save() {
    if (!this.estudiante?.id || !this.nivelSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Debes seleccionar un nivel antes de continuar.'
      });
      return;
    }

    const ci = this.estudiante.id;
    const nivel = this.nivelSeleccionado;

    const codigosPorNivel: { [key: string]: string[] } = {
      basico: [
        'BAS-CMI-01-02',
        'BAS-DCO-01-04',
        'BAS-DOU-01-07',
        'BAS-EFM-01-01',
        'BAS-EST-01-05',
        'BAS-PLA-01-06',
        'BAS-RMI-01-01',
        'COM-GEN-01-03',
        'COM-LID-01-02',
        'PROY-I-II',
        'TEC-GAE-01-02',
        'TEC-MDT-01-04',
        'TEC-PRS-01-05',
        'TEC-RGE-01-03',
        'TEC-TOA-01-01',
        'TEC-TOV-01-06',
        'promedioDisciplina',
        'promedioFisico'
      ],
      avanzado: [
        'BAS-ASI-01-02',
        'BAS-ASO-01-03',
        'BAS-ASP-01-01',
        'BAS-PICB-01-07',
        'COM-CPM-01-01',
        'COM-SSU-01-02',
        'EJT-AEM-01-01',
        'PFD-EFM-01-01',
        'TEC-BDG-01-06',
        'TEC-CTE-01-09',
        'TEC-GPR-01-04',
        'TEC-SCT-01-08',
        'TEC-TIN-01-07',
        'TIT-TTE-01-01',
        'promedioDisciplina',
        'promedioFisico'
      ]
      // Puedes agregar aquí otros niveles como 'avanzado', 'primerSemestre', etc.
    };

    const codigos = codigosPorNivel[nivel] || [];

    for (const codigo of codigos) {
      try {
        const inputId = `nota_${codigo.replace(/-/g, '_')}`;
        const hintId = `hint_${codigo.replace(/-/g, '_')}`;

        const inputEl = document.getElementById(inputId) as HTMLInputElement;
        const hintEl = document.getElementById(hintId) as HTMLElement;

        if (!inputEl || !hintEl) {
          console.warn(`Elementos no encontrados para ${codigo}`);
          continue;
        }

        const nota = parseFloat(inputEl.value);
        const nombre = hintEl.innerText.trim();

        if (!isNaN(nota)) {
          const ref = doc(this.firestore, `estudiante/${ci}/${nivel}/${codigo}`);
          await setDoc(ref, {
            nota1: nota,
            nombre: nombre
          });
          console.log(`Guardado ${codigo}: nota=${nota}, nombre=${nombre}`);
        } else {
          console.warn(`Nota inválida para ${codigo}`);
        }

      } catch (error) {
        console.error(`Error al guardar nota de ${codigo}:`, error);
      }
    }
    this.nivelSeleccionado = '';
    this.puedeEditarTodo = false;
    // alert('Notas guardadas correctamente.');
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Notas guardadas correctamente.',
      timer: 2000,
      showConfirmButton: false
    });
  }

  async obtenerNotas() {
    this.cargandoNotas = true;
    try {
      const notas = await this.estudianteService.obtenerNotas(this.estudiante.id, this.nivelSeleccionado);
      this.notasRegistradas = {};
      console.log(notas);
      for (const codigo in notas) {
        this.notasRegistradas[codigo] = notas[codigo]?.nota ?? null;
      }
    } finally {
      this.cargandoNotas = false;
    }
  }

  onNivelChange() {
    if (this.estudiante?.id && this.nivelSeleccionado) {
      this.obtenerNotas();
      console.log("entra");
    }
  }

  validarRango(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = parseFloat(input.value);

    if (isNaN(valor) || valor < 0) {
      input.value = '0';
    } else if (valor > 100) {
      input.value = '100';
    }
  }

}
