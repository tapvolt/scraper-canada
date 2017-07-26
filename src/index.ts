import * as assert from "assert"
import {retry} from "async"
import * as cheerio from "cheerio"
import * as config from "config"
import * as req from "tinyreq"
import * as log from "winston"
import {ICssSelector, ITarget} from "./types"

export async function main() {

    [
        "target.domain",
        "target.path",
        "target.suffix",
        "target.min",
        "target.max",

        "cssSelector.pageAnchor",

    ].forEach((key: string) => {
        assert(config.has(key), "Missing key in config")
    })
    const target = config.get<ITarget>("target"),
        selector = config.get<ICssSelector>("cssSelector"),
        companies = [] as any

    let urlsToVisit = [] as any

    for (let i = target.min; i <= target.max; i++) {
        log.info(`target page #${i}`)
        urlsToVisit = await getUrlsFromPage(target, i, selector)

        for (const url of urlsToVisit) {
            const $ = await fetch(url)
            companies.push({
                companyName: $("#list > ul > li:nth-child(1) > div.covalue > a > span").text().trim(),
                governingLegislation: $("#list > ul > li:nth-child(2) > div.covalue > cite").text().trim(),
                officeAddress: $("#list > ul > li:nth-child(3) > div.covalue > span").text().trim(),
                status: $("#list > ul > li:nth-child(4) > div.covalue > span").text().trim(),
                annualFilingPeriod: $("#list > ul > li:nth-child(6) > div.covalue").text().trim(),
                statusOfAnnualFilings: $("#list > ul > li:nth-child(7) > div.covalue").text().trim(),
                directors: $("#list > ul > li:nth-child(8) > div.covalue").text().trim(),
                certificatesAndFilings: $("#list > ul > li:nth-child(9) > div.covalue").text().trim(),
            })
        }
        const breakpoint = true
    }
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetch(url: string): Promise<any> {
    return await new Promise((resolve) => {
        req(url, (err, body) => {
            if (err) {
                throw err
            }
            log.info(`fetching ${url}`)
            resolve(cheerio.load(body))
        })
    })
}

/**
 * @param {ITarget} target
 * @param {number} i
 * @param {ICssSelector} selector
 * @returns {Promise<any>}
 */
async function getUrlsFromPage(target: ITarget, i: number, selector: ICssSelector) {
    const urls = [] as any,
        $ = await fetch(target.domain + target.path + i + target.suffix),
        elements = $(selector.pageAnchor)

    elements.each((index, el) => {
        const path = cheerio(el).attr("href")
        urls.push(target.domain + path)
    })
    return urls
}

if (require.main === module) {
    main().catch((err) => {
        log.error("error encountered", err)
        process.exit(1)
    })
}
