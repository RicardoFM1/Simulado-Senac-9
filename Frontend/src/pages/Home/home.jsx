import { useEffect, useState } from "react";
import Header from "../../components/Header/header";
import Dashboard from "../../components/Dashboard/dashboard";
import Convidados from "../../components/Convidados/convidados";
import Checkins from "../../components/Checkins/checkins";
import Mesas from "../../components/Mesas/mesas";
import { useNavigate } from "react-router";

const Home = () => {
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
    const navigate = useNavigate()
    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    }, [])
    return (
        <>
<Header telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva}/>

        <main>
            {telaAtiva === 'dashboard' && <Dashboard />}
            {telaAtiva === 'convidados' && <Convidados />}
            {telaAtiva === 'checkin' && <Checkins />}
            {telaAtiva === 'mesas' && <Mesas />}

        </main>
        </>
    )
}

export default Home;