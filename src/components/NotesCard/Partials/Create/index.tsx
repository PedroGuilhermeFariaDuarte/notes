import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";

// Types
import { speechRecognitionAPI } from "../../../../utils/Speech";
import { ICreateProps } from "./types";

export function Create({ title,onCreated }: ICreateProps) {
    const [shouldShowTextArea, setShouldShowTextArea] = useState(false)
    const [shouldShowRecordVoice, setShouldShowRecordVoice] = useState(false)
    const [isRecordingVoice, setIsRecordingVoice] = useState(false)
    const [transcriptionVoiceRecord, setTranscriptionVoiceRecord] = useState('')
    
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

    const handleStartRecordingVoice = useCallback(async () => {
        try {
            if(!speechRecognitionAPI) {
                toast.error("Seu navegador não suporta a API SpeechRecognition! :(")
                handlerOnShouldShowRecordVoice()
                handleStopRecordingVoice()
                return
            }

            if(transcriptionVoiceRecord.length >= 1) {
               const result =  await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(false)
                    }, 5500)

                    toast("Deseja apagar gravação anterior?", {
                        action: {
                            label: 'Sim',
                            onClick: () => {                                
                                resolve(true)
                            }
                        },
                        duration: 5000,
                    })
                })

                console.table(result)

                if(result) setTranscriptionVoiceRecord('')
            }

            setIsRecordingVoice(true)                 

            speechRecognitionAPI.lang = "pt-BR"
            speechRecognitionAPI.continuous = true
            speechRecognitionAPI.maxAlternatives = 1
            speechRecognitionAPI.interimResults = true

            speechRecognitionAPI.onresult = (event) => {
                const transcription = Array.from(event.results).reduce((text, result) => {                    
                    return text.concat(result?.[0]?.transcript || result[0] as unknown as string)
                }, "")

                const transcriptionParsed = transcriptionVoiceRecord.replace("finalizar", "").concat(transcription)

                setTranscriptionVoiceRecord(transcriptionParsed)

                handleStopSpeechBySecrectWord(transcription)
            }

            speechRecognitionAPI.onerror = (error) => {
                const errorType = error.error
                let message = ''

                switch(errorType) {
                    case 'not-allowed':
                        message = 'Gravação de audio não foi permitida pelo usuário'
                        break;
                    case 'audio-capture':
                        message = 'Não foi possivel capturar o audio'
                        break;
                    case 'service-not-allowed':
                        message = 'Serviço de captura de audio indisponível'
                        break;
                    default:
                        message = 'Não foi possivel iniciar a gravação de voz'
                }

                toast.warning(message)
            }

            speechRecognitionAPI.start()
        } catch (error: any) {
            setIsRecordingVoice(false)
            toast.warning(error?.message || 'Não foi possivel iniciar a gravação de voz')
        }
    }, [handleStopRecordingVoice, handleStopSpeechBySecrectWord, transcriptionVoiceRecord])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleStopRecordingVoice(){
        try {            
            
            if(speechRecognitionAPI) {
                speechRecognitionAPI.stop();
            }
            
            setIsRecordingVoice(false)
            handlerOnShouldShowRecordVoice()
            handleOnShouldShowTextArea()
        } catch (error: any) {
            setIsRecordingVoice(false)
            toast.warning(error?.message || 'Não foi possivel iniciar a gravação de voz') 
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleStopSpeechBySecrectWord(transcription: string){
        try {
            if(transcription.trim() === '') return

            if(!transcription.toLocaleLowerCase().includes('finalizar')) return

            handleStopRecordingVoice()
        } catch (error: any) {
            toast.warning(error?.message || 'Não foi possivel finalizar a gravação por comando de voz')
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

                <p data-isrecordingvoice={isRecordingVoice} className="hidden data-[isrecordingvoice=true]:inline-block text-small leading-6 text-slate-400 cursor-default select-none">
                    {transcriptionVoiceRecord}
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
                        defaultValue={transcriptionVoiceRecord}
                    />
                </form>

                <button
                    data-shouldShowButtonSaveAudioNote={shouldShowRecordVoice && !shouldShowTextArea} 
                    data-isrecordingvoice={isRecordingVoice}
                    type="button"
                    className="hidden
                        w-full 
                        data-[shouldShowButtonSaveAudioNote=true]:block 
                        absolute bottom-0 
                        left-0 right-0 
                        bg-slate-900 data-[isrecordingvoice=false]:hover:bg-lime-400
                        
                        py-4 text-center text-slate-300
                        data-[isrecordingvoice=false]:hover:text-slate-600
                        outline-none font-medium
                    "
                >
                    <span
                        title="Clique aqui para pausar a gravação de audio de voz"
                        data-isrecordingvoice={isRecordingVoice}  
                        role="button" 
                        onClick={handleStopRecordingVoice} 
                        className="hidden data-[isrecordingvoice=true]:flex flex-row items-center justify-center gap-3 w-full h-full"
                    >
                        <span className="block size-3 bg-red-500 animate-pulse rounded-full"></span>

                        Gravando... (clique p/ terminar)
                    </span> 

                    <span
                        title="Clique aqui para iniciar a gravação de audio de voz"
                        data-isrecordingvoice={isRecordingVoice} 
                        onClick={handleStartRecordingVoice} 
                        role="button" 
                        className="hidden data-[isrecordingvoice=true]:pointer-events-none data-[isrecordingvoice=false]:flex flex-row items-center justify-center gap-3 w-full h-full"
                    >
                        Iniciar Gravação
                    </span>
                </button>

                <button data-shouldShowButtonSaveTextNote={!shouldShowRecordVoice && shouldShowTextArea} type="submit" form="notes-form" className="hidden data-[shouldShowButtonSaveTextNote=false]:pointer-events-none data-[shouldShowButtonSaveTextNote=true]:block absolute bottom-0 left-0 right-0 bg-lime-400 hover:bg-lime-500 py-4 text-center text-lime-950 outline-none font-medium">
                    Salvar Nota
                </button>
            </div>
        </>
    )
}