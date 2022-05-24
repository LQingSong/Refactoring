import { playsMap } from "./playMap";
import { priceMap } from "./priceMap";

function usd(number) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(number / 100);
}
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

  statement(invoice) {
    return Troupe.renderPlainText(Troupe.createStatementData(invoice));
  }

  static createStatementData(invoice) {
    let result = {
      customer: invoice.customer,
      performances: [],
      totalPrice: 0,
      volumeCredits: 0,
    };
    result.performances = Troupe.performances(invoice.plays);
    result.totalPrice = Troupe.totalPrice(invoice.plays);
    result.volumeCredits = Troupe.totalVolumeCredits(invoice.plays);
    return result;
  }

  static performances(plays) {
    return plays.map((item) => {
      return {
        play: playsMap[item.play].name,
        money: Troupe.amountFor(item),
        seats: item.audienceAount,
      };
    });
  }

  static totalPrice(performances) {
    let result = 0;
    for (const item of performances) {
      result += Troupe.amountFor(item);
    }
    return result;
  }

  static totalVolumeCredits(performances) {
    let result = 0;
    for (const item of performances) {
      result += Troupe.volumeCreditsFor(item);
    }
    return result;
  }

  /**
   * 每出剧的观众量积分
   * 制定观众量积分的规格
   * @param performance
   * @returns
   */
  static volumeCreditsFor(performance) {
    let result = Math.max(performance.audienceAount - 30, 0);
    if (performance.type === "comedy") {
      result += Math.floor(performance.audienceAount / 5);
    }
    return result;
  }

  /**
   * 剧目金额
   * 制定定价规格
   * @param performance
   * @returns amount
   */
  static amountFor(performance) {
    let result = 0;
    if (performance.type === "tragedy") {
      if (performance.audienceAount > 30) {
        result += performance.price + 1000 * (performance.audienceAount - 30);
      }
    } else if (performance.type === "comedy") {
      if (performance.audienceAount > 20) {
        result += performance.price + 10000 + 500 * (performance.audienceAount - 20);
      }
      result += 300 * performance.audienceAount;
    } else {
      throw new Error(`unknow type: ${performance.type}`);
    }
    return result;
  }

  /**
   * 输出账单详情 字符串格式
   * @param billingDetail
   * @returns {String}
   */
  static renderPlainText(billingDetail) {
    let result = `Statement for ${billingDetail.customer}\n`;

    // performances: [ { play: xxx, money： $xxx.00, seats: xx }, { ... }, {...}]
    billingDetail.performances.forEach((item) => {
      result += `${item.play}: ${usd(item.money)} (${item.seats} seats)\n`;
    });

    // totalPrice: xxx, volumeCredits: xx
    result += `Amount owed is ${usd(billingDetail.totalPrice)}\nYou earned ${billingDetail.volumeCredits} credits`;
    return result;
  }

  // 新需求1 输出的账单打印成html格式
  static renderHtml(billingDetail) {}
}
