
// Types
import { ICreateProps } from "./types";

export function Create({ title }: ICreateProps) {
    return (
        <div className="flex flex-1  flex-col gap-3 p-5 relative">
            <span className="text-small font-medium text-slate-300">                
                {title}
            </span>

            <p className="text-small leading-6 text-slate-400">
                Comece <button type="button" className="text-lime-400 font-medium hover:underline">gravando uma nota</button> em áudio ou se preferir <button type="button" className="text-lime-400 font-medium hover:underline">utilize apenas texto</button>.
            </p>

            <button type="button" className="absolute bottom-0 left-0 right-0 bg-lime-400 hover:bg-lime-500 py-4 text-center text-lime-950 outline-none font-medium">
                Salvar Nota
            </button>
        </div>
    )
}