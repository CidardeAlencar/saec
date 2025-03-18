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

        estudiante['id'] = ci; // 📌 Agregar el ID del documento a los datos del estudiante
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


  async guardarFirmas(jefe: string, comandante: string) {
    try {
      const firmaRef = doc(this.firestore, 'firmas/1');
      await setDoc(firmaRef, { jefe, comandante }, { merge: true });
      console.log("Firmas guardadas en Firebase");
      return true;
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      return false;
    }
  }

  async obtenerFirmas() {
    try {
      const firmaRef = doc(this.firestore, 'firmas/1');
      const firmaSnap = await getDoc(firmaRef);
  
      if (firmaSnap.exists()) {
        const firmas = firmaSnap.data();
        console.log("Firmas obtenidas:", firmas);
        return firmas;
      } else {
        console.log("No se encontraron firmas en Firebase.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener las firmas:", error);
      return null;
    }
  }

  async obtenerNotas(ci: string) {
    try {
      const finalPrimeroRef = doc(this.firestore, `estudiante/${ci}/basico/finalPrimero`);
      const notaPrimeroSnap = await getDoc(finalPrimeroRef);
      
      const finalSegundoRef = doc(this.firestore, `estudiante/${ci}/basico/finalSegundo`);
      const notaSegundoSnap = await getDoc(finalSegundoRef);

      let notas = {
        notaPrimero: null,
        notaSegundo: null
      };

      if (notaPrimeroSnap.exists()) {
        notas.notaPrimero = notaPrimeroSnap.data()?.['nota'];
      }

      if (notaSegundoSnap.exists()) {
        notas.notaSegundo = notaSegundoSnap.data()?.['nota'];
      }

      console.log("Notas obtenidas:", notas);
      return notas;

    } catch (error) {
      console.error("Error al obtener las notas:", error);
      return { notaPrimero: null, notaSegundo: null };
    }
}


}
