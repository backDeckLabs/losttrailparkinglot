export const state = () => ({
  tracks: [],
  activeTrackIndex: null,
  playing: false,
  shuffle: true
});

export const getters = {
  tracks: (state) => {
    return state.tracks;
  },
  activeTrackIndex: (state) => {
    return state.activeTrackIndex;
  },
  activeTrack: (state) => {
    return state.tracks[state.activeTrackIndex];
  },
  isPlaying: (state) => {
    return state.playing;
  },
  shuffle: (state) => {
    return state.shuffle;
  }
};

export const mutations = {
  SET_TRACKS(state, val) {
    state.tracks = val;
  },
  SET_TRACK(state, obj) {
    state.tracks[obj.index] = {...obj.data};
    state.tracks = {...state.tracks};
  },
  SET_ACTIVE_TRACK_INDEX(state, val) {
    state.activeTrackIndex = val;
  },
  SET_PLAYING(state, val) {
    state.playing = val;
  },
  SET_SHUFFLE(state, val) {
    state.shuffle = val;
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
