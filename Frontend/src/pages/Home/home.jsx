import { useState } from "react";
import Header from "../../components/Header/header";

const Home = () => {
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
    return (
        <Header telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva}/>
    )
}

export default Home;