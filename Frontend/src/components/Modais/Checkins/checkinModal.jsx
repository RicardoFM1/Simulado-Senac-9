import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import style from "./checkinModal.module.css"
import {IMaskInput} from 'react-imask'

const CheckinModal = ({ dados, show, handleConfirmar, handleCancelar, handleClose }) => {
   
    console.log(dados)
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Gerenciar checkin</Modal.Title>
            </Modal.Header>
           
                <Modal.Body>
                    <p>Usuário: {dados?.usuario?.nome} - {dados?.usuario?.cpf}</p>
                    <p>Convidado: {dados?.convidado?.nome} {dados?.convidado?.sobrenome} - {dados?.convidado?.cpf}</p>
                    <p>Data e hora: {dados?.data_e_hora ? dados?.data_e_hora : '-'}</p>
                    <p>Status: {dados?.status ? dados?.status : '-'}</p>
                    <p>Confirmação: {dados?.convidado?.confirmacao ? dados?.convidado?.confirmacao : '-'}</p>


                   


                </Modal.Body>
                <Modal.Footer>
                    <Button className={style.btnCancelar} onClick={handleCancelar} type="button">Cancelar checkin</Button>

                    <Button className={style.btnSubmit} onClick={handleConfirmar} type="button">Confirmar checkin</Button>
                </Modal.Footer>
           
        </Modal>

    )
}

export default CheckinModal;