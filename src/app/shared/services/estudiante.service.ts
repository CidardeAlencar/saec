import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private estudianteData = new BehaviorSubject<any>(null);
  estudianteData$ = this.estudianteData.asObservable();

  constructor(private firestore: Firestore) {}

  // Buscar en Firestore por CI
  async buscarEstudiantePorCI(ci: string) {
    try {
      const estudianteRef = doc(this.firestore, `estudiante/${ci}`);
      const estudianteSnap = await getDoc(estudianteRef);

      if (estudianteSnap.exists()) {
        const estudiante = estudianteSnap.data();
        console.log("Estudiante encontrado:", estudiante);

        // Guardar datos para compartir entre componentes
        this.estudianteData.next(estudiante);
        return true;
      } else {
        console.log("No se encontró ningún estudiante con ese CI.");
        this.estudianteData.next(null);
        return false;
      }
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
      return false;
    }
  }

  // Guardar en Firestore en la colección "firmas" con ID "1"
  async guardarFirmas(jefe: string, comandante: string) {
    try {
      const firmaRef = doc(this.firestore, 'firmas/1');
      await setDoc(firmaRef, { jefe, comandante }, { merge: true }); // 📌 Guarda sin sobrescribir otros datos
      console.log("Firmas guardadas en Firebase");
      return true;
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      return false;
    }
  }
}
