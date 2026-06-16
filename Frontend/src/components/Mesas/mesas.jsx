import { Button, Form, InputGroup } from "react-bootstrap";
import style from "./mesas.module.css"
import { useEffect, useState } from "react";
import Api from "../../service/api";
import Tabela from "../Tabela/tabela";
import { IoMdArrowDropright } from "react-icons/io";
import MesaModal from "../Modais/Mesa/mesaModal";
import { toast } from "react-toastify";
import { IoIosSearch } from "react-icons/io";


const Mesas = () => {
    const [mesas, setMesas] = useState([])
    const [mesaSelecionada, setMesaSelecionada] = useState([])
    const [mesaFiltrada, setMesaFiltrada] = useState([])
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState('')

    const buscarMesas = async () => {
        try {
            const res = await Api.get('/mesa')

            if (res.status === 200) {
                setMesas(res.data.dados)
                setMesaFiltrada(res.data.dados)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        buscarMesas()
    }, [])

    useEffect(() => {
        setMesaFiltrada(
            mesas.filter((m) => String((m.id_mesa)).includes(search))
        )
    }, [search])


    const handleNovo = () => {
        setShow(true)
        setMesaSelecionada(null)
    }

    const handleSelected = (row) => {
        setShow(true)
        setMesaSelecionada(row)
    }

    const handleClose = () => {
        setShow(false)
        setMesaSelecionada(null)
        buscarMesas()
    }

    const columns = [
        { header: 'Nº', accessor: 'id_mesa' },

        { header: 'Capacidade', accessor: 'capacidade' },
        {
            header: '', accessor: '', render: (row) => (
                <IoMdArrowDropright />
            )
        },

    ]

    const enviarDados = async (dados) => {
        try {
            let res;
            if (mesaSelecionada) {
                res = await Api.put(`/mesa?id_mesa=${mesaSelecionada.id_mesa}`, dados)

                if (res.status === 200) {
                    toast.success(res.data.mensagem || 'Sucesso ao atualizar mesa')
                    handleClose()
                }
            } else {
                res = await Api.post('/mesa', dados)

                if (res.status === 201) {
                    toast.success(res.data.mensagem || 'Sucesso ao registrar mesa')
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

    const handleDeletar = async() => {
        try{
            const res = await Api.delete(`/mesa?id_mesa=${mesaSelecionada.id_mesa}`)

            if(res.status === 200){
                toast.success(res.data.mensagem || 'Sucesso ao deletar mesa')
                handleClose()
            }
        }catch(err){
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
                    <h1>Listagem de mesas</h1>
                    <p>{mesaFiltrada.length ?? 0} Mesas listadas</p>
                    <h5 className="text-muted">Clique na linha da tabela para gerenciar as mesas</h5>

                </div>

                <div className="me-4">
                    <InputGroup>
                    <InputGroup.Text><IoIosSearch/></InputGroup.Text>
                    <Form.Control
                        placeholder="Busque uma mesa (nº)"
                        onChange={(e) => setSearch(e.target.value)}
                        />
                        </InputGroup>
                </div>
            </div>

            <Button className={style.btnAdicionar} onClick={handleNovo}>Adicionar novo registro</Button>
            <Tabela rows={mesaFiltrada} columns={columns} handleSelected={handleSelected} keyField={'id_mesa'} />
            <MesaModal dados={mesaSelecionada} show={show} onSubmit={enviarDados} handleClose={handleClose} handleDeletar={handleDeletar} />
        </>
    )
}
export default Mesas;