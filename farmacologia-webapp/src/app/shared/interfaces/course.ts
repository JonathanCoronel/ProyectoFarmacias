import { FileUpload } from './file.upload';

export interface Course {
  id?: string;
  title: string;
  description: string;
  image?: FileUpload[];
}
