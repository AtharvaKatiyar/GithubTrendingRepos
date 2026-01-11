import {Args, Command, Flags} from '@oclif/core'
import axios from 'axios';
export default class TrendingRepo extends Command {
  static override args = {
    file: Args.string({description: 'file to read'}),
  }
  static override description = 'describe the command here'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]
  static override flags = {

    limit: Flags.integer({
      char: 'l', 
      description: 'No of repos that can be fetched',
      default:10,
      parse: async (value) =>{
        const num  = Number(value);
        if(Number.isNaN(num)){
          throw new Error('Limit must be a number between 1 and 100 and not a string')
        }
        if(num <1 || num>100){
          throw new Error('Limit must be between 1 and 100');
        }
        return num;
      }
    }),
    duration: Flags.string({
      char: 'd',
      description: 'duration of the repositories: day, week, month, year',
      default: 'day',
      options: ['day', 'week', 'month', 'year'],
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(TrendingRepo)
    try{
      const response = await axios.get('http://localhost:3000/api/repos/trending', {
        params:{
          duration: flags.duration,
          limit: flags.limit
        }
      })
      const repos = response.data
      repos.forEach((repo: any, index: number) => {
        this.log(`${index+1}: ${repo.name} ⭐ ${repo.stars}`);
      });
    } catch (error: any) {
      // console.error('AXIOS ERROR:', {
      //   message: error.message,
      //   code: error.code,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // })
      this.error('Backend server is not reachable')
    }

  }
}
