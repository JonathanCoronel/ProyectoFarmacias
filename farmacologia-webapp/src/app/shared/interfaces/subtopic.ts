import { FileUpload } from './file.upload';

export interface Subtopic {
  id?: string;
  title: string;
  description: string;
  dateCreated?: Date;
  topicId: string;
  image?: FileUpload[];
}
