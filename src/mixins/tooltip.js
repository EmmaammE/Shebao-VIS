const tooltip = {
  data() {
    return {
      // 是否显示tooltip
      isShowing: false,
      tipData: {
        money: 0,
        num: 0,
      },
      tipPos: {
        left: 0,
        top: 0,
        x: 0,
      },
      bbox: {},
    };
  },

  methods: {
    setbbox(str) {
      this.bbox = this.$refs[str].getBoundingClientRect();
    },

    updateTooltip(isShowing, tipPos, tipData) {
      this.isShowing = isShowing;
      this.tipPos = {
        left: tipPos.left - this.bbox.x,
        top: tipPos.top - this.bbox.y,
        x: tipPos.x,
      };
      this.tipData = tipData;
    },
  },
};

export default tooltip;
