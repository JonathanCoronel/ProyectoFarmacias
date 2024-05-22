import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
import { Subtopic } from '../../shared/interfaces/subtopic';
import firebase from 'firebase';
import firestore = firebase.firestore;
import { UploadStorageService } from './upload-storage.service';

const SUBTOPICS_COLLECTION_NAME = 'subtopics';
const SUBTOPICS_BASE_PATH = '/subtopics';

@Injectable({
  providedIn: 'root'
})
export class SubtopicService {

  private subtopicsReference!: AngularFirestoreCollection;

  constructor(
    private uploadStorageService: UploadStorageService,
    private angularFirestore: AngularFirestore,
    private readonly angularFirePerformance: AngularFirePerformance
  ) {
    this.subtopicsReference = this.angularFirestore.collection(SUBTOPICS_COLLECTION_NAME);
  }

  public saveSubtopic(subtopic: Subtopic, image: File[]): Observable<Subtopic | null> {
    const saveProcess = from(this.createSubtopic(subtopic, image)).pipe(
      mergeMap(async (acc) => await this.saveInDB(acc)),
      catchError((err) => {
        return of(null);
      })
    );
    return saveProcess;
  }

  private async createSubtopic(subtopic: Subtopic, file): Promise<Subtopic> {
    const subtopicCreated: Subtopic =  {
      id: `${ (new Date()).valueOf() }`,
      title: subtopic.title,
      description: subtopic.description,
      dateCreated: new Date(),
      topicId: subtopic.topicId,
      image: await this.uploadStorageService.uploadImage(file, SUBTOPICS_BASE_PATH)
    };
    return subtopicCreated;
  }

  private async saveInDB(subtopic: Subtopic): Promise<Subtopic> {

    const batch = this.angularFirestore.firestore.batch();
    const subtopicReference = this.subtopicsReference.doc(`${subtopic.id}`).ref;
    batch.set(subtopicReference, subtopic);
    await batch.commit();

    return subtopic;
  }

  /**
   * Get the firestore document of a Subtopic
   * @param subtopicId Identifier of the Subtopic
   */
  private subtopicDocument(subtopicId: string): AngularFirestoreDocument<Subtopic> {
    return this.angularFirestore
      .collection(SUBTOPICS_COLLECTION_NAME)
      .doc<Subtopic>(subtopicId);
  }

  public subtopicReference(topicId: string): firestore.DocumentReference<Subtopic> {
    return this.subtopicDocument(topicId).ref as firestore.DocumentReference<Subtopic>;
  }

  public subtopicById(subtopicId: string): Observable<Subtopic> {
    return this.subtopicDocument(subtopicId).get().pipe(
      map(snap => (snap.data() as Subtopic))
    );
  }

  deleteSubtopic(subtopicId: string | undefined): Promise<void> {
    return this.subtopicsReference.doc(subtopicId).delete();
  }

  public getSubtopicsOfTopic(topicId: string): Observable<Array<Subtopic>> {
    return this.angularFirestore.collection<Subtopic>(
      SUBTOPICS_COLLECTION_NAME,
      query => {
        return query.orderBy('dateCreated')
          .where('topicId', '==', topicId);
      }
    )
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.angularFirePerformance.trace('list-subtopics-of-topic');
          return doc;
        }),
        shareReplay(1)
      );
  }
}
