const initialState = {
    question: { id: -1, img: "", text: "", title: "" },
    result: { answer: false, desciption: "" },
    showResult: false
}

const aerodict = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case 'GET_QUESTION': {
            return {
                ...state,
                question: action.question,
                showResult: false
            }
        }
        case 'CHECK_ANSWER':
            return {
                ...state,
                result: action.result,
                showResult: true
            }
        default:
            return state
    }
}

export default aerodict