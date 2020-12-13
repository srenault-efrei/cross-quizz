import fs from 'fs'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable'

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

  export function existsLocalObject(path:string) : number {
    if (!fs.existsSync(path)) {
        return 400
    }
    else {
      return 200
    }
  }