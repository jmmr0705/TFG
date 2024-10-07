import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

export function Principal(){

    const [abrir, setActiveTab] = useState(null);

    const handleButtonClick = (tab) => {
    setActiveTab(tab);
    };

    const cerrar = () => {
    setActiveTab(null);
    };

    return (
        <Container fluid>
          {/* Barra Horizontal Superior */}
          <Row className="bg-dark text-white p-3">
            <Col>
              <h1 className="text-center">Mi Aplicación</h1>
            </Col>
          </Row>
          <Row className="bg-dark text-white p-3">
            <Col className="d-flex justify-content-center">
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab1')}>Top Button 1</Button>
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab2')}>Top Button 2</Button>
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab3')}>Top Button 3</Button>
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab4')}>Top Button 4</Button>
            </Col>
          </Row>
          <Row className="bg-dark text-white p-3">
            <Col className="d-flex justify-content-center">
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab5')}>Top Button 5</Button>
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab6')}>Top Button 6</Button>
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab7')}>Top Button 7</Button>
              <Button variant="secondary" className="m-1" onClick={() => handleButtonClick('top-tab8')}>Top Button 8</Button>
            </Col>
          </Row>
    
          {/* Contenido Principal con Barra Vertical Izquierda */}
          <Row className="flex-grow-1">
            <Col xs={2} className="bg-light p-3">
              <Button variant="secondary" className="w-100 mb-2" onClick={() => handleButtonClick('left-tab1')}>Left Button 1</Button>
              <Button variant="secondary" className="w-100 mb-2" onClick={() => handleButtonClick('left-tab2')}>Left Button 2</Button>
              <Button variant="secondary" className="w-100 mb-2" onClick={() => handleButtonClick('left-tab3')}>Left Button 3</Button>
            </Col>
            <Col xs={10} className="p-3">
              <h1>Contenido Principal</h1>
            </Col>
          </Row>
    
          {/* Pestaña Emergente */}
          <Modal show={!!abrir} onHide={cerrar}>
            <Modal.Header closeButton>
              <Modal.Title>{abrir}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Contenido de la pestaña {abrir}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cerrar}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      );
    };


export default App;