import './App.css'

import React, { Component } from 'react'

import api from './api'
import { setupWebsocket } from './ws'

// disable context menu
window.addEventListener("contextmenu", function(e) { e.preventDefault(); })

const Beverage = ({id, name, active, available, onClick})=> {
  const classes = 'bev' + (available ? '' : ' unavail')
  + (active ? ' active' : '')
  const handleClick = ()=> onClick && onClick(id)
  return (
    <div className={classes}>
      <div className="cap" onTouchStart={handleClick} onClick={handleClick}>
        <span>{name}</span>
      </div>
    </div>
  )
}

class Beverages extends Component {
  state = { active: false }

  handleClick = (id)=> {
    const { onClick } = this.props
    this.setState({ active: id })
    onClick(id)
  }

  render() {
    const { beverages } = this.props

    return (
      <div className="beverages">
        { beverages.map( (bevWrap, i)=> {
            const { available, beverage: { id, name } } = bevWrap

            const canClick = bevWrap.visible && bevWrap.available
            const handleClick = canClick && this.handleClick
            const active = this.state.active === id

            return (
              <Beverage
                id={id}
                name={name}
                active={active}
                available={available}
                onClick={handleClick}
                key={i} />
            )
          })
        }
      </div>
    )
  }
}

class App extends Component {

  state = { beverages: [], selected: false }

  componentWillMount() {
    setupWebsocket({ onBeverageChanged: this.refreshBeverages })
    this.refreshBeverages()
  }

  refreshBeverages = ()=> {
    api.fetchBeverages().then(this.setBeverages)
  }

  setBeverages = (beverages)=> {
    if (beverages) {
      this.setState({ beverages: beverages.sort((b1, b2) => b1.beverage.name.localeCompare(b2.beverage.name)) })
    }
  }

  onClick = (id)=> {
    this.setState({ selected: id })
    api.setBeverage(id)
  }

  startPour = ()=> api.startPour()

  stopPour = ()=> api.stopPour()

  render() {
    const { beverages, selected } = this.state

    const showBeverages = beverages.filter( (f)=> f.visible )

    return (
      <div className="layout">
        <Beverages beverages={showBeverages} onClick={this.onClick}/>
        { selected && <div className="pour">
          <button onTouchStart={this.startPour} onTouchEnd={this.stopPour}>Hold to Pour</button>
        </div> }
      </div>
    );
  }
}

export default App
