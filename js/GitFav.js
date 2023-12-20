export class GitFav{
    static async search (username){
        const endpoint = `https://api.github.com/users/${username}`

        const url = fetch(endpoint)
        const {
            login,
            name,
            public_repos,
            followers
        } = await (await url).json()

        return {
            login,
            name,
            public_repos,
            followers
        }
    }
}