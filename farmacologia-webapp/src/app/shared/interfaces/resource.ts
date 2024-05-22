import { FileUpload } from './file.upload';

export interface Resource {
  id?: string;
  title: string;
  description: string;
  type: string;
  source?: string;
  subtopicId: string;
  dateCreated?: Date;
  file?: FileUpload[] | null;
}
