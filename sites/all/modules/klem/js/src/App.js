import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import shortid from 'shortid';
import './App.css';
import {Button, ButtonGroup, Card, Col, Container, Form, Modal, ProgressBar, Row, ListGroup} from "react-bootstrap";
import axios from 'axios';
import SecureLS from 'secure-ls';
import {motion} from "framer-motion";

async function getKlem(node, apikey, token) {
    return axios({
        method: 'get',
        url: '**YOURURL***' + "/api/content/"+parseInt(node)+"?API-KEY="+apikey+"&TOKEN="+token,
        responseType: 'json'
    }).then((response) => {

        return response;
    }).catch((err) => {

    });
}

async function getData(node, apikey, token) {

    return axios({
        method: 'get',
        url: '***YOURURL***' + '/puzzel_data/puzzels/' + node,
        headers: {
            APIKEY: apikey,
            TOKEN: token
        },
        responseType: 'json'
    }).then((response) => {
        return response;
    }).catch((err) => {
    });

}

async function saveData(node, apikey, token, data) {

    axios({
        method: 'put',
        url: '***YOURURL***' + '/puzzel_data/puzzels/' + parseInt(node),
        headers: {
            APIKEY: apikey,
            TOKEN: token
        },
        data: {puzzel_data: data},
        dataType: 'json',
        contentType: 'application/json'
    }).then((response) => {
    }).catch((err) => {

    });
}


function capitalize(string)
{
  let stringNew = null;
  if (string)
  {
    stringNew = string.replace(/\[.*?]/,'');
  }
  else
  {
    return null;
  }

  return stringNew.charAt(0).toUpperCase() + stringNew.slice(1);
}

function hopkroftCarp(matrix) {

    let bipartiteMatching = require('bipartite-matching');

    let vertices = matrix.length;
    let edges = [];
    let x = 0;
    let row, col;

    for (row = 0; row < vertices; row++)
    {
        for (col = 0; col < vertices; col++)
        {
            if (matrix[row][col] !== 0)
            {
                edges[x] = [row, col];
                x += 1;
            }
        }
    }

    return bipartiteMatching(vertices, vertices, edges)

}

function useSecureLocalStorage(key, initialValue)
{
    let ls = new SecureLS();
    const dateLastNight = new Date();
    const lastNight = dateLastNight.setHours(0,0,0,0);
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = ls.get(key);
            const credits = ls.get('Zlux');

            switch (key) {
                case '**CODE**':
                    if (item && item.value >= 0 && item.timeStamp > lastNight)
                    {
                        return item;
                    }
                    else
                    {
                        return initialValue;
                    }
                case '**CODE**':
                {
                    return item;
                }
                case '**CODE**':
                {
                  if (item > 0) {
                    return item;
                  }
                  else
                  {
                    return initialValue;
                  }
                }
                default:
                    if (item && credits.timeStamp > lastNight)
                    {
                        return item;
                    }
                    else
                    {
                        ls.set('**CODE**', 0);
                        ls.set('**CODE**', false);
                        return initialValue;
                    }

            }
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = value => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            ls.set(key, valueToStore);
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue]
}


function Answer(props)  {

    const {answer, onClick, question, reset, started, hint, showAnswer} = props;

    const [answerState, setAnswerState] = useState({color: 'light', disabled: false, class: ''});

    useEffect(function () {
        if (reset)
        {
          setTimeout(function () {
            setAnswerState({color: 'light', disabled: false, class: ''});
          }, 1000)
        }
    }, [reset]);


    useEffect(function () {
        if (!started)
        {
            setAnswerState({color: 'light', disabled: true, class: ''});
        }
        else
        {
            setAnswerState({color: 'light',disabled: false, class: ''});
        }

    }, [started]);

    useEffect(function () {

        if (hint && answer.matrix[question][answer.id] && answerState.color !== 'right')
        {
            setAnswerState({color: 'hint', disabled: false, class: ''});
        }
        else if (hint && answer.matrix[question][answer.id] && answerState.color === 'right')
        {
            setAnswerState({color: 'hint-green', disabled: true, class: ''});
        }
        else if (!hint && answerState.color === 'hint-green')
        {
            setAnswerState({color: 'right', disabled: true, class: ''});
        }
        else if ((answerState.color !== 'right' && answerState.color !== 'hint-green' && started))
        {
            setAnswerState({color: 'light', disabled: false, class: ''});
        }
    }, [hint] );

    function setLocalState(id)
    {
        if (answer.matrix[question][id])
        {
            setAnswerState({color: 'right', disabled: true, class: ''});
            onClick(true);
        }
        else
        {
            setAnswerState({color: "false", disabled: true, class: 'shake'});
            setTimeout(function () {
                onClick(false);
            }, 800);
        }
    }

  return (

        <Button className={answerState.class} variant={answerState.color} disabled={answerState.disabled} key={answer.id} onClick={() => setLocalState(answer.id)} size="lg" block>{capitalize(answer.answer)} {showAnswer ? answer.questions[answer.id][1] : ''}</Button>
  )
}

function getId() {
  return shortid.generate();
}

function Question(props) {
  const {question} = props;
  const [id, setId] =  useState(getId());
  useEffect(function () {
      setId(getId());
  }, [question]);
  return(
          <h2 key={id} className="klem-question fadeIn" align="center">{capitalize(question)}</h2>
  );
}

function Hint(props)
{
    const {started, onClick, credits, creditsHints} = props;
    const [disable, setDisable] = useState(false);

    useEffect(function () {
        if (parseInt(credits.value) < parseInt(creditsHints))
        {
            setDisable(true);
        }
    }, [credits]);

    return(
        <Button  className="btn-space" disabled={!started || (started && credits.value <= creditsHints)|| disable} variant="warning" size="lg" onClick={onClick}>Ik wil een hint</Button>
    );
}

function Stuck(props) {

  const {started, onClick, creditsStuck, credits} = props;

 return (
   <Button className="btn-space" disabled={!started || ( started && credits.value <= creditsStuck)} variant="warning" size="lg" onClick={onClick}>Ik zit klem</Button>
 );
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() =>{
        function tick() {
            savedCallback.current();
        }
        if (delay !== null)
        {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function CountDown(props) {

    const {timer, fixedTime} = props;
        return (

            <div>
                {fixedTime > 0 ? <ProgressBar variant="info" now={(timer/fixedTime) * 100} label={`${(timer)}s`} /> : <></> }
            </div>
        );
}

function App(props) {

  const {node, user, token, pubDate, creditsInit, timerInit, wrongAnswerCredits, timeEndCredits, hintCredits, creditsPerRoundInit, creditsOneTimeInit } = props;
  const [games, setGames] = useState(null);
  const [currentGame, setCurrentGame] = useSecureLocalStorage('Yokp1', null);
  const [currentQuestion, setCurrentQuestion] = useState( 0);
  const [resetState, setResetState] = useState(false);
  const [gameState, setGameState] = useState({started: false, playing: false, ended: false});
  const [showEndModal, setShowEndModal] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [numRight, setNumRight] = useState(0);
  const [succeeded, setSucceeded] = useState(false);

  const dateNow = Date.now();
  const [credits, setCredits] = useSecureLocalStorage('Zlux', {value: parseInt(creditsInit), timeStamp: dateNow });
  const [creditsWrongAnswer, setCreditsWrongAnswer] = useState(wrongAnswerCredits);
  const [creditsEndTime, setCreditsEndTime] = useState(timeEndCredits);
  const [creditsHints, setCreditsHints] = useState(hintCredits);
  const [creditsPerRound, setCreditsPerRound] = useState(creditsPerRoundInit);
  const [creditsOneTime, setCreditsOneTime] = useState(creditsOneTimeInit);

  const [timer, setTimer] = useSecureLocalStorage("tm2", timerInit);
  const [fixedTime] = useState(timerInit);
  const [oneShot, setOneShot] = useState(true);
  const [endScreen, setEndScreen] = useSecureLocalStorage('NDE', {ended: false, succeeded: false});
  const [transitionScreen, setTransitionScreen] = useState(false);


    useEffect(function () {
        setData();
        return () => {};
    },[]);

    useInterval(() => {
        if (timer > 0 && gameState.started)
        {
            console.log("TimerAdd");
            setTimer(timer - 1);
            setGameState({started: true, playing: true, ended: false});
        }
        else if (timer < 0 && gameState.playing)
        {
            setGameState({started: false, ended: true, playing: false});
            setOneShot(false);
            if (parseInt(credits.value) > creditsEndTime)
            {
                setCredits({value: (parseInt(credits.value) - creditsEndTime), timeStamp: dateNow });
            }
            else
            {
                setCredits({value: 0, timeStamp: dateNow});
            }
            setSucceeded(false);
            setEndScreen({ended: true, succeeded: false});

        }
        else if ((((timer > 0 && gameState.ended) || gameState.ended)) && credits > 0)
        {
            setTimer(fixedTime);
            setOneShot(true);
            setCurrentQuestion(0);
        }

    }, 1000);

    // game ends when no credits
    useEffect(function () {
        if (parseInt(credits.value) <= 0 && gameState.started)
        {
            setCredits({value: 0, timeStamp: dateNow});
            setGameState({started: false, ended: true, playing: false});
            setShowEndModal(true);
        }
    }, [credits]);

    // second game and later start immediately

    useEffect(() => {
      console.log("startImmediate");
      console.log(gameState);
      if (currentGame && currentGame.game > 0) {
          if (oneShot)
          {
            setTimeout(() => {
              setGameState({started: true, playing: true, ended: false});
              setCurrentQuestion(0);
            }, 3000);
          }
          else
          {
            console.log("ImmediateStarted");
            setGameState({started: true, playing: true, ended: false});
            setCurrentQuestion(0);
          }
          setOneShot(true);

      }
    }, [currentGame]);


    useEffect(() => {
      console.log("resetStateOnOff");
      console.log(gameState);
      if (gameState.ended)
      {
        console.log("realReset")
        console.log(gameState);
        setResetState(true);
        setTimeout(() => {
          setResetState(false);
        }, 1500);

      }
    }, [gameState]);


  function setData() {
    let matrix, questions, answers, set;
    let x, y;
    let i;
    let docs = [];
    let counter = 0;

    let data = getKlem(node, user.apikeys.api_service.api_key, user.apikeys.api_service.token);
      data.then(data => {

      let data_new = data.data.fields.field_klem_set['und'][0].value;
      data_new = data_new.split("\n");

        for (const item of Object.values(data_new)) {

            matrix = [];
            questions = [];
            answers = [];
            set = data_new[counter];
            set = JSON.parse(set);

            for (x = 0; x < (set[0].length) - 1; x++) {
                matrix[x] = [];
                for (y = 0; y < (set[0].length) - 1; y++) {
                    matrix[x][y] = set[x + 1][y + 1];
                }
            }

            for (i = 0; i < (set[0].length) - 1; i++) {
                answers[i] = {};
                answers[i].answer = set[0][i + 1];
                answers[i].id = i;
                answers[i].matrix = matrix;
                questions[i] = set[i + 1][0];
            }

            docs.push({

                id: item.id,
                title: set[0][0],
                answers: answers,
                questions: questions,
                matrix: matrix,
                game: counter,
                number: answers.length,
                sets: data_new.length,

            });

            counter++;
        }

        if (!currentGame && !endScreen.ended)
        {
            setCurrentGame(docs[0]);
        }

        setGames(docs);
    });
  }

  function showControls() {

      if (typeof user.roles !== 'undefined')
      {
          let roles = user.roles;
          if (roles[3] === 'administrator')
          {
              return true;
          }
      }

      return false;
  }

  function handleAnswer(isRight) {

      let numberOfQuestions = currentGame.answers.length;
      setResetState(false);
      console.log("handleAnswer");
      setGameState({started: true, playing: true, ended: false});
      setShowHints(false);

      function nextQuestion(currentQuestion)
      {
         if (currentQuestion < (numberOfQuestions - 1) ) {

             return (currentQuestion) => currentQuestion + 1;
         }
         else
         {
             return 0;
         }
      }

      // Right answer
      if (isRight)
      {
          // Still more questions
          if (numRight+1 < numberOfQuestions)
          {
              setCurrentQuestion(nextQuestion(currentQuestion));
              setNumRight(numRight + 1);
          }
          // No more questions
          else
          {
              setGameState({started: false, playing: false, ended: true});
              setNumRight(0);
              setSucceeded(true);
              // In one shot
              if (oneShot)
              {
                  setCredits({value: (parseInt(credits.value) + parseInt(creditsOneTime) + parseInt(creditsPerRound) * numberOfQuestions), timeStamp: dateNow});

              }
              // Not in one shot
              else
              {
                  setCredits({value: (parseInt(credits.value) + parseInt(creditsPerRound) * numberOfQuestions), timeStamp: dateNow});
              }

              // Not ready
              if (currentGame.game < (games.length - 1))
              {
                  setCurrentGame(games[currentGame.game + 1])

              }
              // Ready
              else
              {
                  setEndScreen({ended: true, succeeded: true});
              }
          }
      }

      // Wrong answer
      else
      {
          setOneShot(false);
          setCredits({value: (parseInt(credits.value) - creditsWrongAnswer), timeStamp: dateNow});
          setResetState(true);
          setNumRight(0);
          setTimeout(function () {
            setResetState(false);
          }, 1500);
      }


  }

  function handleClickStuck() {

    setCredits({value: (parseInt(credits.value) - creditsWrongAnswer), timeStamp: dateNow});
    setResetState(true);
    setOneShot(false);
    setNumRight(0);
    setTimeout(function () {
      setResetState(false);
    },1500 );
  }

  function handleFormSubmit(event) {

      const form = event.target;

      if (form.elements.timer.value)
      {
          const time = parseInt(form.elements.timer.value);
          localStorage.setItem('question_time', time.toString());
      }

      if (form.elements.creditsWrongAnswer.value)
      {
          const creditsWrongAnswer = parseInt(form.elements.creditsWrongAnswer.value);
          localStorage.setItem('creditsWrongAnswer', creditsWrongAnswer.toString());
      }

      if (form.elements.creditsEndTime.value)
      {
          const creditsEndTime = parseInt(form.elements.creditsEndTime.value);
          localStorage.setItem('creditsEndTime', creditsEndTime.toString());
      }

      if (form.elements.creditsHints.value)
      {
          const creditsHint = parseInt(form.elements.creditsHints.value);
          localStorage.setItem('creditsHint', creditsHint.toString());
      }

      if (form.elements.credits.value)
      {
          const credits = parseInt(form.elements.credits.value);
          setCredits({value: credits, timeStamp: dateNow});
      }

      if (form.elements.creditsPerRound.value)
      {
          const creditsPerRound = parseInt(form.elements.creditsPerRound.value);
          localStorage.setItem('creditsPerRound', creditsPerRound.toString());
      }

  }

  function handleChange(event) {
      const input = event.target;
      const value = input.value;

      switch (input.name) {

          case 'credits':
              setCredits({value: value, timeStamp: dateNow});
              break;
          case 'timer':
              setTimer(value);
              break;
          case 'creditsWrongAnswer':
              setCreditsWrongAnswer(value);
              break;
          case 'creditsEndTime':
              setCreditsEndTime(value);
              break;
          case 'creditsHints':
              setCreditsHints(value);
              break;
          case 'creditsPerRound':
              setCreditsPerRound(value);
              break;
          default:

      }
  }


  function renderMain(){

      return (
          <>
              {oneShot && gameState.ended ? <h3 className="klem-category scale">In een keer!</h3>: <></>}</>
      );
  }



  function renderEndModal() {

      const sol = hopkroftCarp(currentGame.matrix);

      return (
          <Container>

          {
          (showEndModal === true ?
              <Row>
                <Col xs={12}>
                  <h3 className="klem-category">De juiste antwoorden:</h3>
                  <br/>
                  <ListGroup variant="flush">
                      {sol.map(function (item) {
                          return <ListGroup.Item>{capitalize(currentGame.questions[item[0]])}:  {capitalize(currentGame.answers[item[1]].answer)}</ListGroup.Item>
                      })}
                  </ListGroup>
                </Col>
              </Row>
              : <></>)
          }
          </Container>
      );
  }

  function renderEndScreen()
  {
      return (
          <Container>
              <Row className="main-klem">
                  <Col xs={6} className="col-xs-9">
                    <h3 style={{color: "#538eb7", fontWeight: "normal"}} align="left">{credits.value} {credits.value === 1 ? "punt": "punten"}</h3>
                  </Col>
                  <Col xs={6} className="col-xs-3">
                      <h3 style={{color: "#538eb7", fontWeight: "normal"}} align="center">{currentGame.game + 1} / {currentGame.sets}</h3>
                  </Col>
              </Row>
              <Row>
                  <Col>
                      <h1 style={{color: "#538eb7", textAlign: 'center', paddingBottom: "5rem"}}>KLEM</h1>
                      <h2 className="klem" style={{color: "#538eb7", fontWeight: "bold", textAlign: 'center'}}>
                          { endScreen.succeeded ? 'Gefeliciteerd, je hebt het spel goed opgelost!' : 'Jammer, volgende keer beter!'}
                      </h2>
                        {currentGame && !endScreen.succeeded && renderEndModal()}
                      <h3 className="klem" style={{color: "#538eb7", textAlign: 'center'}}>
                          Morgen staat er weer een nieuwe KLEM voor je klaar.
                      </h3>
                  </Col>
              </Row>
          </Container>
      );
  }

  function renderGame() {

    let button;

    const variantsCredits = {
      start: {
        scale: 1.5,
        transition: {duration: 0.5}
      },
      end: {
        scale: 1,
        transition: {duration: 0.5}
      }

    };

    const variants = {
      visible: i => ({
        opacity: 1,
        transition: {
          delay: i * 0.2,
        },
      }),
      hidden: i => ({
        opacity: 0,
        transition: {
          delay: i * 0.2,
        }
      })
    }

    const handleClickStart = () => {
        console.log("Click Start");
        setGameState({started: true, ended: false});
    };

    const handleClickHint = () => {
        setShowHints(true);
        setCredits({value: (parseInt(credits.value) - creditsHints), timeStamp: dateNow});
    };
    if (!gameState.started && parseInt(credits.value) > 0)
    {
          button = <Button variant="info" size="lg" onClick={handleClickStart} block>Onthul de vraag</Button>;
    }
    else if (parseInt(credits.value) === 0 && gameState.started)
    {
        button = <h3 align="center" style={{color: "#538eb7"}}>Te weinig punten om te spelen!</h3>;
    }
    else if (gameState.ended)
    {
        setEndScreen({ended: true, succeeded: false})
        button = <></>;
    }

    return (
        <Container>
            <Row className="main-klem">
              <Col xs={9} className="col-xs-9">
                <h3 style={{color: "#538eb7", fontWeight: "normal"}} align="left">spel: {currentGame.game + 1} / {currentGame.sets}</h3>
              </Col>
                <Col xs={3} className="col-xs-3">
                  <motion.h3
                  initial={'end'}
                  animate={resetState ? "start": "end"}
                  variants={variantsCredits}
                  >
                    <h3 style={{color: "#538eb7", fontWeight: "normal"}} align="center">{credits.value} {credits.value === 1 ? "punt": "punten"}</h3>
                  </motion.h3>
                </Col>

            </Row>
            <Row>
                <Col>
                    <h2 className="klem-category">{currentGame.title}</h2>
                    <CountDown timer={timer} fixedTime={fixedTime}/>
                </Col>
            </Row>
            <Row>
                 {
                   currentGame.answers.map((answer, id) => (
                 <motion.p
                   initial={'hidden'}
                 custom={id}
                 animate={resetState ? "hidden": "visible"}
                 variants={variants}>
                 <Answer reset={resetState} key={id} question={currentQuestion} answer={answer}
                 started={(gameState.started)} hint={showHints}
                 onClick={(isRight) => handleAnswer(isRight)}/>
                 </motion.p>
                 ))
               }
            </Row>
            <Row>
                <Col>
                    {((gameState.started) ? <Question question={currentGame.questions[currentQuestion]}/>
                    : <></>)}
                    {button}
                </Col>
            </Row>
            <Row className="special-row">
                <Col xs={12} lg={6}>
                        <Hint started={gameState.started} onClick={handleClickHint} credits={credits}
                              creditsHints={creditsHints}/>
                        <Stuck started={gameState.started} onClick={handleClickStuck} creditsStuck={creditsWrongAnswer} credits={credits}/>
                </Col>
                <Col xs={12} lg={6}>
                    {currentGame && !endScreen.ended && renderEndModal()}
                </Col>
            </Row>
        </Container>
    );
  }

  function renderControls() {
      return (
          <Col>
              <Form onSubmit={handleFormSubmit}>
                  <Form.Group controlId="credits">
                      <Form.Label column={10}>Punten</Form.Label>
                      <Form.Control name="credits" onChange={handleChange} placeholder={credits.value}/>
                  </Form.Group>
                  <Button type="submit" variant="primary">Opslaan</Button>
              </Form>
          </Col>
      );
  }

  return (
      <Container style={{backgroundColor: '#cfecf1', boxShadow: "3px 3px 8px #ccc"}}>
          <Row>
              <Col>
                {renderMain()}
              </Col>
          </Row>
          <Row className="justify-content-md-center">
              <Col>
                  {currentGame && !endScreen.ended && renderGame()}
                  {endScreen.ended && renderEndScreen()}
              </Col>

          </Row>
          <Row>
              <Col>
                <br/>
              </Col>
          </Row>
      </Container>
  );
}

export default App;
