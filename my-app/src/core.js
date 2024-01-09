// const isLocalhost =window.location.href.includes("localhost")
const isProduction = window.location.href.includes("https")

export const baseUrl = isProduction ? "" : "http://localhost:5002" ;