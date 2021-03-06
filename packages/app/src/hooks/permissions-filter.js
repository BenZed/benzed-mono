
import Schema from '@benzed/schema' // eslint-disable-line no-unused-vars
import { PermissionFunction } from './permissions-check' // eslint-disable-line no-unused-vars
import { wrap, first } from '@benzed/array'
import is from 'is-explicit'

import declareEntity from '../declare-entity'

// @jsx Schema.createValidator
/* eslint-disable react/react-in-jsx-scope */

const validate = PermissionFunction('filter')

/******************************************************************************/
// Main
/******************************************************************************/

const permissionsFilter = config => {

  const { filter } = validate(config)

  return declareEntity('hook', {
    name: 'permissions-filter',
    types: 'after',
    provider: 'external'
  }, ctx => {

    const { params, result } = ctx
    const { user } = params

    if (!user)
      throw new Error('must be authenticated to filter permissions.')

    // permissions checking is skipped for admins
    if (user.permissions?.admin)
      return

    const docs = wrap(result.data)

    // TODO we gotta add some kind of logic that chains queries when
    // find results that we don't have permission to see. If we're looking
    // at results 10 - 20 of 50, for example, and we're not allowed to see 5
    // of them, we should keep pulling results until we have enough to fit
    // the limit. Right now documents the client are not allowed to see
    // are nulled out, which is not ideal.
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i]
      docs[i] = filter(user.permissions, ctx, doc)
        ? doc
        : null
    }

    ctx.result.data = is.array(result.data)
      ? docs
      : first(docs)

    return ctx

  })
}

/******************************************************************************/
// Exports
/******************************************************************************/

export default permissionsFilter
