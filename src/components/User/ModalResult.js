import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalResult = (props) => {
    const { show, setShow, dataModalResult } = props;
    const handleClose = () => setShow(false);
    
    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Your Result...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Total Questions: <b>{ dataModalResult.countTotal }</b> </div>
                    <div>Total Questions: <b>{ dataModalResult.countCorrect }</b> </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Show answers
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalResult;