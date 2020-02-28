import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as Redux from "redux";
import * as ReactRedux from "react-redux";

const PAUSE = "PAUSE";
const PLAY = "PLAY";
const RESET = "RESET";
const INC_BREAK_LEN = "INC_BREAK_LEN";
const DEC_BREAK_LEN = "DEC_BREAK_LEN";
const INC_SESSION_LEN = "INC_SESSION_LEN";
const DEC_SESSION_LEN = "DEC_SESSION_LEN";
const DEC_TIME = "DEC_TIME";
const SESSION = "SESSION";
const BREAK = "BREAK";
const BEGIN = "BEGIN";

function clockify(timer) {
  let minutes = Math.floor(timer / 60);
  let seconds = timer - minutes * 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return minutes + ":" + seconds;
}

function reducer(
  state = {
    breakLength: 5,
    sessionLength: 25,
    clock: 1500,
    timerRunning: false,
    timerType: SESSION
  },
  action
) {
  switch (action.type) {
    case PAUSE:
      return {
        breakLength: state.breakLength,
        sessionLength: state.sessionLength,
        clock: state.clock,
        timerRunning: false,
        timerType: state.timerType
      };
    case PLAY:
      return {
        breakLength: state.breakLength,
        sessionLength: state.sessionLength,
        clock: state.clock,
        timerRunning: true,
        timerType: state.timerType
      };
    case RESET:
      return {
        breakLength: 5,
        sessionLength: 25,
        clock: 1500,
        timerRunning: false,
        timerType: SESSION
      };
    case INC_BREAK_LEN:
      if (!state.timerRunning)
        return {
          breakLength: state.breakLength + 1,
          sessionLength: state.sessionLength,
          clock: state.clock,
          timerRunning: state.timerRunning,
          timerType: state.timerType
        };
      else return state;
    case DEC_BREAK_LEN:
      if (!state.timerRunning)
        return {
          breakLength: state.breakLength - 1,
          sessionLength: state.sessionLength,
          clock: state.clock,
          timerRunning: state.timerRunning,
          timerType: state.timerType
        };
      else return state;
    case INC_SESSION_LEN:
      if (!state.timerRunning)
        return {
          breakLength: state.breakLength,
          sessionLength: state.sessionLength + 1,
          clock: (state.sessionLength + 1) * 60,
          timerRunning: state.timerRunning,
          timerType: state.timerType
        };
      else return state;
    case DEC_SESSION_LEN:
      if (!state.timerRunning)
        return {
          breakLength: state.breakLength,
          sessionLength: state.sessionLength - 1,
          clock: (state.sessionLength - 1) * 60,
          timerRunning: state.timerRunning,
          timerType: state.timerType
        };
      else return state;
    case DEC_TIME:
      if (state.timerRunning) {
        if (state.clock > 0) {
          return {
            breakLength: state.breakLength,
            sessionLength: state.sessionLength,
            clock: state.clock - 1,
            timerRunning: state.timerRunning,
            timerType: state.timerType
          };
        } else if (state.timerType === SESSION) {
          return {
            breakLength: state.breakLength,
            sessionLength: state.sessionLength,
            clock: state.breakLength * 60,
            timerRunning: state.timerRunning,
            timerType: BREAK
          };
        } else {
          return {
            breakLength: state.breakLength,
            sessionLength: state.sessionLength,
            clock: state.sessionLength * 60,
            timerRunning: state.timerRunning,
            timerType: SESSION
          };
        }
      } else return state;
    case BEGIN:
      return {
        breakLength: state.breakLength,
        sessionLength: state.sessionLength,
        clock: state.sessionLength,
        timerRunning: state.timerRunning,
        timerType: SESSION
      };
    default:
      return state;
  }
}

function mapStateToProps(state) {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    pauseTimer: () => {
      dispatch({
        type: PAUSE
      });
    },
    playTimer: () => {
      dispatch({
        type: PLAY
      });
    },
    resetTimer: () => {
      dispatch({
        type: RESET
      });
    },
    incrementBreak: () => {
      dispatch({
        type: INC_BREAK_LEN
      });
    },
    decrementBreak: () => {
      dispatch({
        type: DEC_BREAK_LEN
      });
    },
    incrementSession: () => {
      dispatch({
        type: INC_SESSION_LEN
      });
    },
    decrementSession: () => {
      dispatch({
        type: DEC_SESSION_LEN
      });
    },
    run: () => {
      dispatch({
        type: DEC_TIME
      });
    }
  };
};

class PomodoroClock extends Component {
  constructor(props) {
    super(props);
    this.handlePlayPause = this.handlePlayPause.bind(this);
  }
  handlePlayPause() {
    if (!this.props.timerRunning) {
      this.beginCountdown();
      this.props.playTimer();
    } else {
      this.props.pauseTimer();
      this.props.intervalID && this.state.intervalID.cancel();
    }
  }
  beginCountdown() {}
  render() {
    return (
      <div>
        <h1>Pomodoro Clock</h1>
        <label for="break-length">
          Break Length <button onClick={this.props.incrementBreak}>+</button>
          <span>{this.props.breakLength}</span>
          <button onClick={this.props.decrementBreak}>-</button>
        </label>
        <label for="session-length">
          Session Length{" "}
          <button onClick={this.props.incrementSession}>+</button>
          <span>{this.props.sessionLength}</span>
          <button onClick={this.props.decrementSession}>-</button>
        </label>
        <label for="session">
          {this.props.timerType === SESSION ? "Session" : "Break"}
          <span>{clockify(this.props.clock)}</span>
          <button onClick={this.handlePlayPause}>Play/Pause</button>
          <button onClick={this.props.resetTimer}>Reset</button>
        </label>
      </div>
    );
  }
}

const store = Redux.createStore(reducer);
const Provider = ReactRedux.Provider;

const Container = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(PomodoroClock);

class Wrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

ReactDOM.render(<Wrapper />, document.getElementById("root"));
