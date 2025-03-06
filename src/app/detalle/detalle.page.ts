import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {

  id: string = "";
  isEditMode: boolean = false;
  producto: Producto = {} as Producto;
  imagenSelec: string = "";

  constructor(
    private firestoreService: FirestoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
  ) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido) {
      this.id = idRecibido;
      this.isEditMode = true;
      this.firestoreService.consultarporId('productos-javier', this.id).subscribe((resultado: any) => {
        if (resultado.payload.data() != null) {
          this.producto = resultado.payload.data();
        } else {
          this.producto = {} as Producto;
        }
      });
    } else {
      this.isEditMode = false;
      this.producto = {} as Producto;
    }
  }

  guardarProducto() {
    if (this.isEditMode) {
      this.firestoreService.actualizar('productos-javier', this.id, this.producto).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      this.firestoreService.insertar('productos-javier', this.producto).then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: '¿Estás seguro de que deseas borrar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Borrar',
          handler: () => {
            this.borrarProducto();
          }
        }
      ]
    });

    await alert.present();
  }

  borrarProducto() {
    this.firestoreService.borrar('productos-javier', this.id).then(() => {
      this.router.navigate(['/home']);
    });
  }

  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then((result) => {
      // Si no tiene permiso de lectura se solicita al usuario
      if (result == false) {
        this.imagePicker.requestReadPermission();
      } else {
        // Abrir selector de imágenes (ImagePicker)
        this.imagePicker.getPictures({
          maximumImagesCount: 1,  // Permitir sólo 1 imagen
          outputType: 1           // 1 = Base64
        }).then((results) => {
          // En la variable results se tienen las imágenes seleccionadas
          if (results.length > 0) { // Si el usuario ha elegido alguna imagen
            // EN LA VARIABLE imagenSelec QUEDA ALMACENADA LA IMAGEN SELECCIONADA
            this.imagenSelec = "data:image/jpeg;base64," + results[0];
            console.log("Imagen que se ha seleccionado (en Base64): " + this.imagenSelec);
          }
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }



  async subirImagen() {
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });

    // Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes-javier";

    // Mostrar el mensaje de espera
    loading.present();

    // Asignar el nombre de la imagen en función de la hora actual para
    // evitar duplicidades de nombres
    let nombreImagen = `${new Date().getTime()}`;

    // Llamar al método que sube la imagen al Storage
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            // EN LA VARIABLE downloadURL SE OBTIENE LA DIRECCIÓN URL DE LA IMAGEN
            console.log("downloadURL: " + downloadURL);
            // this.document.data.imagenURL = downloadURL;

            // Mostrar el mensaje de finalización de la subida
            toast.present();

            // Ocultar mensaje de espera
            loading.dismiss();
          });
      });
  }


  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorURL(fileURL).then(() => {
      toast.present();
    }, (err) => {
      console.log(err);
    });
  }

}