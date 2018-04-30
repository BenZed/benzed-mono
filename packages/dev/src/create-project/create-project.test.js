import { expect } from 'chai'
import createProject from './create-project'
import path from 'path'
import fs from 'fs-extra'

// eslint-disable-next-line no-unused-vars
/* global describe it before after beforeEach afterEach */

/******************************************************************************/
// Data
/******************************************************************************/

const WORK_DIR = path.resolve(__dirname, '../../test/create-project')
fs.ensureDirSync(WORK_DIR)

/******************************************************************************/
// Helper
/******************************************************************************/

function testProjectCreate (options) {

  const { dir, name } = options

  createProject(options)

  const projectDir = path.join(dir, name)

  it(`project '${name}' created at ${projectDir}`, () => {
    let stat
    expect(() => {
      stat = fs.statSync(projectDir)
    }).to.not.throw(Error)

    expect(stat.isDirectory()).to.be.equal(true)

    // expect project to have a .babelrc, package.json, ect.
  })

}

// const fakeArgs = dir => [
//   'node', 'benzed-create', // needs two or else args package breaks
//   `--dir`, `${dir || WORK_DIR}`
// ]

/******************************************************************************/
// Test
/******************************************************************************/

describe.only('createProject()', () => {

  it('is a function', () => {
    expect(createProject).to.be.instanceof(Function)
  })

  describe('input', () => {
    it('array of strings (argv)')
    it('plain object')
    it('otherwise throws')
  })

  describe('options', () => {

    describe('dir', () => {
      it('must be a path')
      it('throws if dir does not exist')
    })

    it('name')
    it('api')
    it('socketio')
    it('rest')
    it('auth')
    it('files')
    it('ui')

  })

  describe('usage', () => {

    describe('creates libraries', () => {

      const options = {
        dir: WORK_DIR,
        name: 'test-lib',

        socketio: false,
        rest: false,

        ui: false,
        api: false,

        auth: false,
        files: false
      }

      testProjectCreate(options)

    })

    describe('creates apis', () => {

      const options = {
        dir: WORK_DIR,
        name: 'test-api',

        socketio: true,
        rest: false,

        ui: false,
        api: true,

        auth: false,
        files: false
      }

      testProjectCreate(options)

    })

    describe('creates app', () => {

      const options = {
        dir: WORK_DIR,
        name: 'test-app',

        socketio: true,
        rest: false,

        ui: true,
        api: true,

        auth: false,
        files: false
      }

      testProjectCreate(options)

    })

  })

})
