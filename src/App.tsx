import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

// Types
import { TNote } from "./components/NotesCard/types";

// Assets
import NWLLogo from "./assets/icons/notes-logo.svg";

// Components
import { NotesCard } from "./components/NotesCard";

function App() {
  const [notes, setNotes] = useState<TNote[]>(() => JSON.parse(localStorage.getItem("NOTES@SAVED") || '[]') || [])
  const [notesSearch, setNotesSearch] = useState<TNote[]>( [])
  
  useEffect(() => {
    if(typeof notes !== 'object') return

    localStorage.setItem("NOTES@SAVED", JSON.stringify(notes))
  },[notes])

  function handlerOnNoteCreated(note: TNote | undefined)  {
    try {
      if(!note) throw new Error('Nenhuma nota foi recebida');

      if(!note.id) throw new Error('A nota não possui uma identificação válida');

      setNotes(nts => [note,...nts])

      toast.success(`A nota ${note.title} foi criada com sucesso`)
    } catch (error: any) {
        toast.warning(error?.message || 'Houve um erro ao processar o evento de onCreated')
    }
  }

  function handlerOnNoteUpdated(note: TNote | undefined)  {
    try {
      if(!note) throw new Error('Nenhuma nota foi recebida');

      console.table(note)
      
      const noteToUpdated = notes.findIndex(nt => nt.id === note.id)
      
      console.table(noteToUpdated)
      
      // A VERIFICAÇÃO "DIFERENTE DE ZERO" È PRA EVITAR UMA VALIDAÇÃO COM VALORES FALSY, COMO 0, -1, "" ENTRE OUTROS
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if(!noteToUpdated !== 0 && noteToUpdated < 0) throw new Error('Não foi possivel atualizar a lista de notas')

      const notesUpdated = notes

      notesUpdated[noteToUpdated] = note      

      console.table(notesUpdated)
      
      setNotes(notesUpdated)


      toast.success(`A nota ${note.title} foi atualizada com sucesso`)
    } catch (error: any) {
        toast.warning(error?.message || 'Houve um erro ao processar o evento de onUpdated')
    }
  }

  function handlerOnNoteDeleted(note: TNote | undefined)  {
    try {
      if(!note) throw new Error('Nenhuma nota foi recebida');

      setNotes(nts => nts.filter(nt => nt.id !== note.id))

      toast.success(`A nota ${note.title} foi removida com sucesso`)
    } catch (error: any) {
      toast.warning(error?.message || 'Houve um erro ao processar o evento de onDeleted')
    }
  }

  function handlerOnSearchNotes(event: ChangeEvent<HTMLInputElement>){
    try {
      if(!event) throw new Error('Não é possivel iniciar a pesquisa')

      if(event.target.value.trim() === '') {
        setNotesSearch([])
        return
      }

      const terms = event.target.value

      setNotesSearch( notes.filter(nt => nt.description.includes(terms) || nt.title?.includes(terms)))

    } catch (error: any) {
      toast.warning(error?.message || 'Houve um erro ao processar o evento de pesquisa')
    }
  }
  
  return (
    <>
      <div className="md:mx-auto max-xl:mx-auto  w-full md:max-w-6xl my-12 space-y-6 p-4 md:p-0">
        <img src={NWLLogo} alt="NWL Expert" />

        <form className="w-full">
          <input
            type="text"
            placeholder="Busque suas notas..."
            className="w-full bg-transparent text-sm md:text-md lg:text-lg xl:text-2xl font-semibold tracking-tight placeholder:text-slate-500"
            onChange={handlerOnSearchNotes}
          />        
        </form>

        <div className="h-px bg-slate-700 rounded-sm"/>

        <div className="grid  grid-cols-1 md:grid-cols-2 lg-grid-cols-3 xl:grid-cols-4 md:auto-rows-[250px] gap-6">
          <NotesCard  
            onCreated={handlerOnNoteCreated} 
            onDeleted={handlerOnNoteDeleted} 
            onUpdated={handlerOnNoteUpdated} 
            createdAt={new Date()} 
            description="Grave uma nota em áudio que será convertida para texto automaticamente." 
            title="Adicionar nota" 
            type={1}
          />

          {
            notesSearch.length <= 0 && notes.map((note) => 
              <NotesCard 
                onCreated={handlerOnNoteCreated} 
                onDeleted={handlerOnNoteDeleted} 
                onUpdated={handlerOnNoteUpdated} 
                {...note} 
                key={note.id}
              />
            )
          }          
          {
            notesSearch.length >= 1 && notesSearch.map((note) => 
              <NotesCard 
                onCreated={handlerOnNoteCreated} 
                onDeleted={handlerOnNoteDeleted} 
                onUpdated={handlerOnNoteUpdated} 
                {...note} 
                key={note.id}
              />
            )
          }          
        </div>
      </div>
    </>
  )
}

export default App
