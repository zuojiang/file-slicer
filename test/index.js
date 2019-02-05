const execa = require('execa')

const prefix = 'node bin/cli.js'

execa.shell(`${prefix} server test/tmp_bak --port 5000`)
execa.shell(`${prefix} server test/tmp_bak --user admin --password abc --port 6000`)

const url1 = 'http://127.0.0.1:5000'
const url2 = 'http://admin:abc@127.0.0.1:6000'
const url3 = 'http://127.0.0.1:6000'
const url4 = 'http://127.0.0.1:6001'

describe('cli', () => {
  before(done => setTimeout(done, 1000))

  describe('normal', () => {
    it('upload files and folder', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url1} src lib/* --error-stack`)
      if (stderr) {
        throw stderr
      }
    })

    it('dry-run', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url1} src lib/* --dry-run --error-stack`)
      if (stdout.indexOf('No upload anything') == -1) {
        throw stdout
      }
    })

    it('skip-fail', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url4} README.md package.json --timeout 100 --skip-fail --error-stack`)
      if (!stderr || stdout.indexOf('[2/2]') == -1) {
        throw stdout
      }
    })

    it.skip('skip-test', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url3} README.md package.json --skip-test --error-stack`)
      if (!stderr || stdout.indexOf('[2/2]') == -1) {
        throw stdout
      }
    })

    it.skip('oneline', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url1} README.md package.json --oneline --error-stack`)
      if (stderr) {
        throw stderr
      }
      // console.log(JSON.stringify(stdout));
    })

  })

  describe('auth', () => {
    it('with user', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url2} src --error-stack`)
      if (stderr) {
        throw stderr
      }
    })

    it('without user', async () => {
      const {stdout, stderr} = await execa.shell(`${prefix} upload ${url3} src --error-stack`)
      if (!stderr) {
        throw stdout
      }
    })
  })

})
