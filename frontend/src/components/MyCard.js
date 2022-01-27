import { Component, useImperativeHandle } from 'react';
import React from 'react'
import { connect } from 'react-redux'
import ProgressButton from 'react-progress-button'
import { getQuestion, url } from '../actions/quiz'
import MyButton from './MyButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

class MyCard extends Component {

    componentDidMount() {
        this.props.getQuestion()
    }

    componentDidUpdate() {
        console.log(this.props)
    }

    handleNext = () => {
        this.props.getQuestion()
    }

    handleResult() {
        if (this.props.showResult) {
            var res = this.props.result.answer ? "Ес, так точно!" : "Не-а, попробуй снова!"
            return (<Card sx={{ maxWidth: 345 }}>
                <CardContent>
                    <h1>{res}</h1>
                    <p>{this.props.result.description}</p>
                </CardContent>
            </Card>)
        } else {
            return <div></div>
        }
    }

    render() {

        return (
            <div className="Card">
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={url + "/" + this.props.question.img}
                    />
                    <CardContent>
                        <h1>{this.props.question.title}</h1>
                        <p>{this.props.question.text}</p>
                    </CardContent>
                    <CardActions>
                        <Stack spacing={2} direction="row">
                            <MyButton variant="contained" startIcon={<CheckBoxIcon />} color="success" text="Да, верю" answer="yes" />
                            <IconButton color="primary" variant="contained" onClick={this.handleNext}>
                                <DoubleArrowIcon />
                            </IconButton>
                            <MyButton variant="outlined" endIcon={<CancelIcon />} color="error" text="Не верю" answer="no" />
                        </Stack>
                    </CardActions>
                </Card>

                <p></p>
                <div>{this.handleResult()}</div>
            </div>


        );
    }
}

const mapStateToProps = (state) => {
    return {
        question: state.aerodict.question,
        result: state.aerodict.result,
        showResult: state.aerodict.showResult
    }
}

const mapDispatchToProps = (dispatch) => ({
    getQuestion: () => dispatch(getQuestion()),
})
export default connect(mapStateToProps, mapDispatchToProps)(MyCard);