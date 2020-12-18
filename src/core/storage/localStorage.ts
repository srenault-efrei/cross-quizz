import fs from 'fs'

export function createLocalFolder(newFolderPath: string) : never | void {
    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath, { recursive: true })
    }
    else {
      throw new Error('Dossier deja existant')
    }
  }

  export function renameLocalFolder(oldName:string,newName:string) : never | void {
    if (!fs.existsSync(oldName)) {
        throw new Error('Dossier  inexistant')
    }
    else {
      fs.renameSync(oldName,newName)
    }
  }


  export function deleteLocalFolder(path:string) : never | void {
    if (!fs.existsSync(path)) {
        throw new Error('Chemin  inexistant')
    }
    else {
      fs.rmdirSync(path)
    }
  }

  export function copyLocalObject(path:string , newName:string) : never | void {
    if (!fs.existsSync(path)) {
        throw new Error('Chemin  inexistant')
    }
    else {
      fs.copyFileSync(path , newName)
    }
  }

  export function existsLocalObject(path:string) : number {
    if (!fs.existsSync(path)) {
        return 400
    }
    else {
      return 200
    }
  }

  
  export function createLocalFile(buffer:Buffer, path:string) : never | void {
    if (fs.existsSync(path)) {
        throw new Error('Fichier existe deja ')
    }
    else {
      
      // open the file in writing mode, adding a callback function where we do the actual writing
      fs.open(path, 'w', function(err, fd) {
          if (err) {
              throw new Error('could not open file: ' + err);
          }
          // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
          fs.write(fd, buffer, 0, buffer.length, null, function(err) {
              if (err) throw 'error writing file: ' + err;
              fs.close(fd, () => {});
          });
      });
    }
  }

  export function deleteLocalFile( path:string) : never | void {
    if (!fs.existsSync(path)) {
        throw new Error('Fichier inexistant ')
    }
    else {
      fs.unlinkSync(path)

    }
  }