export const API_KEY = process.env.ASSET_API_KEY as string
export const API_BASE_URL = process.env.ASSET_API_BASE_URL as string
export const REDIRECT_URI = process.env.AUTH0_RETURN_TO_URL as string

export const apiHeaders = new Headers({
    'X-API-KEY': API_KEY,
})
