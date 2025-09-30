import { EditFileRequest } from "../domain/edit_file_request";
import { EditFileResult } from "../domain/edit_file_result";
import { FileEditor } from "../domain/file_editor";

export class FileEditUsecase {
    constructor(private fileEditor: FileEditor) {}

    async execute(request: EditFileRequest): Promise<EditFileResult> {
        return await this.fileEditor.editFile(request);
    }
}