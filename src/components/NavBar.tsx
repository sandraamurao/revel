import revelLogo from "../assets/revel-logo.png"

function NavBar() {

  return (
    <>
    <div className="flex flex-col sm:flex-row justify-between border-b border-[#474747] bg-[#0f2a3f]/50 shadow-lg shadow-[#2a5ab3]/10 p-4"> 
      <div className="flex flex-row items-center gap-3">
        <img src={revelLogo} alt="Revel Logo" width={40} />
         <h1 className="font-bold">Revel</h1> 
      </div>
    </div>
    </>
  )
}

export default NavBar
