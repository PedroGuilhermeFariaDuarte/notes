import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
// Types
import { ICreateProps } from "./types";

export function Create({ title,onCreated }: ICreateProps) {
    const [shouldShowTextArea, setShouldShowTextArea] = useState(false)
    const [shouldShowRecordVoice, setShouldShowRecordVoice] = useState(false)
    const [isRecordingVoice, setIsRecordingVoice] = useState(false)
    

    function handleOnShouldShowTextArea() {
        try {
            setShouldShowRecordVoice(false)
            setShouldShowTextArea(d => !d)
        } catch (error: any) {
            toast.warning(error?.message || 'Algo deu errado ao liberar o editor de texto')
        }
    }

    function handlerOnShouldShowRecordVoice() {
        try {
            setShouldShowTextArea(false)
            setShouldShowRecordVoice(d => !d)
        } catch (error: any) {
            toast.warning(error?.message || 'Algo deu errado ao liberar o editor de texto')
        }
    }

    function handleOnChangeTextArea(event: ChangeEvent<HTMLTextAreaElement> | undefined ) {
        try {
            if(!event) throw new Error('Não foi possivel realizar o parser do editor de texto')

            if(event.target?.value.length <= 0) handleOnShouldShowTextArea()
        } catch (error: any) {
            toast.warning(error?.message || 'Algo deu errado ao desativar o editor de texto')
        }
    }

    function handlerOnSubmitForm(submit: FormEvent) {
        try {
            if(!submit) throw new Error('Não foi possivel realizar o parser do editor de texto')

            if(!onCreated || typeof onCreated !== 'function') throw new Error('Não vai ser possivel criar a nota')

            submit.preventDefault()

            if(!shouldShowTextArea) {
                // Dispatch to Audio Record Data Handler
                return
            }

            // I DON'T FOUND A TYPE WITH ELEMENTS PROPERTY FOR FORM EVENT
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const textAreaValue = submit.target?.elements[0]?.value || null            

            if(!textAreaValue) throw new Error("Preencha o campo de texto com a sua nota");
            
            const id = crypto.randomUUID()

            onCreated({
                createdAt: new Date(),
                description: textAreaValue,
                id,
                type: 2,
                title: `Nota #${id.split('-')[0]}`
            })
        } catch (error: any) {
            toast.warning(error?.message || 'Algo deu errado ao desativar o editor de texto')
        }
    }

    function handleStartRecordingVoice(){
        try {
            setIsRecordingVoice(true)            

        } catch (error: any) {
            setIsRecordingVoice(false)
         toast.warning(error?.message || 'Não foi possivel iniciar a gravação de voz') 
        }
    }

    return (
        <>
            <div className="flex flex-1  flex-col gap-3 p-5 relative">
                <span className="text-small font-medium text-slate-300">
                    {title}
                </span>

                <p className="text-small leading-6 text-slate-400">
                    Comece <button onClick={handlerOnShouldShowRecordVoice} type="button" className="text-lime-400 font-medium hover:underline"> gravando uma nota </button> em áudio ou se preferir <button onClick={handleOnShouldShowTextArea} type="button" className="text-lime-400 font-medium hover:underline"> utilize apenas texto </button>.
                </p>

                <form onSubmit={handlerOnSubmitForm} name="notes-form" id="notes-form" className="w-full h-2/3">
                    <textarea
                        name="message"
                        id="message"
                        autoFocus
                        data-shouldShowTextArea={shouldShowTextArea}
                        className="hidden data-[shouldShowTextArea=true]:flex
                            rounded-md bg-slate-800
                            resize-none w-full h-full
                            p-4 outline-none
                            focus:ring-2 focus:ring-lime-100
                            text-slate-100 text-sm
                            font-medium placeholder:text-slate-600
                        "
                        placeholder="Digite seu texto..."
                        onChange={handleOnChangeTextArea}
                    />
                </form>

                <button
                    onClick={handleStartRecordingVoice}
                    data-shouldShowButtonSaveAudioNote={shouldShowRecordVoice && !shouldShowTextArea} 
                    type="submit" 
                    form="notes-form" 
                    className="hidden data-[shouldShowButtonSaveAudioNote=true]:block 
                        absolute bottom-0 
                        left-0 right-0 
                        bg-slate-900 hover:bg-red-500 
                        py-4 text-center text-slate-300
                        outline-none font-medium
                    "
                > 
                    {isRecordingVoice ? "Gravando..." : 'Iniciar Gravação' }
                </button>

                <button data-shouldShowButtonSaveTextNote={!shouldShowRecordVoice && shouldShowTextArea} type="submit" form="notes-form" className="hidden data-[shouldShowButtonSaveTextNote=true]:block absolute bottom-0 left-0 right-0 bg-lime-400 hover:bg-lime-500 py-4 text-center text-lime-950 outline-none font-medium">
                    Salvar Nota
                </button>
            </div>
        </>
    )
}