import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function TransferMoneyModal({ show, handleClose, onSubmit }) {
  const [senderAddress, setSenderAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(senderAddress);  // Correctly call the onSubmit function
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Transfer Money</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSenderAddress">
            <Form.Label>Sender Wallet Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter sender wallet address"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className='mt-2'>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TransferMoneyModal;
