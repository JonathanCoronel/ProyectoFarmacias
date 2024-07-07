import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase';
import firestore = firebase.firestore;
import {from, Observable, of} from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Course } from '../../shared/interfaces/course';
import { UploadStorageService } from './upload-storage.service';


const COURSES_COLLECTION_NAME = 'courses';
const COURSES_BASE_PATH = '/courses';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesRef: AngularFirestoreCollection;

  private currentCourse: Course | null = null;
  private selectedOption: string | null = null;

  constructor(
    private af: AngularFirestore,
    private uploadStorageService: UploadStorageService,
  ) {
    this.coursesRef = this.af.collection(COURSES_COLLECTION_NAME);
  }

  /**
   * Save a new course
   */
  public saveCourse(course: Course, image: File[]): Observable<Course | null> {
    const saveProcess = from(this.createCourse(course, image)).pipe(
      mergeMap(async (acc) => await this.saveInDB(acc)),
      catchError((err) => {
        return of(null);
      })
    );
    return saveProcess;
  }

  setCurrentCourse(course: Course) {
    this.currentCourse = course;
  }

  getCurrentCourse(): Course | null {
    return this.currentCourse;
  }

  setSelectedOption(option: string) {
    this.selectedOption = option;
  }

  getSelectedOption(): string | null {
    return this.selectedOption;
  }

  private async createCourse(course: Course, files: File[]): Promise<Course> {
    const courseCreated: Course =  {
      id: `${ (new Date()).valueOf() }`, // Date Integer
      title: course.title,
      description: course.description,
      image: await this.uploadStorageService.uploadImage(files, COURSES_BASE_PATH)
    };
    return courseCreated;
  }

  private async saveInDB(course: Course): Promise<Course> {
    const batch = this.af.firestore.batch();
    const coursesReference = this.coursesRef.doc(`${course.id}`).ref;
    batch.set(coursesReference, course);
    await batch.commit();

    return course;
  }

  deleteCourse(courseId: string | undefined): Promise<void> {
    return this.coursesRef.doc(courseId).delete();
  }


  /**
   * Get the firestore collection of Courses
   */
  public getCoursesCollection(): AngularFirestoreCollection<Course> {
    return this.af.collection<Course>(COURSES_COLLECTION_NAME);
  }

  /**
   * Get the firestore document of a Course
   * @param courseId Identifier of the Course
   */
  private CourseDocument(courseId: string): AngularFirestoreDocument<Course> {
    return this.af
      .collection(COURSES_COLLECTION_NAME)
      .doc<Course>(courseId);
  }

  /**
   * Get the observable of a Course
   * @param courseId Identifier of the Course
   */
  public course(courseId: string): Observable<Course> {
    return this.CourseDocument(courseId).get().pipe(
      map(snap => (snap.data() as Course))
    );
  }

  /**
   * Get the firestore document reference of a Course
   * @param courseId Identifier of the Course
   */
  public CourseReference(courseId: string): firestore.DocumentReference<Course> {
    return this.CourseDocument(courseId).ref as firestore.DocumentReference<Course>;
  }

}
