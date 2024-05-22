import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
import firebase from 'firebase';
import firestore = firebase.firestore;
import { UploadStorageService } from './upload-storage.service';
import { Resource } from '../../shared/interfaces/resource';

const RESOURCES_COLLECTION_NAME = 'resources';
const RESOURCES_BASE_PATH = '/resources';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private resourceReference!: AngularFirestoreCollection;

  constructor(
    private uploadStorageService: UploadStorageService,
    private angularFirestore: AngularFirestore,
    private readonly angularFirePerformance: AngularFirePerformance
  ) {
    this.resourceReference = this.angularFirestore.collection(RESOURCES_COLLECTION_NAME);
  }

  public saveResource(resource: Resource, file: File[] | null): Observable<Resource | null> {
    const saveProcess = from(this.createResource(resource, file)).pipe(
      mergeMap(async (acc) => await this.saveInDB(acc)),
      catchError((err) => {
        return of(null);
      })
    );
    return saveProcess;
  }

  private async createResource(resource: Resource, file: File[]): Promise<Resource> {
    let resourceCreated: Resource;
    if (resource.type === 'image'){
      resourceCreated =  {
        id: `${ (new Date()).valueOf() }`,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        dateCreated: new Date(),
        subtopicId: resource.subtopicId,
        file: await this.uploadStorageService.uploadImage(file, RESOURCES_BASE_PATH)
      };
    } else {
      resourceCreated =  {
        id: `${ (new Date()).valueOf() }`,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        source: resource.source,
        dateCreated: new Date(),
        subtopicId: resource.subtopicId,
        file: null
      };
    }

    return resourceCreated;
  }

  private async saveInDB(resource: Resource): Promise<Resource> {

    const batch = this.angularFirestore.firestore.batch();
    const resourceReference = this.resourceReference.doc(`${resource.id}`).ref;
    batch.set(resourceReference, resource);
    await batch.commit();

    return resource;
  }

  /**
   * Get the firestore document of a Resource
   * @param resourceId Identifier of the Resource
   */
  private resourceDocument(resourceId: string): AngularFirestoreDocument<Resource> {
    return this.angularFirestore
      .collection(RESOURCES_COLLECTION_NAME)
      .doc<Resource>(resourceId);
  }

  public resourceDocumentReference(resourceId: string): firestore.DocumentReference<Resource> {
    return this.resourceDocument(resourceId).ref as firestore.DocumentReference<Resource>;
  }

  public resourceById(resourceId: string): Observable<Resource> {
    return this.resourceDocument(resourceId).get().pipe(
      map(snap => (snap.data() as Resource))
    );
  }

  deleteResource(resourceId: string | undefined): Promise<void> {
    return this.resourceReference.doc(resourceId).delete();
  }

  public getResourceOfSubtopic(subtopicId: string): Observable<Array<Resource>> {
    return this.angularFirestore.collection<Resource>(
      RESOURCES_COLLECTION_NAME,
      query => {
        return query.orderBy('dateCreated')
          .where('subtopicId', '==', subtopicId);
      }
    )
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.angularFirePerformance.trace('list-resources-of-subtopic');
          return doc;
        }),
        shareReplay(1)
      );
  }
}
