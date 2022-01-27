import axios from 'axios'

export const url = 'http://' + document.location.hostname

export function getQuestion(itemId) {
    return (dispatch) => {
        axios
            .get(`${url}/api/get_question`, { params: { id: itemId } })
            .then((res) => {
                if (res.data.question) {
                    let question = res.data.question
                    console.log(question)
                    dispatch({ type: 'GET_QUESTION', question })
                }
            })
            .catch((err) => {
                alert(err.message)
            })
    }
}

export function postAnswer(form_data) {
    return (dispatch) => {
        axios
            .post(`${url}/api/check_answer`, form_data, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            })
            .then((res) => {
                let result = res.data.result
                dispatch({ type: 'CHECK_ANSWER', result })
            })
            .catch((err) => {
                alert(err.response.data.message)
            })
    }
}
