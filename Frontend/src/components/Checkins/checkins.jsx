import { Button, Form, InputGroup } from "react-bootstrap";
import style from "./checkins.module.css"
import { useEffect, useState } from "react";
import Api from "../../service/api";
import Tabela from "../Tabela/tabela";
import { IoMdArrowDropright } from "react-icons/io";
import { toast } from "react-toastify";
import { IoIosSearch } from "react-icons/io";
import CheckinModal from "../Modais/Checkins/checkinModal";


const Checkins = () => {
    const [checkins, setCheckins] = useState([])
    const [checkinSelecionado, setCheckinSelecionado] = useState([])
    const [checkinFiltrado, setCheckinFiltrado] = useState([])
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState('')

    const buscarCheckins = async () => {
        try {
            const res = await Api.get('/checkin')

            if (res.status === 200) {
                setCheckins(res.data.dados)
                setCheckinFiltrado(res.data.dados)
                console.log(res.data.dados, 'checkins')
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarCheckins()
    }, [])

    useEffect(() => {
        setCheckinFiltrado(
            checkins.filter((c) => ((String(c.id_convidado) + "" + c.convidado.nome + "" + c.convidado.sobrenome + "" + c.convidado.cpf + "" + c.convidado.confirmacao + "" + c.usuario.nome + "" + c.usuario.cpf + "" + c.status)).toLowerCase().includes(search?.toLowerCase()))
        )
    }, [search])


    const handleNovo = () => {
        setShow(true)
        setCheckinSelecionado(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setCheckinSelecionado(row)
    }

    const handleClose = () => {
        setShow(false)
        setCheckinSelecionado(null)
        buscarCheckins()
    }

    const columns = [
        { header: 'Nº', accessor: 'id_convidado' },
        { header: 'Usuário', accessor: 'usuario', render: (row) => (row.usuario ? `${row.usuario.nome || ''} - ${row.usuario.cpf || ''}` : '-') },
        { header: 'Convidado', accessor: 'convidado', render: (row) => (row.convidado ? `${row.convidado.nome} ${row.convidado.sobrenome} - ${row.convidado.cpf}` : '-') },
        { header: 'Data e Hora', accessor: 'data_e_hora', render: (row) => (row.data_e_hora ? row.data_e_hora : '-') },
        { header: 'Checkin', accessor: 'status', render: (row) => (row.status ? row.status : "não realizado") },
        {
            header: 'Confirmação', accessor: 'convidado.confirmacao', render: (row) => {
                if (row.convidado.confirmacao === 'confirmado') {
                    return <span className="text-success">{row.convidado.confirmacao}</span>
                }
                if (row.convidado.confirmacao === 'pendente') {
                    return <span className="text-warning">{row.convidado.confirmacao}</span>
                }
               
                else {
                    return '-'
                }
            }
        },



        {
            header: '', accessor: '', render: (row) => (
                <IoMdArrowDropright />
            )
        },

    ]

    const handleConfirmar = async () => {
        try {
            console.log(checkinSelecionado?.id_convidado)
            const res = await Api.post('/checkin', {convidado_idconvidado: checkinSelecionado?.id_convidado})

            if (res.status === 201) {
                toast.success(res.data.mensagem || 'Convidado confirmado com sucesso')
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

    const handleCancelar = async (dados) => {
        try {
            const res = await Api.put(`/checkin/cancelar?id_checkin=${checkinSelecionado?.id_checkin}`)

            if (res.status === 200) {
                toast.success(res.data.mensagem || 'Checkin cancelado com sucesso')
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
            <div className="d-flex align-items-center justify-content-between">

                <div className="m-5">
                    <h1>Listagem de convidados</h1>
                    <p>{checkinFiltrado.length ?? 0} Convidados listados</p>
                    <p className="text-muted">Clique na linha da tabela para gerenciar os convidados</p>
                    <p className="text-muted">Confirme o checkin de algum convidado</p>


                </div>

                <div className="me-4 d-flex gap-3">
                    <InputGroup>
                        <InputGroup.Text><IoIosSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Busque um convidado"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                    <Button className={style.btnFiltro} onClick={() => setSearch('')}>Todos</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('pendente')}>Pendentes</Button>
                    <Button className={style.btnFiltro} onClick={() => setSearch('confirmado')}>Confirmados</Button>
                   


                </div>
            </div>


            <Tabela rows={checkinFiltrado} columns={columns} handleSelected={handleSelected} keyField={'id_convidado'} />
            <CheckinModal dados={checkinSelecionado} show={show} handleConfirmar={handleConfirmar} handleCancelar={handleCancelar} handleClose={handleClose} />
        </>
    )
}
export default Checkins;