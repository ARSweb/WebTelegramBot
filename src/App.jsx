import { useState, useEffect } from "react";

function App(){
  const [name, setName] = useState("")
  const [isTelegram, setIsTelegram] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [family, setFamily] = useState([
    {name: "", age: ""}
  ])

  const addFamilyMember = () => {
    setFamily([...family, {name: "", age: ""}])
  }

  const generateDoc = async () => {
    const formData = new FormData();
    formData.append("name", name)
    formData.append("photo", photo)
    formData.append("family", JSON.stringify(family))


    try{
      if(isTelegram){
        window.Telegram.WebApp.MainButton.showProgress();
        window.Telegram.WebApp.MainButton.disable();
      }
      
      const response = await fetch("https://lailah-pseudophilosophical-cloddishly.ngrok-free.dev/generate", {
        method: "POST",
        body: formData,
      })
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "malumotnoma.docx";
      a.click();

      window.URL.revokeObjectURL(url)
    }catch(err){
      console.error(err);
      if(isTelegram){
        window.Telegram.WebApp.showAlert("hatolik yuz berdi")
      }
    }finally{
      if(isTelegram){
        window.Telegram.WebApp.MainButton.hideProgress();
        window.Telegram.WebApp.MainButton.enable();
      }
    }
  }

  // telegram init
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if(tg){
      setIsTelegram(true)
      const user = tg.initDataUnsafe?.user;
      if(user?.first_name){
        setName(user.first_name)
      }

      tg.ready()
      tg.MainButton.setText("Generate document");
      tg.MainButton.show();

      tg.MainButton.onClick(() => {
        generateDoc();
      })
    }
  }, [photo, family, name])

  return(
    <div>
    <h3>Web Telegram App</h3>
    {!isTelegram && (
      <p>Oddiy brauser rejimi (Telegram Emas)</p>
    )}
      <input  type="text"
              placeholder="Ismingizni kiriting"
              value={name}
              onChange={(e)=> setName(e.target.value)} />
      <br /> <br />
      <input  type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])} />
      <br /> <br />
      {family.map((member, index)=>(
        <div key={index}>
          <input  type="text"
                  placeholder="Ism"
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...family];
                    updated[index].name = e.target.value;
                    setFamily(updated)
                  }} />
          <input  type="number"
                  placeholder="yoshi"
                  value={member.age}
                  onChange={(e) => {
                    const updated = [...family];
                    updated[index].age = e.target.value;
                    setFamily(updated)
                  }} />
          <br /><br />
        </div>
      ))}
      <button onClick={addFamilyMember}>
        Oila azosi qo'shish
      </button>
      {!isTelegram && (
        <button onClick={generateDoc}>Yaratish</button>
      )}
    </div>
  )
}
export default App;