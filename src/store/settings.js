export default {
  namespaced: true,
  state: {
    themes: [
      {
        name: 'Fire',
        component: 'fire',
        fullscreen: false,
        color: {
          active: '#fa076c',
          background: '#13111c'
        },
      },
      {
        name: 'Malevich',
        component: 'malevich',
        fullscreen: false,
        color: {
          active: '#F690FF',
          background: '#fff'
        },
      },
      {
        name: 'Polygon',
        component: 'polygonComponent',
        fullscreen: false,
        color: {
          active: '#f7bb3b',
          background: '#fff'
        },
      },
      {
        name: 'Osmos',
        component: 'osmos',
        fullscreen: true,
        color: {
          active: '#e13571',
          background: '#1a0532'
        },
      },
      {
        name: 'Space',
        component: 'space',
        fullscreen: true,
        color: {
          active: '#04ded4',
          background: '#19102e'
        },
      },
      {
        name: 'Mars',
        component: 'mars',
        fullscreen: true,
        color: {
          active: '#FF3333',
          background: '#100e18'
        },
      },
      {
        name: 'Time',
        component: 'timeComponent',
        fullscreen: false,
        color: {
          active: '#91e60a',
          background: '#13111c'
        },
      },
      {
        name: 'Sahara',
        component: 'sahara',
        fullscreen: true,
        color: {
          active: '#b2299b',
          background: '#230C54'
        },
      },
    ],
    language: '',
    languages: [],
    defaultColor: '#6BBBED',
    loginPosition: 'bottom',
    currentTheme: 'Fire',
    username: lightdm.users[0].username,
    users: lightdm.users,
    desktop: lightdm.sessions[0].name,
    desktops: lightdm.sessions,
    version: '1.0.4'
  },
  getters: {
    getMainSettings: (state) => {
      const { language, loginPosition, currentTheme, username, desktop, version, defaultColor } = state
      return { language, loginPosition, currentTheme, username, desktop, version, defaultColor }
    },
    getAvatar: (state, getters) => image => {
      return image || 'user';
    },
    getImage: (state) => {
      const match = state.currentTheme.match(/^image-(.{1,})/)
      return match ? match[1] : false
    },
    getCurrentUser: (state) => {
      return state.users.find(({ username }) => username === state.username)
    },
    getCurrentDesktop: (state) => {
      return state.desktops.find(({ name }) => name === state.desktop)
    },
    getCurrentTheme: (state, getters) => {
      return getters.getImage ?
        {
          fullscreen: true,
          src: getters.getImage,
          color: { active: state.defaultColor, background: '#1a0532' }
        } :
        state.themes.find(({ name }) => name === state.currentTheme)
    }
  },
  mutations: {
    SET_SETTIGNS_STATE(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    async changeTheme({ state, getters, dispatch }, theme) {
      const isExistTheme = state.themes.find(({ name }) => name === theme.name)
      const finalTheme = isExistTheme ? theme.name || 'image-' + theme : state.themes[0].name

      await dispatch('changeSettings', { key: 'currentTheme', value: finalTheme })

      const { color } = getters.getCurrentTheme

      document.documentElement.style
      .setProperty('--color-active', color.active);
      document.documentElement.style
        .setProperty('--color-bg', color.background);
    },
    changeLanguage({ commit, getters }, { key, value }) {
      key.$i18n.locale = value
      commit('SET_SETTIGNS_STATE', { key: 'language', value })
      localStorage.setItem('settings', JSON.stringify(getters.getMainSettings))
    },
    changeSettings({ getters, commit }, changeObject) {
      commit('SET_SETTIGNS_STATE', changeObject)
      localStorage.setItem('settings', JSON.stringify(getters.getMainSettings))
    },
    updatePosition({ dispatch }, value) {
      dispatch('page/closeActiveBlock', { isAll: true }, { root: true })
      setTimeout(() => {
        dispatch('changeSettings', { key: 'loginPosition', value })
        dispatch('page/openActiveBlock', { id: 'login' }, { root: true })
      }, 1000)
    },
    setUpSettings({ state, getters, dispatch }) {
      let local = JSON.parse(localStorage.getItem('settings'))

      if (local) {
        if (local.version !== state.version) {
          local = getters.getMainSettings
          localStorage.setItem('settings', JSON.stringify(local));
        }

        dispatch('changeTheme', { name: local.currentTheme })

        let isExistDE = lightdm.sessions.find(item => item.name === local.desktop)

        if (!isExistDE) {
          local.desktop = lightdm.sessions[0].name
        }

        let isExistUser = lightdm.users.filter(item => item.username === local.username);
        
        if (!isExistUser) {
          local.user = lightdm.users[0].username
        }

        dispatch('changeSettings', { key: 'loginPosition', value: local.loginPosition })
        dispatch('changeSettings', { key: 'desktop', value: local.desktop })
        dispatch('changeSettings', { key: 'user', value: local.user })
      } else {
        localStorage.setItem('settings', JSON.stringify(getters.getMainSettings))
        dispatch('setUpSettings')
      }
    }
  }
}
