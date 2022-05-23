import { removeItems } from ".pnpm/registry.npmmirror.com+@pixi+utils@6.3.2_cb3fd473ba582823f2dfd3d53c57a4ca/node_modules/@pixi/utils";
import { playsMap } from "./playMap";
import { priceMap } from "./priceMap";

const format = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
}).format;
export class Troupe {
  plays() {
    const temp = playsMap;
    for (const key in temp) {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        temp[key].price = priceMap[temp[key].type];
      }
    }
    return temp;
  }

  order(customerName, performances) {
    const plays = performances.reduce((result, key) => {
      result.push({ ...key, price: priceMap[key.type] });
      return result;
    }, []);
    return {
      customer: customerName,
      performances: plays,
    };
  }

  statement(customer, performances) {
    let result = {
      customer,
      performances: [],
      totalPrice: 0,
      volumeCredits: 0,
    };

    for (const item of performances) {
      const play = playsMap[item.play].name;
      const tmp = {
        play,
        money: Troupe.amountFor(item),
        seats: item.audienceAount,
      };
      result.performances.push(tmp);
      result.totalPrice += tmp.money;
      result.volumeCredits += Troupe.volumeCreditsFor(item);
    }
    return Troupe.printString(result);
  }

  /**
   * 每出剧的观众量积分
   * 制定观众量积分的规格
   * @param performance
   * @returns
   */
  static volumeCreditsFor(performance) {
    let volumeCredits = Math.max(performance.audienceAount - 30, 0);
    if (performance.type === "comedy") {
      volumeCredits += Math.floor(performance.audienceAount / 5);
    }
    return volumeCredits;
  }

  /**
   * 剧目金额
   * 制定定价规格
   * @param performance
   * @returns amount
   */
  static amountFor(performance) {
    let amount = 0;
    if (performance.type === "tragedy") {
      if (performance.audienceAount > 30) {
        amount += performance.price + 1000 * (performance.audienceAount - 30);
      }
    } else if (performance.type === "comedy") {
      if (performance.audienceAount > 20) {
        amount += performance.price + 10000 + 500 * (performance.audienceAount - 20);
      }
      amount += 300 * performance.audienceAount;
    } else {
      throw new Error(`unknow type: ${performance.type}`);
    }
    return amount;
  }

  /**
   * 输出账单详情 字符串格式
   * @param billingDetail
   * @returns {String}
   */
  static printString(billingDetail) {
    let result = `Statement for ${billingDetail.customer}\n`;

    // performances: [ { play: xxx, money： $xxx.00, seats: xx }, { ... }, {...}]
    billingDetail.performances.forEach((item) => {
      result += `${item.play}: ${format(item.money / 100)} (${item.seats} seats)\n`;
    });

    // totalPrice: xxx, volumeCredits: xx
    result += `Amount owed is ${format(billingDetail.totalPrice / 100)}\nYou earned ${
      billingDetail.volumeCredits
    } credits`;
    return result;
  }
}
