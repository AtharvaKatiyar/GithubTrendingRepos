import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('trending-repo', () => {
  it('runs trending-repo cmd', async () => {
    const {stdout} = await runCommand('trending-repo')
    expect(stdout).to.contain('hello world')
  })

  it('runs trending-repo --name oclif', async () => {
    const {stdout} = await runCommand('trending-repo --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
