import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LDClient from 'ldclient-js';


const isNewer = (a, b) => Date.parse(a.added) < Date.parse(b.added)

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedSortOrder: null,
      songs: [
        { name: 'Album: Cruel Summer by Taylor Swift : 2019-08-05 ', added: '2019-08-05' },
        { name: 'Album: Flowers by Mily Cirus : 2023-01-13 ', added: '2023-01-13' },
        { name: 'Album: Kill Bill by SZA : 2022-12-09 ', added: '2022-12-09' },
        { name: 'Album: Vampire by Olivia Rodrigo : 2023-06-30 ', added: '2023-06-30' },
      ]
    }
  }
  componentDidMount() {
    const user = {
      key: 'shrihan'
    }
    this.ldclient = LDClient.initialize('67630f750c70fc09b554323a', user)
    this.ldclient.on('ready', this.onLaunchDarklyUpdated.bind(this))
    this.ldclient.on('change', this.onLaunchDarklyUpdated.bind(this))


     // Set up the evaluation context. This context should appear on your
    // LaunchDarkly contexts dashboard soon after you run the demo.
    const context: LDClient.LDContext = {
      kind: 'user',
      key: 'context-key-1',
      email: 'munic@gmail.com',
  
    }
  }
  onLaunchDarklyUpdated() {
    this.setState({
      featureFlags: {
        defaultSortingIsAdded: this.ldclient.variation('playlist-default-sorting-is-added')
      }
    })
  }
  
    
  render() {
    if (!this.state.featureFlags) {
      return <div className="App">Loading....</div>
    }

    let sorter
    if (this.state.selectedSortOrder) {
      if (this.state.selectedSortOrder === 'added') {
        sorter = isNewer
      } else if (this.state.selectedSortOrder === 'natural') {
        sorter = undefined
      }
    } else {
      if (this.state.featureFlags.defaultSortingIsAdded) {
        sorter = isNewer
      } else {
        sorter = undefined
      }
    }
    return (
      <div className="App">
        <div
            style={{ fontWeight: sorter === undefined ? 'bold' : 'normal'}}
            onClick={() => this.setState({ selectedSortOrder: 'natural' })}>Top Playlist - Random</div>
        <div
          style={{ fontWeight: sorter === isNewer ? 'bold' : 'normal'}}
          onClick={() => this.setState({ selectedSortOrder: 'added' })}>Top Playlist - Sorted by Release Date</div>
        <ul>
          {this.state.songs.slice().sort(sorter).map(song =>
             <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
