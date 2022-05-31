import { defineStore } from "pinia";

export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    counter: 0,
  }),
  getters: {
    oddOrEven: (state: any) => {
      if (state.counter % 2 === 0) {
        return "even";
      } else {
        return "odd";
      }
    },
  },
  actions: {
    increaseCounter() {
      this.counter++;
    },
    decreaseCounter() {
      if (this.counter > 0) {
        this.counter--;
      } else {
        window.alert("Counter's value has to be above 0");
      }
    },
  },
});
