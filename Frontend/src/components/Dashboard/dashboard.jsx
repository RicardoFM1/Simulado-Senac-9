import { Button, Form, InputGroup } from "react-bootstrap";
import style from "./dashboard.module.css"
import { useEffect, useState } from "react";
import Api from "../../service/api";
import Tabela from "../Tabela/tabela";
import { IoMdArrowDropright } from "react-icons/io";
import { toast } from "react-toastify";
import { IoIosSearch } from "react-icons/io";
import UsuarioModal from "../Modais/Usuario/usuarioModal";


const Dashboard = () => {
    const [dashboard, setDashboard] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [retrieve, setRetrieve] = useState([])
    const [usuarioSelecionado, setUsuarioSelecionado] = useState([])
    const [usuarioFiltrado, setUsuarioFiltrado] = useState([])
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState('')

    const buscarDashboard = async () => {
        try {
            const res = await Api.get('/dashboard')

            if (res.status === 200) {
                setDashboard(res.data.dados)

            }
        } catch (err) {
            console.log(err)
        }
    }

    const buscarUsuarios = async () => {
        try {
            const res = await Api.get('/usuario')

            if (res.status === 200) {
                setUsuarios(res.data.dados)
                setUsuarioFiltrado(res.data.dados)

            }
        } catch (err) {
            console.log(err)
        }
    }

    const buscarRetrieve = async () => {
        try {
            const res = await Api.get('/retrieve')

            if (res.status === 200) {
                setRetrieve(res.data.dados)


            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarDashboard()
        buscarUsuarios()
        buscarRetrieve()
    }, [])

    useEffect(() => {
        setUsuarioFiltrado(
            usuarios.filter((u) => ((u.nome + "" + u.email + "" + u.cpf + "" + u.cargo)).toLowerCase().includes(search?.toLowerCase()))
        )
    }, [search])


    const handleNovo = () => {
        setShow(true)
        setUsuarioSelecionado(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setUsuarioSelecionado(row)
    }

    const handleClose = () => {
        setShow(false)
        setUsuarioSelecionado(null)
        buscarDashboard()
        buscarUsuarios()

    }

    const columns = [
        { header: 'Nome', accessor: 'nome' },
        { header: 'Email', accessor: 'email' },
        { header: 'Cpf', accessor: 'cpf' },
        { header: 'Cargo', accessor: 'cargo' },
        {
            header: '', accessor: '', render: (row) => (
                <IoMdArrowDropright />
            )
        },

    ]

    const enviarDados = async (dados) => {
        try {
            let res;
            if (usuarioSelecionado) {
                res = await Api.put(`/usuario?email_usuario=${usuarioSelecionado.email}`, dados)

                if (res.status === 200) {
                    toast.success(res.data.mensagem || 'Sucesso ao atualizar usuário')
                    handleClose()
                }
            } else {
                res = await Api.post('/usuario', dados)

                if (res.status === 201) {
                    toast.success(res.data.mensagem || 'Sucesso ao registrar usuário')
                    handleClose()
                }
            }

        } catch (err) {
            const erros = err.response.data?.erros

            if (erros) {
                Object.values(erros).forEach((msg) => {
                    toast.error(msg)
                })
            } else {
                toast.error(err.response.data?.mensagem)
            }
        }
    }

    const handleDeletar = async () => {
        try {
            const res = await Api.delete(`/usuario?email_usuario=${usuarioSelecionado.email}`)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Sucesso ao deletar usuário')
                handleClose()
            }
        } catch (err) {
            const erros = err.response.data?.erros

            if (erros) {
                Object.values(erros).forEach((msg) => {
                    toast.error(msg)
                })
            } else {
                toast.error(err.response.data?.mensagem)
            }
        }
    }
    return (
        <>
        <div className={style.divCards}>

        <div className={style.card}>Card</div>
        <div className={style.card}>Card</div>
        <div className={style.card}>Card</div>
        <div className={style.card}>Card</div>

        </div>
            {retrieve?.cargo_usuario === 'administrador' ? (
                <>
                    <div className="d-flex align-items-center justify-content-between">

                        <div className="m-5">
                            <h1>Administração:</h1>
                            <hr />
                            <h1>Listagem de usuários</h1>
                            <p>{usuarioFiltrado.length ?? 0} usuários listados</p>
                            <h5 className="text-muted">Clique na linha da tabela para gerenciar os usuários</h5>

                        </div>

                        <div className="me-4 d-flex gap-3">
                            <InputGroup>

                                <InputGroup.Text><IoIosSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Busque um usuário"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </InputGroup>
                            <Button className={style.btnFiltro} onClick={() => setSearch('')}>Todos</Button>
                            <Button className={style.btnFiltro} onClick={() => setSearch('administrador')}>Administrador</Button>
                            <Button className={style.btnFiltro} onClick={() => setSearch('ceremonialista')}>Ceremonialista</Button>
                          


                        </div>
                    </div>

                    <Button className={style.btnAdicionar} onClick={handleNovo}>Adicionar novo registro</Button>
                    <Tabela rows={usuarioFiltrado} columns={columns} handleSelected={handleSelected} keyField={'id_usuario'} />
                    <UsuarioModal dados={usuarioSelecionado} show={show} onSubmit={enviarDados} handleClose={handleClose} handleDeletar={handleDeletar} />
                </>
            ) : ("")}
        </>
    )
}
export default Dashboard;