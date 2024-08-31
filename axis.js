import bs from "binary-search";

import { cutil } from "@ghasemkiani/base";
import { Obj } from "@ghasemkiani/base";

class Axis extends Obj {
  static {
    cutil.extend(this.prototype, {
      distance: (a, b) => a - b,
      data: null,
    });
  }
  sort() {
    let axis = this;
    let { data, distance } = axis;
    data.sort(([a], [b]) => distance(a, b));
  }
  get(k) {
    let axis = this;
    let { data, distance } = axis;
    if (!data || data.length === 0) {
      throw new Error("Axis has no data.");
    }
    let index = bs(data, [k], ([a], [b]) => distance(a, b));
    let value;
    if (index >= 0) {
      value = data[index][1];
    } else {
      index = -index - 1;
      if (index === 0) {
        value = data[0][1];
      } else if (index === data.length) {
        value = data[data.length - 1][1];
      } else {
        let [ka, va] = data[index - 1];
        let [kb, vb] = data[index];
        value =
          (va * distance(kb, k) + vb * distance(k, ka)) / distance(kb, ka);
      }
    }
    return value;
  }
}

export { Axis };
