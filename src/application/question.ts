import { LLM } from "../domain/llm";

export class QuestionUsecase{
    private llm: LLM;

    public constructor(llm: LLM){
        this.llm = llm;
    }

    public async execute(text: string) : Promise<string>{
        let response = await this.llm.query(text, 0.7, 128);

        return response;
    }
}