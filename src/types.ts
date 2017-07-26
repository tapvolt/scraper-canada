export interface ICssSelector {
    pageAnchor: string
    companyName: string
    governingLegislation: string
    officeAddress: string
    status: string
    annualFilingPeriod: string
    statusOfAnnualFilings: string
    directors: string
    certificatesAndFilings: string
}

export interface ITarget {
    domain: string
    path: string
    suffix: string
    min: number
    max: number
}
