import { useEffect, useState } from 'react'

function App() {
  const [images,setImages]= useState([])
  const headers = {
    Authorization: "efKmjO98NTW2P6B0yW0jwk6dgHw8H8gYKfK4zlpteXvQDi8PBHOVmnkL"
  }
 fetch("https://api.pexels.com/v1/search?query=nature",{
  headers
 })
 .then(res=>res.json)
 .then(data=>{
  console.log(data);
 })
 .catch(error=>{
  console.error("Error: ", error);
 })

  return (
    
    <div>
      <h1 className='bg-blue-300'>GALERIA 3d</h1>
    </div>
  )
}

export default App
