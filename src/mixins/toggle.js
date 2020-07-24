// 切换是否显示

const toggle = {
  data() {
    return {
      isShowing: false,
    };
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    },

    toShow() {
      this.isShowing = true;
    },

    toHide() {
      this.isShowing = false;
    },
  },
};

export default toggle;
