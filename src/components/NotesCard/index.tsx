import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

// Partials
import { Create } from "./Partials/Create";
import { Created } from "./Partials/Created";

// Types
import { INoteCarsProps } from "./types";

export function NotesCard(props: INoteCarsProps) {
    return (
      <Dialog.Root>
        <Dialog.Trigger
          data-addType={props.type === 1} 
          data-noteType={props.type === 2} 
          className="flex flex-col gap-3
            max-sm:w-full
            rounded-md text-left 
            data-[addType=true]:bg-slate-700 data-[noteType=true]:bg-slate-800
            p-5 overflow-hidden
            relative outline-none hover:ring-4
            hover:ring-slate-600
            focus-visible:ring-4 focus-visible:ring-lime-400
            focus:ring-4 focus:ring-lime-400
          "
        >
        <span data-showDate={!props.title && true} className="hidden data-[showDate=true]:flex text-small font-medium text-slate-300">
          {
            formatDistanceToNow(props.createdAt || '', {
              locale: ptBR,
              addSuffix: true
            })
          }
        </span>

        <span data-showTitle={props.title && true} className="hidden data-[showTitle=true]:flex text-small font-medium text-slate-300">
          {props.title}
        </span>

          <p className="text-small leading-6 text-slate-400">            
            {props.description}
          </p>

          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"></div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50">
            <Dialog.Content
              className="fixed left-1/2 top-1/2 
                -translate-x-1/2 -translate-y-1/2 
                w-full max-w-sm md:max-w-[640px]
                h-full max-sm:max-h-[85%] md:h-[60vh]
                bg-slate-700 rounded-md
                overflow-hidden
                flex flex-col outline-none"
            >
              <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                <X className="size-5"/>
              </Dialog.Close>

              {
                props.type === 1 && <Create {...props} />
              }

              {
                props.type === 2 && <Created {...props} />
              }
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    )
}