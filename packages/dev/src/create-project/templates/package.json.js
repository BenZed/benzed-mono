
export default ({ ui, api, name }) => {

  const build = api ? 'dist' : 'lib'

  const scripts = {
    'update': 'npx ncu -u -a',
    'lint': 'eslint src --fix',
    'test': 'mocha --options .mocha.opts',
    'test:dev': 'npx watch \'npm run test\' src',
    'build': `rm -rf ${build}; mkdir ${build}; babel src --out-dir ${build} --copy-files`,
    'build:dev': 'npm run build -- --watch'
  }

  if (!api) {
    scripts['prepublishOnly'] = 'npm run lint && npm run test && npm run build'
    scripts['release:patch'] = 'npm version patch && npm publish'
    scripts['release:minor'] = 'npm version minor && npm publish'
    scripts['release:major'] = 'npm version major && npm publish'
  }

  if (ui) {
    scripts['webpack'] = 'NODE_ENV=production webpack'
    scripts['webpack:dev'] = 'NODE_ENV=development webpack-dev-server'
  }

  if (api) {
    scripts['serve'] = `node ./${build}/scripts/serve.js`
    scripts['serve:dev'] = `NODE_ENV=development nodemon --watch ${build}/api ./${build}/scripts/serve.js`
    scripts['start'] = `npm i && npm run lint && npm run test && npm run build ${ui ? '&& npm run webpack ' : ''}&& npm run serve`
  }

  const pkg = {
    name,
    version: '0.0.1',
    main: build,
    scripts,
    keywords: [],
    author: 'BenZed',
    license: 'ISC',
    description: 'generated by BenZed\'s create-project dev tool'
  }

  return pkg
}

export const devDependencies = () => [
  '@benzed/dev'
]

export const dependencies = ({ ui, api }) => [
  ui && '@benzed/react',
  api && '@benzed/app'
]
