import { Injectable } from '@angular/core';
import { FileUpload } from '../../shared/interfaces/file.upload';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadStorageService {

  constructor(
    private angularFireStorage: AngularFireStorage,
  ) { }

  public async uploadImage(files: File[], folder: string): Promise<FileUpload[]> {

    // for each file, create a reference to the file being uploaded
    const paths = await Promise.all(
      files.map(
        async file => {
          const path = `/${folder}/${file.name}`;
          await this.angularFireStorage.upload(path, file);
          return path;
        }
      )
    );

    // obtain the url of the files uploaded and the reference to the file
    const filesData = paths.map(async pathFile => {
      const ref = this.angularFireStorage.storage.ref(pathFile);
      const data: FileUpload = {
        name: ref.name,
        path: pathFile,
        createdAt: new Date(),
        url: await ref.getDownloadURL(),
      } as FileUpload;

      return data;
    });
    return await Promise.all(filesData);
  }

}
