import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Types
import { ICreatedProps } from "./types";

export function Created({ createdAt, description, title }: ICreatedProps) {
    return (
        <div className="flex flex-1  flex-col gap-3 p-5 relative">
            <span className="text-small font-medium text-slate-300">
                {
                    formatDistanceToNow(createdAt || '', {
                        locale: ptBR,
                        addSuffix: true
                    })
                }
            </span>

            <p className="text-small leading-6 text-slate-400">
                {title}
                {description}
            </p>
            
            <button type="button" className="absolute bottom-0 left-0 right-0 bg-slate-800 py-4 text-center text-slate-300 outline-none font-medium group">
                Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
            </button>
        </div>
    )
}