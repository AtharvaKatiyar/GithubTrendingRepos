import { Octokit } from "octokit";

const octokit = new Octokit();
async function fetchTrendingRepos({startDate, limit}) {
    try{
        const response = await octokit.rest.search.repos({
            q: `created:>${startDate}`,
            sort: "stars",
            order: `desc`,
            per_page: limit,
        });
        return response.data.items;

    }
    catch(error){
        if(error.status === 403){
            throw new Error("Github API llimit exceeded. Please try again later.");
        }
        if(error.status === 422){
            throw new Error("Invalid search query send to github api");
        }
        throw new Error("Failed to fetch data from Github API");
    }
}
export {fetchTrendingRepos};