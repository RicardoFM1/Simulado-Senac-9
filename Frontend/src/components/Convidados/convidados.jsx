import { Button, Form } from "react-bootstrap";
import style from "./convidados.module.css"
import { useEffect, useState } from "react";
import Api from "../../service/api";
import Tabela from "../Tabela/tabela";
import { IoMdArrowDropright } from "react-icons/io";
import { toast } from "react-toastify";
import ConvidadoModal from "../Modais/Convidados/convidadoModal";

const Convidados = () => {
    const [convidados, setConvidados] = useState([])
    const [convidadoSelecionado, setConvidadoSelecionado] = useState([])
    const [convidadoFiltrado, setConvidadoFiltrado] = useState([])
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState('')

    const buscarConvidados = async () => {
        try {
            const res = await Api.get('/convidado')

            if (res.status === 200) {
                setConvidados(res.data.dados)
                setConvidadoFiltrado(res.data.dados)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarConvidados()
    }, [])

    useEffect(() => {
        setConvidadoFiltrado(
            convidados.filter((c) => ((c.nome + "" + c.sobrenome + "" + c.email + "" + c.cpf + "" + c.categoria + "" + c.confirmacao + "" + c.telefone)).toLowerCase().includes(search?.toLowerCase()))
        )
    }, [search])


    const handleNovo = () => {
        setShow(true)
        setConvidadoSelecionado(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setConvidadoSelecionado(row)
    }

    const handleClose = () => {
        setShow(false)
        setConvidadoSelecionado(null)
        buscarConvidados()
    }

    const columns = [
        { header: 'Nome', accessor: 'nome' },
        { header: 'Sobrenome', accessor: 'sobrenome' },
        { header: 'Email', accessor: 'email' },
        { header: 'Cpf', accessor: 'cpf' },
        { header: 'Categoria', accessor: 'categoria' },
        {
            header: 'Confirmação', accessor: 'confirmacao', render: (row) => {
                if (row.confirmacao === 'confirmado') {
                    return <span className="text-success">{row.confirmacao}</span>
                }
                if (row.confirmacao === 'pendente') {
                    return <span className="text-warning">{row.confirmacao}</span>
                }
                if (row.confirmacao === 'cancelado') {
                    return <span className="text-danger">{row.confirmacao}</span>
                }
            }
        },
        { header: 'Telefone', accessor: 'telefone' },
        { header: 'Nº da mesa', accessor: 'mesa_idmesa' },


        {
            header: '', accessor: '', render: (row) => (
                <IoMdArrowDropright />
            )
        },

    ]

    const enviarDados = async (dados) => {
        try {
            let res;
            if (convidadoSelecionado) {
                res = await Api.put(`/convidado?email_convidado=${convidadoSelecionado.email}`, dados)

                if (res.status === 200) {
                    toast.success(res.data.mensagem || 'Sucesso ao atualizar convidado')
                    handleClose()
                }
            } else {
                res = await Api.post('/convidado', dados)

                if (res.status === 201) {
                    toast.success(res.data.mensagem || 'Sucesso ao registrar convidado')
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
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">

                <div className="m-5">
                    <h1>Listagem de convidados</h1>
                    <p>{convidadoFiltrado.length ?? 0} Convidados listados</p>
                    <h5 className="text-muted">Clique na linha da tabela para gerenciar os convidados</h5>

                </div>

                <div className="me-4 d-flex gap-3">
                    <Form.Control
                        placeholder="Busque um convidado"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button className={style.btnFiltro} onClick={() => setSearch('')}>Todos</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('pendente')}>Pendentes</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('confirmado')}>Confirmados</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('cancelado')}>Cancelados</Button>


                </div>
            </div>

            <Button className={style.btnAdicionar} onClick={handleNovo}>Adicionar novo registro</Button>
            <Tabela rows={convidadoFiltrado} columns={columns} handleSelected={handleSelected} keyField={'id_convidado'} />
            <ConvidadoModal dados={convidadoSelecionado} show={show} onSubmit={enviarDados} handleClose={handleClose} />
        </>
    )
}
export default Convidados;