import logo from './logo.svg';
import { useImperativeHandle } from 'react';
import { connect } from 'react-redux'
import { getQuestion } from './actions/quiz'
import MyCard from './components/MyCard'
import UnderlineLink from './components/Links';

function App(props) {
  const handleQuiz = () => {
    props.getQuestion()
  }

  return (
    <div className="App">

      <MyCard />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getQuestion: () => dispatch(getQuestion()),
})
export default connect(null, mapDispatchToProps)(App);
