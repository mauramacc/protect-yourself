import React, { Component } from 'react';
import './App.css';

import intro from './data/intro.json';
import google from './data/google.json'
import whois from './data/whois.json'
import facebook from './data/facebook.json'
import twitter from './data/twitter.json'
import instagram from './data/instagram.json'
import other_social_media from './data/other_social_media.json'
import tor from './data/tor.json'
import vpn from './data/vpn.json'
import easy_data_remove from './data/easy_data_remove.json'
import advanced_data_remove from './data/advanced_data_remove.json'

import Step from './action/Step.js';
import Navigation from './Navigation.js';

const data = {
  intro,
  google,
  whois,
  facebook,
  twitter,
  instagram,
  other_social_media,
  tor,
  vpn,
  easy_data_remove,
  advanced_data_remove,
};

class App extends Component {

  constructor(props) {
    super(props);

    this.sound = new Audio("tada.mp3");
    this.state = Object.assign({
      history: ['start'],
      goal: 'intro',
      completedGoals: {},
    }, localStorage.state ? JSON.parse(localStorage.state) : {});
  }

  componentDidUpdate(prevProps, prevState) {
    localStorage.state = JSON.stringify(this.state);
  }

  updateLocation = (goal, steps) => {
    this.setState({
      goal: goal,
      history: steps,
    }, () => {
      var stepAction = this.getStepData().action;
      if (stepAction) {
        this.compleateAction(stepAction);
      }
    })
  }

  compleateAction(action) {
    switch(action.type) {
      case 'award':
        var newState = {};
        newState[this.state.goal] = true
        this.sound.currentTime = 0
        this.sound.play();
        this.setState({
          completedGoals: Object.assign(newState, this.state.completedGoals)
        });
        break;
      default:
    }
  }

  startGoal = (goal) => {
    this.updateLocation(goal, ['start'])
  }

  updateStep = (step) => {
    this.updateLocation(this.state.goal, [step, ...this.state.history])
  }

  getStepData = () => {
    const {goal, history} = this.state
    return data[goal][history[0]]
  }

  restart = () => {
    this.updateLocation('intro', ['mainMenu'])
  }

  back = () => {
    this.setState({
      history: this.state.history.slice(1)
    })
  }

  render() {
    const step_data = this.getStepData();
    return <div className="App">
        <h1>{(step_data && step_data.title) || this.state.goal}</h1>
        <Step
            onNextStep={this.updateStep}
            onStartGoal={this.startGoal}
            onRestart={this.restart}
            data={step_data}
            goal={this.state.goal}
            completedGoals={this.state.completedGoals} />

        <Navigation
          showBack={this.state.goal !== "intro" && this.state.history.length > 1}
          onBack={this.back}
          showRestart={this.state.goal !== "intro"}
          onRestart={this.restart}
        />
      </div>
  }
}

export default App;
