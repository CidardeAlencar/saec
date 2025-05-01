import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule,ReactiveFormsModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.scss'
})
export class BusquedaComponent {
  readonly ci = new FormControl('', [Validators.required]);

  constructor(
    private router:Router,
    private estudianteService: EstudianteService,
  ){}

  async buscar(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const ciValue = this.ci.value?.trim();
    if (!ciValue) {
      Swal.fire("Advertencia", "Ingrese un CI válido.", "warning");
      return;
    }

    const encontrado = await this.estudianteService.buscarEstudiantePorCI(ciValue);
    console.log(encontrado);
    if (encontrado) {
      this.router.navigate(['/dashboard/certificaciones/informacion']);
    } else {
      Swal.fire("Error", "No se encontró un estudiante con ese CI.", "error");
    }
  }

  preventSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  

}
