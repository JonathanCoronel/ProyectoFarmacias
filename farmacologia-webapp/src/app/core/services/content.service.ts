import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
import { Subtopic } from '../../shared/interfaces/subtopic';
import firebase from 'firebase';
import firestore = firebase.firestore;
import { Content } from '../../shared/interfaces/content';

const CONTENTS_COLLECTION_NAME = 'contents';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private contentsReference!: AngularFirestoreCollection;

  constructor(
    private angularFirestore: AngularFirestore,
    private readonly angularFirePerformance: AngularFirePerformance
  ) {
    this.contentsReference = this.angularFirestore.collection(CONTENTS_COLLECTION_NAME);
  }

  public saveContent(content: Content): Observable<Content | null> {
    const saveProcess = from(this.createContent(content)).pipe(
      mergeMap(async (acc) => await this.saveInDB(acc)),
      catchError((err) => {
        return of(null);
      })
    );
    return saveProcess;
  }

  private async createContent(content: Content): Promise<Content> {
    const contentCreated: Content =  {
      id: `${ (new Date()).valueOf() }`,
      title: content.title,
      description: content.description,
      dateCreated: new Date(),
      subtopicId: content.subtopicId
    };
    return contentCreated;
  }

  private async saveInDB(content: Content): Promise<Content> {

    const batch = this.angularFirestore.firestore.batch();
    const contentReference = this.contentsReference.doc(`${content.id}`).ref;
    batch.set(contentReference, content);
    await batch.commit();

    return content;
  }

  /**
   * Get the firestore document of a Content
   * @param contentId Identifier of the Content
   */
  private contentDocument(contentId: string): AngularFirestoreDocument<Content> {
    return this.angularFirestore
      .collection(CONTENTS_COLLECTION_NAME)
      .doc<Subtopic>(contentId);
  }

  public contentReference(contentId: string): firestore.DocumentReference<Content> {
    return this.contentDocument(contentId).ref as firestore.DocumentReference<Content>;
  }

  public contentById(contentId: string): Observable<Content> {
    return this.contentDocument(contentId).get().pipe(
      map(snap => (snap.data() as Content))
    );
  }

  deleteContent(contentId: string | undefined): Promise<void> {
    return this.contentsReference.doc(contentId).delete();
  }

  public getContentsOfSubtopic(subtopicId: string): Observable<Array<Content>> {
    return this.angularFirestore.collection<Subtopic>(
      CONTENTS_COLLECTION_NAME,
      query => {
        return query.orderBy('dateCreated')
          .where('subtopicId', '==', subtopicId);
      }
    )
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.angularFirePerformance.trace('list-contents-of-subtopic');
          return doc;
        }),
        shareReplay(1)
      );
  }

  
  getCollectionsAdmin<tipo>(path: string){
    const collection = this.angularFirestore.collection<tipo>(path);
    return collection.valueChanges();
  }

  createId(){
    return this.angularFirestore.createId();
  }

  createDoc(data: any, path: string, id: string){
    const collection = this.angularFirestore.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string){
      return this.angularFirestore.collection(path).doc<tipo>(id).valueChanges();
  }

  updateDoc(path: string, id: string, data: any) {
      return this.angularFirestore.collection(path).doc(id).update(data)
  }

  deleteDoc(path: string, id: string) {
      return this.angularFirestore.collection(path).doc(id).delete();
  }

}
