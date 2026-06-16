import { useState } from "react";
import Header from "../../components/Header/header";
import Dashboard from "../../components/Dashboard/dashboard";
import Convidados from "../../components/Convidados/convidados";
import Checkins from "../../components/Checkins/checkins";
import Mesas from "../../components/Mesas/mesas";

const Home = () => {
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
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