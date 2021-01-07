import path from 'path'

// // CONST
// export const MY_S3_DATA_PATH = 'NPM_CONFIG_PRODUCTION' in process.env ? 'mys3DATA/' : path.join(getLocalDir(),'mys3DATA/')

export const MY_S3_DATA_PATH = 'mys3DATA/'
export const BUCKET_NAME = 'mys3-mj'

// function getLocalDir():string{
//     if ('LOCAL_DIR' in process.env){
//         let local_str = process.env.LOCAL_DIR as string
//         return local_str.replace(/\\\//g, "/")
//     }
//     return ""
// }