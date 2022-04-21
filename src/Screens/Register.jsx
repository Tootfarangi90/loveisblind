import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [error,setError] = useState()
  const [firstname, setFirstName] = useState("")
  const [lastname, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [email,setEmail] = useState("")
  const [username, setUser] = useState("")

  const firstnameChanged                = e => setFirstName(e.target.value)
  const lastnameChanged                 = e => setLastName(e.target.value)
  const passwordChanged                 = e => setPassword(e.target.value)
  const emailChanged                    = e => setEmail(e.target.value)
  const userChanged                     = e => setUser(e.target.value)
  
  async function onPost(e){  
    e.preventDefault()
    try{
      const res = await fetch('http://localhost:4001/register', {
      method: 'POST',
      headers:{
      'Content-Type': 'application/json'
      },
     
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password
      }),
      
    })
    const data = await res.json()
    
   


    console.log(data.message)
    if(data.status === 409){
     
      setError(data.message)
      console.log(data)
      return
    }
    if(data.status === 200) {
      setError("")
      alert('Welcome!')
      window.location.href='/login'
    }
    }
    catch(error)  {
      console.log(error)
      
    }
    
  }
  async function onPost1(e){  
    e.preventDefault()
    try{
      const res = await fetch('http://localhost:4001/register', {
      method: 'POST',
      headers:{
      'Content-Type': 'application/json'
      },
     
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password
      }),
      
    })
    const data = await res.json()
    
   


    console.log(data.message)
    if(data.status === 409){
     
      setError(data.message)
      console.log(data)
      return
    }
    if(data.status === 200) {
      setError("")
      alert('Welcome!')
      window.location.href='/login'
    }
    }
    catch(error)  {
      console.log(error)
      
    }
    
  }

  
  
  return (

  <div className='container-center'>
    <div className='form-wrapper'>
      <div id='form-container'>
    <h1>Register</h1>
    <form onSubmit={onPost1}>

<input 
type="text" 
name= "firstname" 
value={firstname}
placeholder="First Name"
onChange={firstnameChanged}

/>

<input type="text" 
name= "lastname" 
value = {lastname}
required= {true} 
placeholder="Last Name" 
onChange={lastnameChanged}/> 

<input type="text" 
name= "username" 
required= {true} 
value = {username}
placeholder="Username"
onChange={userChanged}/>

<input type="email" 
name= "email" 
value={email}
onChange={emailChanged}
placeholder="Email"

/>

<input type="password" 
name= "password" 
required= {true} 
value ={password}
onChange={passwordChanged}
placeholder="Password"/>
{/* <Input type="password" name= "password2" placeholder="Confirm Password"/> */}
{/* <Agreement>By creating an account, I consent to the processing of my personal data in accordance with the <b>PRIVACY POLICY</b></Agreement> */}
<button>Create</button>
</form>
<p>{error}</p>
      </div>
      </div>
      
  </div>
  )
}


