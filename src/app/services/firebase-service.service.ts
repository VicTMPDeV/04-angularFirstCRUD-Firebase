import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({providedIn: 'root'})
export class FirebaseServiceService {

  constructor(private firestore: AngularFirestore) { }

  /**
   * CREATE on FireBase
   * @param pokemon Pokemon a crear
   */
  createPokemon(pokemon:any){
    return this.firestore.collection("pokedex").add(pokemon);
  }

  /**
   * READ 
   * lista todos los Pokemons
   */
  getPokemon(){
    return this.firestore.collection("pokedex").snapshotChanges();
  }

  /**
   * UPDATE 
   * Actualiza un Pokemon existente en firebase
   * @param id id de la coleccion en firebase
   * @param pokemon Pokemon a actualizar
   */
  updatePokemon(id:any, pokemon:any){
    return this.firestore.collection("pokedex").doc(id).update(pokemon);
  }


  /**
   * DELETE
   * borra un Pokemon existente en firebase
   * @param id id de la coleccion en firebase
   */
  deletePokemon(id:any){
    return this.firestore.collection("pokedex").doc(id).delete();
  }

}
