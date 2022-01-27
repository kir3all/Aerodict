
import { Component, useImperativeHandle } from 'react';
import React from 'react'
import { connect } from 'react-redux'
import { postAnswer } from '../actions/quiz'
import Button from '@mui/material/Button';


class MyButton extends Component {

    handleClick = () => {
        let formData = new FormData();
        formData.append('id', this.props.question.id);
        formData.append('answer', this.props.answer);
        this.props.postAnswer(formData)
    }

    render() {

        return (
            <div>
                <Button variant={this.props.variant} startIcon={this.props.startIcon} endIcon={this.props.endIcon} color={this.props.color} onClick={this.handleClick}>{this.props.text}</Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        question: state.aerodict.question,
    }
}

const mapDispatchToProps = (dispatch) => ({
    postAnswer: (form) => dispatch(postAnswer(form)),
})
export default connect(mapStateToProps, mapDispatchToProps)(MyButton);