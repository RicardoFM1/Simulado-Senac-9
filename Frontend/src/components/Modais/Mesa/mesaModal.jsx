import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import style from "./mesaModal.module.css"

const MesaModal = ({ dados, show, onSubmit, handleClose }) => {
    const [formData, setFormData] = useState({
        capacidade: ""
    })
    const [editando, setEditando] = useState(false)

    useEffect(() => {
        if (dados) {
            setEditando(true)
            setFormData(dados)
        } else {
            setEditando(false);
            setFormData({ capacidade: "" })
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title >{editando ? 'Gerenciar mesa' : 'Registrar nova mesa'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Stack>
                        <Form.Group>
                            <Form.Label>Capacidade</Form.Label>
                            <Form.Control
                                placeholder="Defina a capacidade da mesa"
                                value={formData.capacidade}
                                name="capacidade"
                                onChange={handleChange}
                                required={!editando}
                                type="number"
                            />
                        </Form.Group>
                    </Stack>

                </Modal.Body>
                <Modal.Footer>
                    <Button className={style.btnCancelar} onClick={handleClose} type="button">Cancelar</Button>

                    <Button className={style.btnSubmit} type="submit">{editando ? 'Salvar alterações' : 'Registrar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>

    )
}

export default MesaModal;