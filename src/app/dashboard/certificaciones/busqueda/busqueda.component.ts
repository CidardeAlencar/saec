import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

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
  ){}

  clickEvent(event: MouseEvent) {
    this.router.navigate(['/dashboard/certificaciones/informacion']);
    event.stopPropagation();
  }
}
