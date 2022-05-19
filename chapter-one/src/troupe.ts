import { playsMap } from "./playMap";
import { priceMap } from "./priceMap";
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
    let result = `Statement for ${customer}\n`;
    const format = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format;
    let totalPrice = 0;
    let volumeCredits = 0;
    for (const item of performances) {
      const play = playsMap[item.play].name;
      let amount = 0;
      if (item.type === "tragedy") {
        if (item.audienceAount > 30) {
          amount += item.price + 1000 * (item.audienceAount - 30);
        }
      } else if (item.type === "comedy") {
        if (item.audienceAount > 20) {
          amount += item.price + 10000 + 500 * (item.audienceAount - 20);
        }
        amount += 300 * item.audienceAount;
      } else {
        throw new Error(`unknow type: ${item.type}`);
      }
      volumeCredits += Math.max(item.audienceAount - 30, 0);
      if (item.type === "comedy") {
        volumeCredits += Math.floor(item.audienceAount / 5);
      }
      totalPrice += amount;

      result += `${play}: ${format(amount / 100)} (${item.audienceAount} seats)\n`;
    }
    result += `Amount owed is ${format(totalPrice / 100)}\n`;
    result += `You earned ${volumeCredits} credits`;
    return result;
    //   return `
    //   Statement for ${customer}
    //       Hamelet: $650.00 (55 seats)
    //       As You Like It: $580.00 (35 seats)
    //       Othello: $500.00 (40 seats)
    //   Amount owed is $1,730.00
    //   You earned 47 credits
    // `;
  }
}
