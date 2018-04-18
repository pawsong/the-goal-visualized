import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const NUMBER_OF_WALKERS = 10
const INTERVAL = 100

function walk(cur, prev, { blockingRate, speed }) {
  const blocked = Math.random() > (1 - blockingRate / 100)
  const progress = blocked ? 0 : speed
  const nextPositionWithoutConstarint = cur.position + progress
  const position = prev
    ? Math.min(prev.position, nextPositionWithoutConstarint)
    : nextPositionWithoutConstarint

  return {
    ...cur,
    blocked,
    position,
  }
}

function generateWalkers(numberOfWalkers) {
  const ret = []
  for (let i = 0; i < numberOfWalkers; ++i) {
    ret.push({
      name: `Walker ${i + 1}`,
      blocked: false,
      position: 0,
    })
  }
  return ret
}

function walkAll(walkers, options) {
  return walkers.reduce((prev, cur, index) => {
    return [
      ...prev,
      walk(cur, prev[index - 1], options),
    ]
  }, [])
}

const initialState = {
  walkers: generateWalkers(NUMBER_OF_WALKERS),
  step: 0,
  interval: 1000,
  blockingRate: 10,
  speed: 2,
}

class App extends Component {
  state = initialState

  componentDidMount() {
    const timeout = () => {
      setTimeout(() => {
        this.setState({
          walkers: walkAll(this.state.walkers, {
            blockingRate: this.state.blockingRate,
            speed: this.state.speed,
          }),
          step: this.state.step + 1,
        })
        timeout()
      }, this.state.interval)
    }
    timeout()
  }

  render() {
    const minPosition =
      this.state.walkers[NUMBER_OF_WALKERS - 1].position

    return (
      <div>
        <h1>The goal, visualized</h1>
        <div>
          {this.state.step} step elapsed
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block', margin: 5 }}>
            <span>Blocking rate </span>
            <input type="number"
              value={this.state.blockingRate}
              onChange={e => this.setState({
                blockingRate: parseFloat(e.currentTarget.value),
              })}
            />
            <em> %</em>
          </div>
          <div style={{ display: 'inline-block', margin: 5 }}>
            <span>Speed </span>
            <input type="number"
              value={this.state.speed}
              onChange={e => this.setState({
                speed: parseFloat(e.currentTarget.value),
              })}
            />
            <em> m/step</em>
          </div>
          <div style={{ display: 'inline-block', margin: 5 }}>
            <span>Interval </span>
            <input type="number"
              value={this.state.interval}
              onChange={e => this.setState({
                interval: parseFloat(e.currentTarget.value),
              })}
            />
            <em> ms/step</em>
          </div>
          <div style={{ display: 'inline-block', margin: 5 }}>
            <button
              onClick={() => this.setState(initialState)}
            >
              Reset
            </button>
          </div>
        </div>
        <hr />
        <table style={{ textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ width: 200 }}>Name</th>
              <th style={{ width: 200 }}>Postion (m)</th>
              <th style={{ width: 200 }}>Dist. from the last (m)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.walkers.map(walker => (
              <tr key={walker.name}>
                <td>{walker.name}</td>
                <td>{walker.position}</td>
                <td>{walker.position - minPosition}</td>
                <td>{walker.blocked ? 'blocked' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div style={{ position: 'relative', width: '100%' }}>
          {this.state.walkers.map((walker, index) => (
            <div
              key={walker.name}
              style={{
                position: 'absolute',
                right: (walker.position - minPosition) * 20,
                top: index * 20,
                backgroundColor: walker.blocked ? 'yellow' : null,
                whiteSpace: 'nowrap',
              }}
            >
              <b>{walker.name}</b> <em>+{walker.position - minPosition} m</em>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
