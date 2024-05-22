import { FileUpload } from './file.upload';

export interface Topic {
  id?: string;
  title: string;
  content: string;
  dateCreated?: Date;
  courseId: string;
  image?: FileUpload[];
  requirements: string[];
  learning: string[]
}
