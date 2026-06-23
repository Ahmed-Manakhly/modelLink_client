import Auth from '../components/layout/auth/Auth' ;
import {getAuthToken} from '../utility/tokenLoader'
import {useEffect} from 'react' ;
import {useNavigate } from 'react-router-dom';



function AuthPage() {
  const navigate = useNavigate();
  const token = getAuthToken() ;
  useEffect(() => {
      if(token){
          navigate("/",{replace :true});
          return ;
      }
  })
  //-------------------------------------
  return (
    <main style={{height:'100vh'}}>
      {!token &&<Auth/>}
    </main>
  )
}

export default AuthPage
