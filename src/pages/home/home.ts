import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as tf from '@tensorflow/tfjs';
import { DrawableDirective } from '../../directives/drawable/drawable';


// declare var tf;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  linearModel: tf.Sequential;
  prediction: any;
  InputTaken: any;
  model: tf.Model;
  ctx: CanvasRenderingContext2D;
  pos = { x: 0, y: 0 };
  canvasElement: any;

  @ViewChild(DrawableDirective) canvas;

  constructor(public navCtrl: NavController,
    public el: ElementRef,
    public renderer: Renderer,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    this.loadModel();
  }


  // cargando modelo
  async loadModel() {
    this.model = await tf.loadModel('http://192.168.1.36:8888/tensor');
    console.log(this.model, ' - load model')
  }

  // tomara los datos de la imagen como input  
  async predict(imageData: ImageData) {


    // La llamada de tf.tidy (). tf.tidy () es muy útil ya que usaremos el 
    // modelo en un dispositivo móvil que generalmente no tiene una memoria 
    // muy grande, por lo tanto nos ayudará a evitar las fugas de memoria y 
    // liberará la memoria utilizada por cualquier tensor particular tan pronto 
    // como sea posible. Ese tensor no sirve de nada.
    const pred = await tf.tidy(() => {

      // Estamos almacenando el valor de tipo tf.tensor3D en img generado a 
      // partir de los valores de píxeles de la imagen
      let img = tf.fromPixels(imageData, 1);

      // Luego estamos cambiando la imagen a la 
      // forma en que nuestro modelo fue entrenado originalmente.
      img = img.reshape([1, 28, 28, 1]);

      // Y luego estamos encasillando el tipo img para float32
      img = tf.cast(img, 'float32');

      // Ahora le damos img como entrada a la función model.predict y 
      // ponemos su salida en la salida de la variable, cuya entrada, 
      // está almacenando la salida como matriz en la variable de predicción.
      const output = this.model.predict(img) as any;

      console.log(output, ' output')

      // Guardando predicción en el componente
      this.prediction = Array.from(output.dataSync());

      console.log(this.predict, ' predict')
    });

  }

  eraseButton() {
    // limpiando predicción
    this.prediction = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.canvas.clear();
  }

}