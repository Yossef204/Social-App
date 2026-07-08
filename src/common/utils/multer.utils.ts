import multer, {memoryStorage} from "multer";

export function uploadFile(){
    return multer({storage:memoryStorage()})
}