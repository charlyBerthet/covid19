const cheerio = require('react-native-cheerio')

class StatsService {
    getStats = async () => {
        return fetch("https://www.worldometers.info/coronavirus/country/france/")
        .then(html => html.text())
        .then(txt => {
            const $ = cheerio.load(txt)
            const numbers = {
                infections: "",
                deaths: "",
                recovers: ""
            }
            $("#maincounter-wrap .maincounter-number").each(function(idx){
                const val = $(this).text().trim().replace(",", " ")
                if (idx === 0) {
                    numbers.infections = val
                } else if (idx === 1) {
                    numbers.deaths = val
                } else if (idx === 2) {
                    numbers.recovers = val
                }
            })
            return numbers
        })
    }
}

export default new StatsService()