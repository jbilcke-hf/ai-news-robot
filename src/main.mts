import { checkDailyNews } from "./dailyNews/checkDailyNews.mts"
import { checkDailyPapers } from "./dailyPapers/checkDailyPapers.mts"
import { checkDailyWeather } from "./dailyWeather/checkDailyWeather.mts"

export const main = async () => {
  // we repeat the process every 24h
  let delayInSeconds = 24 * 60 * 60

  console.log(`-------------- 24 hours have elapsed --------------`)
  
  await checkDailyNews()
  await checkDailyPapers()
  await checkDailyWeather()

  setTimeout(() => {
    main()
  }, delayInSeconds * 1000)
}
