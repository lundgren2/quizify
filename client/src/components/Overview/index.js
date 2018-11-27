import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getPlaylistAudioInfo } from '../../utils/service';
import { Box } from '@smooth-ui/core-em';
import Emoji from '../Emoji';
import Button, { StatusButton } from '../ui/Button';
import Container from '../ui/Container';
import styles from '../../styles';

import { MOOD_HAPPY, MOOD_SAD, MOOD_ANGRY, MOOD_PARTY } from './mood';
import { STATUS_1, STATUS_2, STATUS_3 } from './status';

// TODO: Refactor this chaos Component
export default class Overview extends Component {
  state = {
    playlist: null,
    showChat: true,
    showOverview: false,
    playlistAttributes: null,
    text: '',
    firstTime: true,
    token: localStorage.getItem('accessToken'),
  };

  componentDidMount() {
    const firstTime = this.props.location.state
      ? this.props.location.state.firstTime
      : true;
    if (firstTime) {
      this.state.firstTime &&
        setTimeout(() => {
          this.setState({
            showChat: true,
            firstTime: false,
          });
        }, 2500);

      this.state.firstTime &&
        setTimeout(() => {
          this.setState({
            showOverview: true,
          });
        }, 3000);
    } else {
      this.setState({
        showChat: false,
        showOverview: true,
      });
    }

    let playlist = null;
    let token = null;
    if (this.props.location.state) {
      playlist = this.props.location.state.playlist;
      token = this.props.location.state.token;
    }
    getPlaylistAudioInfo(playlist).then(playlistAttributes => {
      this.setState({
        playlistAttributes: playlistAttributes,
        playlist: playlist,
      });
    });
  }

  getMood = () => {
    const valence = this.state.playlistAttributes.valence;
    const energy = this.state.playlistAttributes.energy;
    if (valence >= 0.5 && energy >= 0.5) {
      return MOOD_PARTY;
    } else if (valence >= 0.5 && energy < 0.5) {
      return MOOD_HAPPY;
    } else if (valence < 0.5 && energy < 0.5) {
      return MOOD_SAD;
    } else {
      return MOOD_ANGRY;
    }
  };

  linkToEmotion = (emoji, color) => {
    this.props.history.push({
      pathname: '/emotion',
      state: {
        playlist: this.state.playlist,
        token: this.state.token,
        emoji: emoji,
        color: color,
        text: this.state.text,
      },
    });
  };

  render() {
    const { playlist, playlistAttributes, showChat, showOverview } = this.state;
    const style = {
      chatText: {
        transition: 'opacity 1s ease-in-out',
        opacity: showChat ? 1 : 0,
        display: showOverview ? 'none' : 'block',
      },
      overview: {
        transition: 'opacity 0.5s ease-in-out',
        opacity: showOverview ? 1 : 0,
        textAlign: 'left',
      },
    };
    const renderChat = () => (
      <div style={style.chatText}>
        <h2>
          Oh nice! <Emoji symbol="🥳" />
        </h2>
        <p>
          So you feel like your playlist
          <br />{' '}
          <b style={{ fontSize: 32 }}>{playlist && `${playlist.name} ?`}</b>‍‍‍‍
        </p>
      </div>
    );

    let emoji = '🤑';
    let color = 'green';
    if (playlistAttributes) {
      const mood = this.getMood();
      emoji = mood.EMOJI;
      color = mood.COLOR;
    }

    const renderOverview = () => {
      const playlistName = playlist && playlist.name;
      const playlistImg = playlist && playlist.images[0].url;
      const playlistAttr = playlistAttributes ? playlistAttributes : {};

      return (
        <div style={style.overview}>
          <div
            style={{
              color: styles.colors.gray,
              fontSize: 28,
              marginTop: 8,
              paddingBottom: 4,
              borderBottom: '1px solid #ccc',
              width: '100%',
            }}
          >
            Playlist information
          </div>
          <h3 style={{ margin: '14px 0' }}>{playlistName}</h3>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            backgroundColor="#eee"
            alignItems="center"
            borderRadius={12}
            p={1}
            maxWidth={'100%'}
          >
            <Box borderRadius={12}>
              <img
                src={playlistImg}
                alt={playlistName}
                height="120"
                style={{ borderRadius: 8 }}
              />
            </Box>
            <Box width={'100%'} px={2}>
              <ul style={{ fontSize: 16, margin: '0px 0' }}>
                <li>
                  <b>Tempo:</b> {Math.floor(playlistAttr.tempo)}bpm
                </li>
                <li>
                  <b>Energy:</b> {Math.floor(playlistAttr.energy * 100)} %
                </li>
                <li>
                  <b>Danceability:</b>{' '}
                  {Math.floor(playlistAttr.danceability * 100)}%
                </li>
                <li
                  style={{
                    color: '#888',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    marginTop: 4,
                  }}
                >
                  Specs
                </li>
              </ul>
              {playlistAttr.tempo > 115 ? (
                <Emoji symbol="🏎💨" />
              ) : (
                <Emoji symbol="👵" />
              )}
              {playlistAttr.energy > 0.7 ? (
                <Emoji symbol="🔥" />
              ) : (
                <Emoji symbol="☕️" />
              )}
            </Box>
          </Box>
          <div style={{ textAlign: 'center', positin: 'relative' }}>
            <b style={{ fontSize: 18 }}>
              Your emoji today based on your playlist:
              <br />
            </b>
            <span style={{ fontSize: 44 }}>
              <Emoji symbol={emoji} />
            </span>
            <br />
            <b
              style={{
                color: '#555',
                fontSize: 12,
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              Select your status
            </b>
            <br />
            <br />
          </div>
          <div onClick={() => this.setState({ text: STATUS_1 })}>
            <StatusButton>{STATUS_1}</StatusButton>
          </div>
          <div onClick={() => this.setState({ text: STATUS_2 })}>
            <StatusButton>{STATUS_2}</StatusButton>
          </div>
          <div onClick={() => this.setState({ text: STATUS_3 })}>
            <StatusButton>{STATUS_3}</StatusButton>
          </div>
          <div onClick={() => this.linkToEmotion(emoji, color)}>
            <Button>Find friends</Button>
          </div>
          <br />
          <Link
            to={{
              pathname: '/',
            }}
          >
            <span
              style={{
                color: '#555',
                fontSize: 12,
                padding: 12,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Change playlist
            </span>
            <br />
          </Link>
        </div>
      );
    };

    return (
      <Container>
        {renderChat()}
        {renderOverview()}
      </Container>
    );
  }
}
