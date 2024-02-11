// Assets
import NWLLogo from "./assets/icons/notes-logo.svg";


// Components
import { NotesCard } from "./components/NotesCard";

function App() {  

  return (
    <div className="mx-auto w-full md:max-w-6xl my-12 space-y-6 p-4 md:p-0">
      <img src={NWLLogo} alt="NWL Expert" />
      <form className="w-full">
        <input 
          type="text" 
          placeholder="Busque suas notas..." 
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500"
        />        
      </form>
      <div className="h-px bg-slate-700 rounded-sm"/>

      <div className="flex flex-col max-sm:items-start max-sm:justify-start md:grid md:grid-cols-3 md:auto-rows-[250px] gap-6">
        <NotesCard createdAt={new Date()} description="Grave uma nota em áudio que será convertida para texto automaticamente." title="Adicionar nota" type={1}/>

        <NotesCard createdAt={new Date()} description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis incidunt veniam soluta ab vel, obcaecati repudiandae rerum. Culpa repellat magni nihil rem ratione corporis, iste ducimus hic? Corrupti, sit explicabo!" title="Adicionar nota" type={2}/>
      </div>
    </div>
  )
}

export default App
