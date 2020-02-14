const state = () => {
  return {
      user: null
  }
};

const getters = {
    user: state => state.user
};

const actions = {
  async setUser ({commit}, data) {
    commit('SET_USER', data)
  }
};

const mutations = {
    SET_USER: (state, user) => {
      state.user = user;
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
