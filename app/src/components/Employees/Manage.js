import React, { Component } from 'react';
import { Modal, Button} from 'react-bootstrap';

export default class Manage extends Component{
    constructor(props){
        super(props);
        
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose(){
        this.setState({
            show: false
        });
    }

    handleShow(){
        this.setState({
            show: true
        });
    }

    render(){
        return(
            <div>
                <Button 
                    bsStyle='primary'
                    bsSize='small'
                    onClick={this.handleShow}>
                Manage
                </Button>

                <Modal show = {this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Manage</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle='success'>Submit Changes</Button>
                        <Button bsStyle='danger'>Retire</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}