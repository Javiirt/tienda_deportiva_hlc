import { Component } from '@angular/core';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  productoEditando: Producto;
  arrayColeccionProductos: any = [{
    id: "",
    data: {} as Producto
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.productoEditando = {} as Producto;
    this.obtenerListaProductos();
  }

  obtenerListaProductos() {
    this.firestoreService.consultar('productos').subscribe((resultadoConsultaProductos: any) => {
      this.arrayColeccionProductos = [];
      resultadoConsultaProductos.forEach((datosProducto: any) => {
        this.arrayColeccionProductos.push({
          id: datosProducto.payload.doc.id,
          data: datosProducto.payload.doc.data()
        });
      });
    });
  }

  selectProducto(id: string): void {
    this.router.navigate(['/detalle', id]);
  }

  crearProducto(): void {
    this.router.navigate(['/detalle']);
  }
}