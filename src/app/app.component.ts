import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from './services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent implements OnInit {

  /**
   * ATTRIBUTES
   */
  closeResult = '';
  pokedexForm: FormGroup;
  idFirebase: string;
  actualizar: boolean;
  config: any;
  collection = { count: 0, data: [] }

  /**
   * CONSTRUCTOR
   * @param modalService 
   * @param fb 
   * @param firebaseServiceService 
   */
  constructor(private modalService: NgbModal, public fb: FormBuilder, private firebaseServiceService: FirebaseServiceService) { 

  }

  /**
   * METODO INVOCADO AL CARGAR LA APLICACIÓN
   */
  ngOnInit(): void {
    this.idFirebase = "";
    this.actualizar = false; //Cambiando de valor muestra en los Modal de la Vista un botón u otro en un mismo Modal.
    //configuracion para la paginación
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.data.length
    };
    //inicializando formulario para guardar los Pokemon
    this.pokedexForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
    });
    //cargando todos los Pokemons de Firebase
    this.firebaseServiceService.getPokemon().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          idFirebase: e.payload.doc.id,
          id: e.payload.doc.data().id,
          nombre: e.payload.doc.data().nombre,
          tipo: e.payload.doc.data().tipo
        }
      })
    },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * ESCUCHADOR DE EVENTOS PARA CAMBIAR DE PÁGINA EN LA VISTA
   * @param event
   */
  pageChanged(event) {
    this.config.currentPage = event;
  }

  /**
   * DELETE COMPONENT
   * @param item 
   */
  deleteComponent(item: any): void {
    this.firebaseServiceService.deletePokemon(item.idFirebase);
  }


  /**
   * CREATE COMPONENT
   */
  createComponent(): void {
    this.firebaseServiceService.createPokemon(this.pokedexForm.value).then(resp => {
      this.pokedexForm.reset();
      this.modalService.dismissAll();
    }).catch(error => {
      console.error(error)
    })
  }

  /**
   * UPDATE COMPONENT
   */
  updateComponent(): void {
    if (!isNullOrUndefined(this.idFirebase)) {
      this.firebaseServiceService.updatePokemon(this.idFirebase, this.pokedexForm.value).then(resp => {
        this.pokedexForm.reset();
        this.modalService.dismissAll();
      }).catch(error => {
        console.error(error);
      });
    }
  }

  /**
   * CONTROLADOR DEL MODAL PARA LA VISTA DE CREACIÓN
   * @param content 
   */
  open(content) {
    this.actualizar = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * CONTROLADOR DEL MODAL PARA LA VISTA DE EDICIÓN
   * @param content 
   * @param item 
   */
  openOnEdit(content, item: any) {

    //llenar form para editar
    this.pokedexForm.setValue({
      id: item.id,
      nombre: item.nombre,
      tipo: item.tipo,
    });
    this.idFirebase = item.idFirebase;
    this.actualizar = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * CONTROLADOR DE MODAL PARA CERRAR EL MODAL
   * @param reason 
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}