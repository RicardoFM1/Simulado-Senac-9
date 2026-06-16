import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import style from "./modalConfirmacao.module.css"

const ModalConfirmacao = ({show, setShow, handleClose, deletar }) => {
  
    

 
    const handleDeletar = () => {
        setShow(false)
        deletar()
    }
   
   
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="text-danger">TEM CERTEZA?</Modal.Title>
            </Modal.Header>
           
                <Modal.Body>
                   <p>Tem certeza mesmo que quer deletar esse registro? Essa ação é irreversível </p>

                </Modal.Body>
                <Modal.Footer>
                    <Button className={style.btnCancelar} onClick={handleClose} type="button">Cancelar</Button>
                    <Button className={style.btnDeletar} onClick={handleDeletar} type="button">Excluir</Button>


                    
                </Modal.Footer>
            
        </Modal>

    )
}

export default ModalConfirmacao;