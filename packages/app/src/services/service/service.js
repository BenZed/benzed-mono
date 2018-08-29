import is from 'is-explicit'

import App from '../../app'

import { Schema, string, bool, required, defaultTo, cast } from '@benzed/schema'
import getDatabaseAdapter from './get-database-adapter'
import registerToFeathers from './register-to-feathers'
import compileHooks, {
  validateHookMethodStructure,
  validateHookTypeStructure,
  mergeHooks,
  HOOKS
} from './compile-hooks'

import { boolToObject } from '../../util'

/******************************************************************************/
// Validation
/******************************************************************************/

const ALLOW_ARBITRARY_KEYS = false

const defaultToName = (value, { args: [ name ] }) =>
  is.string(value)
    ? value
    : name

const removeFirstSlash = value => {
  if (!is.string(value))
    return value

  value = value.replace(/^\/+/, '')

  return value
}

const validateConfig = new Schema({

  'path': string(defaultToName, removeFirstSlash),
  'auth': bool(defaultTo(true)),
  'soft-delete': cast(boolToObject),
  'versions': cast(boolToObject),
  'live-edit': cast(boolToObject)

}, ALLOW_ARBITRARY_KEYS)

const validateName = new Schema(
  string(required('Name is required.'))
)

const validateApp = value => {

  if (!is(value, App))
    throw new Error('Must be an App instance.')

  return value
}

/******************************************************************************/
// Helper
/******************************************************************************/

// TODO move this to setup-services so it works with generic services as well
function addServiceShortCut (name) {

  const app = this

  if (name in app)
    return

  const getter = {
    get () {
      return this.feathers.service(name)
    },
    configurable: false,
    enumerable: true
  }

  Object.defineProperty(app, name, getter)
}

/******************************************************************************/
// Main
/******************************************************************************/

class Service {

  constructor (config, name, app) {

    const {
      path,
      paginate // ,
      // versions,
      // 'live-edit': liveEdit,
    } = config = validateConfig(config, name)
    name = validateName(name)
    app = validateApp(app)

    app::addServiceShortCut(path)

    const adapter = this::getDatabaseAdapter(app, name, paginate)
    const service = this::registerToFeathers(app, path, adapter, config)
    const hooks = this::compileHooks(app, config, adapter)

    service.hooks(hooks)

    service.Service = this.constructor

    // if (versions)
    //   service::setupVersions(versions)

    // if (liveEdit)
    //   service::setupLiveEdit(liveEdit)

    return service

  }

  [HOOKS] = validateHookTypeStructure({})

  before (hooksToAdd) {
    mergeHooks(this[HOOKS], {
      before: validateHookMethodStructure(hooksToAdd)
    })
  }

  after (hooksToAdd) {
    mergeHooks(this[HOOKS], {
      after: validateHookMethodStructure(hooksToAdd)
    })
  }

  error (hooksToAdd) {
    mergeHooks(this[HOOKS], {
      error: validateHookMethodStructure(hooksToAdd)
    })
  }

  // Life Cycle
  addMiddleware (config, app) {}

  addHooks (config, app) {}

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default Service
