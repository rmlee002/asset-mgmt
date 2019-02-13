import React, { Component } from 'react';
import { Modal, Form, FormGroup, ControlLabel, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

export default class ManageModal extends Component{
    constructor(props){
        super(props)

        this.handleClick = this.handleClick.bind(this)

        this.state={
            show: false,
            style: null,
            value: null
        }
    }

    componentDidMount(){
        if(this.props.id === 'Assign'){
            this.setState({
                style: 'success',
                value: 'start'
            })
        }
        else{
            this.setState({
                style: 'danger',
                value: 'end'
            })
        }        
    }

    handleClick(){
        this.setState({
            show: true
        }, 
        () => { 
            if (this.props.handleClick){
                this.props.handleClick()
            }
        })
    }

    render(){
        return(
            <React.Fragment>
                <Button 
                    bsStyle={this.state.style}
                    bsSize='small'
                    onClick={this.handleClick}
                >
                    {this.props.id}
                </Button>
                <Modal 
                    show={this.state.show}
                    onHide={() => this.setState({ show: false })}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        Enter {this.state.value} date: 
                                    </Col>
                                    <Col sm={4}>
                                        <DatePicker
                                            selected={this.props.date}
                                            onChange={this.props.handleDate}
                                        />
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button 
                                disabled={this.props.date === null} 
                                bsStyle={this.state.style}
                                onClick={this.props.handleSubmit}
                            >
                                {this.props.id}
                            </Button>
                        </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}