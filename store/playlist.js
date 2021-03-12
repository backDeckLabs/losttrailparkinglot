export const state = () => ({
  tracks: [],
  activeTrackIndex: null,
  playing: false,
  shuffle: true,
  shuffleOrder: [],
  showPlaylist: false
});

export const getters = {
  tracks: (state) => {
    return state.tracks;
  },
  shuffle: (state) => {
    return state.shuffle;
  },
  shuffleOrder: (state) => {
    return state.shuffleOrder
  },
  activeTrackIndex: (state) => {
    return state.activeTrackIndex;
  },
  activeTrack: (state) => {
    return state.tracks[state.activeTrackIndex];
  },
  activeShuffleIndex: (state) => {
    return state.shuffleOrder.findIndex(item => item === state.activeTrackIndex);
  },
  isPlaying: (state) => {
    return state.playing;
  },
  showPlaylist: (state) => {
    return state.showPlaylist;
  }
};

export const mutations = {
  SET_TRACKS(state, val) {
    state.tracks = val;
  },
  SET_TRACK(state, obj) {
    state.tracks[obj.index] = {...obj.data};
    state.tracks = [...state.tracks];
  },
  SET_ACTIVE_TRACK_INDEX(state, val) {
    state.activeTrackIndex = val;
  },
  SET_PLAYING(state, val) {
    state.playing = val;
  },
  SET_SHUFFLE(state, val) {
    state.shuffle = val;
  },
  SET_SHUFFLE_ORDER(state, val) {
    state.shuffleOrder = val;
  },
  SET_SHOW_PLAYLIST(state, val) {
    state.showPlaylist = val;
  }
};

export const actions = {
  setTracks({commit}, value) {
    commit('SET_TRACKS', value);
  },
  setTrack({commit}, obj) {
    commit('SET_TRACK', obj);
  },
  setActiveTrackIndex({commit}, val) {
    commit('SET_ACTIVE_TRACK_INDEX', val);
  },
  setPlaying({commit}, val) {
    commit('SET_PLAYING', val);
  },
  toggleShuffle({state, commit}) {
    commit('SET_SHUFFLE', !state.shuffle);
  },
  setShuffleOrder({state, commit}) {
    let playlistArr = state.tracks.map((item, index) => index);
    let currentIndex = playlistArr.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = playlistArr[currentIndex];
      playlistArr[currentIndex] = playlistArr[randomIndex];
      playlistArr[randomIndex] = temporaryValue;
    }

    commit('SET_SHUFFLE_ORDER', playlistArr);
  },
  toggleShowPlaylist({state, commit}) {
    commit('SET_SHOW_PLAYLIST', !state.showPlaylist);
  },
  toggleTrack() {
    // console.log('toggle music')
  },
  nextTrack() {
    // console.log('next track')
  },
  prevTrack() {
    // console.log('prev track')
  }
};
