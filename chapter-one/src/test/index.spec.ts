import { test, expect } from "vitest";
import { Troupe } from "../troupe";

// 1. 预订之前，先看一下剧团的剧本有哪些，了解它的类目报价
test("查看剧目单", () => {
  const troupe = new Troupe();
  expect(troupe.plays()).toEqual({
    hamelet: { name: "Hamelet", type: "tragedy", price: 40000 },
    asLike: { name: "As You Like It", type: "comedy", price: 30000 },
    othello: { name: "Othello", type: "tragedy", price: 40000 },
  });
});

// 2. 看了剧之后，选出自己想看的剧以及预订的观众数，进行下单
test("看了剧之后，选出自己想看的剧以及预订的观众数，进行下单", () => {
  const performances = [
    {
      play: "hamelet",
      type: "tragedy",
      audienceAount: 55,
      price: 40000,
    },
    {
      play: "asLike",
      audienceAount: 35,
      type: "comedy",
      price: 30000,
    },
    {
      play: "othello",
      audienceAount: 40,
      type: "tragedy",
      price: 40000,
    },
  ];
  const troupe = new Troupe();
  expect(troupe.order("Job", performances)).toEqual({
    customer: "Job",
    performances,
  });
});

test("生产订单", () => {
  const troupe = new Troupe();
  const customer = "Job";
  const performances = [
    {
      play: "hamelet",
      type: "tragedy",
      audienceAount: 55,
      price: 40000,
    },
    {
      play: "asLike",
      audienceAount: 35,
      type: "comedy",
      price: 30000,
    },
    {
      play: "othello",
      audienceAount: 40,
      type: "tragedy",
      price: 40000,
    },
  ];
  expect(troupe.statement(customer, performances)).toEqual(
    `Statement for ${customer}\nHamelet: $650.00 (55 seats)\nAs You Like It: $580.00 (35 seats)\nOthello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits`
  );
});
