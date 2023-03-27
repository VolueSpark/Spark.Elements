import { PriceUnits, SpotPrice, SpotPriceAdvice } from "./types"

type SpotPriceAdviceDTO = {
    advice: Array<SpotPriceAdvice>,
    spotPrices: Array<SpotPrice>
    priceArea: {
        code: string
    }
    priceUnits: PriceUnits 

}


export const spotPriceAdviceDTO: SpotPriceAdviceDTO = {
    advice: [
      {
        cost: 22.8881755125,
        averagePrice: 1.0596377552083334,
        from: "2023-03-27T09:00:00+00:00",
        to: "2023-03-27T14:00:00+00:00",
        type: "Best"
      },
      {
        cost: 28.8934964325,
        averagePrice: 1.337661871875,
        from: "2023-03-27T05:00:00+00:00",
        to: "2023-03-27T05:00:00+00:00",
        type: "Avoid"
      }
    ],
    spotPrices: [
      {
        time: "2023-03-27T07:00:00+00:00",
        price: 1.38048003125
      },
      {
        time: "2023-03-27T08:00:00+00:00",
        price: 1.30598913125
      },
      {
        time: "2023-03-27T09:00:00+00:00",
        price: 1.14177055625
      },
      {
        time: "2023-03-27T10:00:00+00:00",
        price: 1.0860434625
      },
      {
        time: "2023-03-27T11:00:00+00:00",
        price: 1.0476693625
      },
      {
        time: "2023-03-27T12:00:00+00:00",
        price: 1.0132455375
      },
      {
        time: "2023-03-27T13:00:00+00:00",
        price: 1.011834725
      },
      {
        time: "2023-03-27T14:00:00+00:00",
        price: 1.0572628875
      },
      {
        time: "2023-03-27T15:00:00+00:00",
        price: 1.146144075
      },
      {
        time: "2023-03-27T16:00:00+00:00",
        price: 1.256751775
      },
      {
        time: "2023-03-27T17:00:00+00:00",
        price: 1.35903568125
      },
      {
        time: "2023-03-27T18:00:00+00:00",
        price: 1.39994924375
      },
      {
        time: "2023-03-27T19:00:00+00:00",
        price: 1.39599896875
      },
      {
        time: "2023-03-27T20:00:00+00:00",
        price: 1.3806211125
      },
      {
        time: "2023-03-27T21:00:00+00:00",
        price: 1.2903291125
      }
    ],
    priceArea: {
      code: "NO1"
    },
    priceUnits: {
      currency: "NOK",
      vat: {
        rate: 1.25,
        hasVAT: true
      },
      energyUnit: "kWh"
    }
  }