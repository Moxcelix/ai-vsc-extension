import { EditFileRequest } from "./edit_file_request";
import { EditFileResult } from "./edit_file_result";

export interface FileEditor {
    editFile(request: EditFileRequest): Promise<EditFileResult>;
}