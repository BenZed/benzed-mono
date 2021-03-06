import { expect } from 'chai'
import { get } from '../src'

import Test from '@benzed/dev'

// eslint-disable-next-line no-unused-vars
/* global describe it before after beforeEach afterEach */

Test.optionallyBindableMethod(get, getter => {

  it('gets values in objects via a path', () => {

    const obj = { key: 'value' }

    expect(getter(obj, 'key'))
      .to
      .equal('value')
  })

  it('get path works on functions', () => {

    const obj = {
      test () {
        return 'pass'
      }
    }

    obj.test.foo = 'bar'

    expect(getter(obj, ['test', 'foo'])).to.be.equal('bar')
  })

  it('zero length path returns input', () => {

    const obj = {
      foo: 'bar'
    }

    expect(get(obj, [])).to.be.deep.equal(obj)
    expect(get(obj, [])).to.not.be.equal(obj)

  })

  it('returns copies of gotten values', () => {

    const obj = {
      nested: {
        foo: 'bar'
      }
    }

    const nested = getter(obj, 'nested')
    expect(nested).to.deep.equal(obj.nested)
    expect(nested).to.not.equal(obj.nested)

  })

  it('path can be an array', () => {
    const obj = {
      foo: {
        bar: 'baz'
      }
    }

    expect(getter(obj, ['foo', 'bar'])).to.equal('baz')
  })

  it('handles invalid paths', () => {
    const obj = {
      foo: null
    }

    expect(getter(obj, ['foo', 'bar', 'baz'])).to.equal(undefined)
  })

})

Test.optionallyBindableMethod(get.mut, getMutable => {

  it('is the mutable version', () => {

    const obj = {
      nested: {
        foo: 'bar'
      }
    }

    const nested = getMutable(obj, 'nested')
    expect(nested).to.deep.equal(obj.nested)
    expect(nested).to.equal(obj.nested)
    expect(getMutable(obj, ['nested', 'foo'])).to.equal('bar')

  })

}, 'get.mut')
