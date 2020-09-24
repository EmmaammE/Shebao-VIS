// time-picker组件搭配使用，用在父组件

const timePicker = {
  data() {
    return {
      dateStart: new Date('2019-01-01').toISOString().substr(0, 10),
      dateEnd: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
    };
  },
  methods: {
    updateMenu1(value) {
      this.menu1 = value;
    },

    updateMenu2(value) {
      this.menu2 = value;
    },

    updateDateStart(value) {
      this.dateStart = value;
    },

    updateDateEnd(value) {
      this.dateEnd = value;
    },
  },
};

export default timePicker;
