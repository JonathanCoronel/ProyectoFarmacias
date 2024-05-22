import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFirePerformance } from '@angular/fire/performance';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
import { Topic } from '../../shared/interfaces/topic';
import firebase from 'firebase';
import firestore = firebase.firestore;
import { UploadStorageService } from './upload-storage.service';

const TOPICS_COLLECTION_NAME = 'topics';
const TOPICS_BASE_PATH = '/topics';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private topicsReference!: AngularFirestoreCollection;

  constructor(
    private uploadStorageService: UploadStorageService,
    private angularFirestore: AngularFirestore,
    private readonly angularFirePerformance: AngularFirePerformance
  ) {
    this.topicsReference = this.angularFirestore.collection(TOPICS_COLLECTION_NAME);
  }

  public saveTopic(topic: Topic, image: File[]): Observable<Topic | null> {

    const saveProcess = from(this.createTopic(topic, image)).pipe(
      mergeMap(async (acc) => await this.saveInDB(acc)),
      catchError((err) => {
        return of(null);
      })
    );
    return saveProcess;
  }

  private async createTopic(topic: Topic, file): Promise<Topic> {
    const topicCreated: Topic =  {
      id: `${ (new Date()).valueOf() }`, // Date Integer
      title: topic.title,
      content: topic.content,
      dateCreated: new Date(),
      courseId: topic.courseId,
      requirements: topic.requirements,
      learning: topic.learning,
      image: await this.uploadStorageService.uploadImage(file, TOPICS_BASE_PATH)
    };
    return topicCreated;
  }

  private async saveInDB(topic: Topic): Promise<Topic> {
    const batch = this.angularFirestore.firestore.batch();
    const activityReference = this.topicsReference.doc(`${topic.id}`).ref;
    batch.set(activityReference, topic);
    await batch.commit();

    return topic;
  }

  // public async updateTopicStatus(activityId: string, status: string): Promise<void> {
  //   return await this.activityReference(activityId).set(
  //     { status },
  //     { merge: true }
  //   );
  // }

  /**
   * Get the firestore document of a Topic
   * @param topicId Identifier of the Topic
   */
  private topicDocument(topicId: string): AngularFirestoreDocument<Topic> {
    return this.angularFirestore
      .collection(TOPICS_COLLECTION_NAME)
      .doc<Topic>(topicId);
  }

  public topicReference(topicId: string): firestore.DocumentReference<Topic> {
    return this.topicDocument(topicId).ref as firestore.DocumentReference<Topic>;
  }

  public topicById(topicId: string): Observable<Topic> {
    return this.topicDocument(topicId).get().pipe(
      map(snap => (snap.data() as Topic))
    );
  }

  setTopic(topic: Topic): Promise<any> {
    return this.topicsReference.doc(topic.id).set(topic);
  }

  updateTopic(topic: any): Promise<any> {
    return this.topicsReference.doc(topic.id).update(topic);
  }

  deleteTopic(topicId: string | undefined): Promise<void> {
    return this.topicsReference.doc(topicId).delete();
  }

  public getTopicsOfCourse(courseId: string): Observable<Array<Topic>> {
    return this.angularFirestore.collection<Topic>(
      TOPICS_COLLECTION_NAME,
      query => {
        return query.orderBy('dateCreated')
          .where('courseId', '==', courseId);
      }
    )
      .valueChanges()
      .pipe(
        mergeMap(async doc => {
          await this.angularFirePerformance.trace('list-topics-of-course');
          return doc;
        }),
        shareReplay(1)
      );
  }
}
