import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import style from "./convidadoModal.module.css"
import { IMaskInput } from 'react-imask'
import ModalConfirmacao from "../ModalConfirmacao/modalConfirmacao";

const ConvidadoModal = ({ dados, show, onSubmit, handleClose, handleDeletar }) => {
    const [formData, setFormData] = useState({
        nome: "", sobrenome: "", email: "", cpf: "", categoria: "",
        confirmacao: "", telefone: "", mesa_idmesa: ""
    })
    const [editando, setEditando] = useState(false)
    const [showDeletar, setShowDeletar] = useState(false)

    useEffect(() => {
        if (dados) {
            setEditando(true)
            setFormData(dados)
        } else {
            setEditando(false);
            setFormData({
                nome: "", sobrenome: "", email: "", cpf: "", categoria: "",
                confirmacao: "", telefone: "", mesa_idmesa: ""
            })
        }
    }, [dados, show])

    const handleChange = (e) => {
        const { name, value } = e.target

        if (!name) console.log('Sem nome no input')

        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(formData)
    }
    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title >{editando ? 'Gerenciar convidado' : 'Registrar novo convidado'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Stack gap={3}>
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                placeholder="Inclua o nome do convidado"
                                value={formData.nome}
                                name="nome"
                                onChange={handleChange}
                                required={!editando}
                                
                                />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sobrenome</Form.Label>
                            <Form.Control
                                placeholder="Inclua o sobrenome do convidado"
                                value={formData.sobrenome}
                                name="sobrenome"
                                onChange={handleChange}
                                required={!editando}
                                
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                placeholder="Inclua o email do convidado"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                required={!editando}
                                
                                />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cpf</Form.Label>
                            <Form.Control
                                as={IMaskInput}
                                mask="000.000.000-00"
                                placeholder="Inclua o cpf do convidado"
                                value={formData.cpf}
                                name="cpf"
                                onChange={handleChange}
                                required={!editando}
                                
                                />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                placeholder="Inclua a categoria do convidado"
                                value={formData.categoria}
                                name="categoria"
                                onChange={handleChange}
                                required={!editando}
                                
                            >
                                <option value="">Selecione uma opção</option>
                                <option value="noivos">Noivos</option>
                                <option value="equipe">Equipe</option>
                                <option value="amigos">Amigos</option>
                                <option value="familia">Familia</option>

                            </Form.Select>
                        </Form.Group>
                        {editando ? (
                            
                            <Form.Group>

                                <Form.Label>Confirmação</Form.Label>
                                <Form.Select
                                    placeholder="Inclua a confirmação do convidado"
                                    value={formData.confirmacao}
                                    name="confirmacao"
                                    onChange={handleChange}
                                    required={!editando}
                                    
                                    >
                                    <option value="">Selecione uma opção</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="cancelado">Cancelado</option>

                                </Form.Select>
                            </Form.Group>
                        ) : ("")
                    }
                        <Form.Group>
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                as={IMaskInput}
                                mask="(00) 00000-0000"
                                placeholder="Inclua o telefone do convidado"
                                value={formData.telefone}
                                name="telefone"
                                onChange={handleChange}
                                required={!editando}

                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nº da mesa</Form.Label>
                            <Form.Control
                                placeholder="Inclua o nº da mesa do convidado"
                                value={formData.mesa_idmesa}
                                name="mesa_idmesa"
                                onChange={handleChange}
                                required={!editando}

                            />
                        </Form.Group>
                    </Stack>

                </Modal.Body>
                <Modal.Footer>
                    <Button className={style.btnCancelar} onClick={handleClose} type="button">Cancelar</Button>
                    <Button className={style.btnDeletar} onClick={() => setShowDeletar(!showDeletar)} type="button">Excluir</Button>

                    <Button className={style.btnSubmit} type="submit">{editando ? 'Salvar alterações' : 'Registrar'}</Button>
                </Modal.Footer>
            </Form>

        </Modal>
<ModalConfirmacao handleClose={() => setShowDeletar(false)} setShow={setShowDeletar} show={showDeletar} deletar={handleDeletar}/>

                                </>
    
    )
}

export default ConvidadoModal;