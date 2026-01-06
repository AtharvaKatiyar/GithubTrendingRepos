import { getStartDateFromDuration } from "../utils/dateUtils.js";
import { fetchTrendingRepos } from "../services/githubService.js";

async function getTrendingRepos({duration="week", limit=10}={}) {
    const allowedDurations = ['day', 'week', 'month', 'year'];
    if(!allowedDurations.includes(duration)){
      throw new Error(`Invalid duration "${duration}". Valid options are: day, week, month, year`);
    }
    if(!Number.isInteger(limit) || limit<=0){
      throw new Error('Limit must be positive');
    }
    if(limit>100){
      limit = 100;
    }
    const startDate = getStartDateFromDuration(duration);
    let repositories;
    try{
      repositories = await fetchTrendingRepos({startDate, limit});
    } catch(error){
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }

    const normalizedRepos = repositories.map((repo) => ({
      name: repo.name,
      owner: repo.owner?.login ?? "unknown",
      description: repo.description ?? "",
      stars: repo.stargazers_count ?? 0,
      language: repo.language ?? "Unknown",
      url: repo.html_url
    }));

    if (normalizedRepos.length === 0) {
      throw new Error("No trending repositories found for the given duration.");
    }

    return normalizedRepos;

}
export {getTrendingRepos};