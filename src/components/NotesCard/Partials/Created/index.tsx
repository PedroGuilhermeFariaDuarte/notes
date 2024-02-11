import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

// Types
import { ICreatedProps } from "./types";

export function Created({ id, type,createdAt, description, title, onUpdated, onDeleted }: ICreatedProps) {
    const [shouldShowTextArea, setShouldShowTextArea] = useState(false)

    function handleOnShouldShowTextArea() {
        try {
            setShouldShowTextArea(d => !d)
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

            if(!onUpdated || typeof onUpdated !== 'function') throw new Error('Não vai ser possivel criar a nota')

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
            
            onUpdated({
                description: textAreaValue,
                createdAt,
                id,
                type: type || 2,
                title
            })            
        } catch (error: any) {
            toast.warning(error?.message || 'Algo deu errado ao desativar o editor de texto')
        }
    }

    function handlerOnDeleteNote(){
        try {
            if(!onDeleted || typeof onDeleted !== 'function') throw new Error(`No momento não é possivel remover a nota ${title}`)

            onDeleted({
                createdAt,
                description,
                title,
                type: type || 2,
                id
            })
        } catch (error: any) {
            toast.warning(error?.message || `Não foi possivel remover a nota ${title}`)
        }
    }

    return (
        <div className="flex flex-1  flex-col gap-3 p-5 relative">
            <span className="text-small font-medium text-slate-300 flex flex-row items-center gap-3">
                {
                    formatDistanceToNow(createdAt || '', {
                        locale: ptBR,
                        addSuffix: true
                    })
                }                                
                
                <button data-shouldLeftLimeColor={shouldShowTextArea} 
                    onClick={handleOnShouldShowTextArea} 
                    type="button" 
                    className="text-slate-400 data-[shouldLeftLimeColor=true]:text-red-400 data-[shouldLeftLimeColor=false]:hover:text-lime-400 font-medium hover:underline"
                > 
                    Editar
                </button>
                         
            </span>            

            <p className="text-small leading-6 text-slate-400">
                {title}
            </p>

            <p data-shouldShowUpTitle={shouldShowTextArea} className="flex data-[shouldShowUpTitle=true]:hidden text-small font-bold leading-6 text-slate-400">
                {description}
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
                        defaultValue={description}
                    />
            </form>
            
            <button  form="notes-form" data-shouldShowUpdateButton={shouldShowTextArea} type="submit" className="data-[shouldShowUpdateButton=true]:block hidden absolute bottom-0 left-0 right-0 bg-slate-800 py-4 text-center text-slate-300 outline-none font-medium group">
                <span className="text-lime-400 group-hover:underline">Salvar Alterações</span>
            </button>

            <button onClick={handlerOnDeleteNote} data-shouldShowDeleteButton={shouldShowTextArea} type="button" className="data-[shouldShowDeleteButton=false]:block hidden absolute bottom-0 left-0 right-0 bg-slate-800 py-4 text-center text-slate-300 outline-none font-medium group">
                Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
            </button>
        </div>
    )
}