import { expect } from 'chai'
import ClientStateTree, { $$feathers } from './client-state-tree'
import { copy, get, set } from '@benzed/immutable'
import io from 'socket.io-client'
import is from 'is-explicit'
import { Test, expectReject } from '@benzed/dev'
import App from '@benzed/app' // eslint-disable-line no-unused-vars

/* @jsx App.declareEntity */
/* eslint-disable react/react-in-jsx-scope */

// eslint-disable-next-line no-unused-vars
/* global describe it before after beforeEach afterEach */

/******************************************************************************/
// Data
/******************************************************************************/

const CONFIG = {
  hosts: [ 'http://localhost:3200' ],
  provider: 'rest',
  reconnect: false,
  auth: true
}

/******************************************************************************/
// Helper
/******************************************************************************/

function expectNewClient (config, call = false) {
  const createNewClient = () => new ClientStateTree(config)
  return expect(call ? createNewClient() : createNewClient)
}

/******************************************************************************/
// Tests
/******************************************************************************/

describe('Client State Tree', () => {

  let restClient, restClientNoAuth, socketIoClient
  before(() => {
    restClient = new ClientStateTree(CONFIG)
    restClientNoAuth = new ClientStateTree(CONFIG::set('auth', false))
    socketIoClient = new ClientStateTree(CONFIG::set('provider', 'socketio'))
  })

  it('creates an instance of feathers client', () => {

    const feathers = restClient[$$feathers]
    expect(is.object(feathers))
      .to.be.equal(true)

    expect(feathers.methods)
      .to.be
      .deep.equal(['find', 'get', 'create', 'update', 'patch', 'remove'])
  })

  it('stores config in client.config', () => {
    expect(restClient.config).to.be.deep.equal({
      hosts: ['http://localhost:3200'],
      provider: 'rest',
      reconnect: false,
      auth: {
        storageKey: 'benzed-jwt',
        storage: {},
        cookie: 'benzed-jwt'
      }
    })
  })

  it('client.config is frozen', () => {
    expect(() => {
      restClient.config.provider = 'socketio'
    }).to.throw('Cannot assign to read only property')
  })

  it('client.config cannot be changed', () => {
    expect(() => {
      restClient.config = null
    }).to.throw('Cannot assign to read only property \'config\'')
  })

  describe('configuration', () => {

    it('is required', () => {
      expectNewClient().to.throw('ClientStateTree configuration is required.')
    })

    describe('config.hosts', () => {
      it('is required', () => {
        expectNewClient(CONFIG::set('hosts', null))
          .to.throw('hosts is required.')
      })

      it('must be string or an array of strings', () => {
        expectNewClient(CONFIG::set('hosts', {}))
          .to.throw('hosts[0] must be of type: String')
      })

      it('must include http or https protocol', () => {
        expectNewClient(CONFIG::set('hosts', 'localhost:3200'))
          .to.throw('Host must include http(s) protocol.')
      })
    })

    describe('config.provider', () => {
      it('is required', () => [
        expectNewClient(CONFIG::set('provider', null))
          .to.throw('provider is required.')
      ])

      it('must be either rest or socketio', () => {
        expectNewClient(CONFIG::set('provider', 'cake'))
          .to.throw(`provider must be one of: 'rest', 'socketio'`)
      })
    })

    describe('config.auth', () => {
      it('is not required', () => {
        expectNewClient(CONFIG::set('auth', null))
          .to.not.throw('auth is required.')
      })
      it('true gets cast to a default auth options object', () => {
        expectNewClient(CONFIG::set('auth', true), true)
          .to.have.deep.property('config', {
            ...CONFIG,
            reconnect: false,

            auth: {
              storageKey: 'benzed-jwt',
              storage: {},
              cookie: 'benzed-jwt'
            }
          })
      })
      it('false gets cast to null', () => {
        expectNewClient(CONFIG::set('auth', false), true)
          .to.have.deep.property('config', {
            ...CONFIG,
            auth: null
          })
      })

      it('strings get cast to tokenKeys', () => {
        expectNewClient(CONFIG::set('auth', 'whatever-jwt'), true)
          .to.have.deep.property('config', {
            ...CONFIG,
            auth: {
              storageKey: 'whatever-jwt',
              storage: {},
              cookie: 'whatever-jwt'
            }
          })
      })
    })
  })

  describe('creates feathers client adapter based on config.provider', () => {

    describe('rest', () => {

      let someService
      before(() => {
        someService = restClient[$$feathers].service('some-service')
      })

      it('has fetch as rest property', () => {
        expect(restClient[$$feathers]).to.have.property('rest', fetch)
      })

      it('retreived services base url comes from client', () => {

        restClient.setHost('nowhere')
        expect(someService).to.have.property('base', 'nowhere/some-service')

        restClient.setHost('somewhere')
        expect(someService).to.have.property('base', 'somewhere/some-service')
      })

      it('retreived services are not instanced every time', () => {
        expect(restClient[$$feathers].service('some-service'))
          .to.be.equal(someService)
      })

    })

    describe('socketio', () => {

      describe('io manager is initialized with specific options', () => {
        it('does not auto connect', () => {
          const feathers = socketIoClient[$$feathers]
          expect(feathers.io.io.autoConnect).to.be.equal(false)
        })

        it('does not auto reconnect', () => {
          const feathers = socketIoClient[$$feathers]
          expect(feathers.io.io._reconnection).to.be.equal(false)
        })

        it('1000 ms timeout', () => {
          const feathers = socketIoClient[$$feathers]
          expect(feathers.io.io._timeout).to.be.equal(1000)
        })
      })

      describe('uses custom socket io functionality', () => {
        let someService
        before(() => {
          someService = socketIoClient[$$feathers].service('some-service')
        })

        it('has Socket instance as socket property', () => {
          const feathers = socketIoClient[$$feathers]

          expect(feathers).to.have.property('io')
          expect(feathers.io).to.be.instanceof(io.Socket)
          expect(feathers.io.io).to.be.instanceof(io.Manager)
        })

        it('has custom service getter function', () => {
          expect(socketIoClient[$$feathers]).to.have.property('defaultService')
          const defaultService = socketIoClient[$$feathers].defaultService
          expect(defaultService).to.have.property('name', 'bound getSocketIOService')
        })

        it('retreived services are not instanced every time', () => {
          expect(socketIoClient[$$feathers].service('some-service')).to.be.equal(someService)
        })
      })
    })

    describe('auth', () => {

      it('adds passport property', () => {
        expect(restClient[$$feathers]).to.have.property('passport')
        expect(restClientNoAuth[$$feathers]).to.not.have.property('passport')
      })

    })
  })

  for (const provider of [ 'express', 'socketio' ])
    for (const auth of [ false, true ])
      Test.Api(<app logging={false}>
        {
          provider === 'socketio'
            ? <socketio />
            : null
        }
        {
          provider === 'express' || auth
            ? <express/>
            : null
        }
        { auth
          ? <authentication />
          : null
        }
        {
          auth
            ? <service name='users' multi >
              <hooks before all >
                <authenticate />
                <password-hash />
              </hooks>
            </service>
            : null
        }
        { provider === 'express' || auth
          ? <express-error />
          : null
        }
      </app>, state => {

        let client, users
        before(async () => {

          users = auth && await state.api.service('users').create([
            {
              email: 'some-user@gmail.com',
              password: 'password'
            }
          ])

          client = new ClientStateTree({
            hosts: [ 'http://some-other-host', state.address ],
            provider: provider === 'express' ? 'rest' : 'socketio',
            auth
          })

        })

        describe(`usage in a ${provider} ${auth ? 'auth' : 'non-auth'} app`, () => {

          let host
          before(async () => {
            host = await client.connect()
          })

          let userId = null
          const authStateHistory = []
          if (auth) before(async function () {

            this.timeout(5000)

            const { email } = users[0]

            authStateHistory.push(copy(client.auth))
            client.subscribe((tree, path) => {
              authStateHistory.push(get(tree, path))
            }, 'auth')

            await client.login(email, 'bad-password')

            userId = await client.login(email, 'password')
            await client.logout()
          })

          describe('initial state', () => {
            it(`state auth should be ${auth ? 'an object' : 'null'}`, () => {
              const expecter = expect(client.auth)
              if (auth)
                expecter.to.be.instanceof(Object)
              else
                expecter.to.be.equal(null)
            })
          })

          describe('connect action', () => {
            it('connects to any host it can get a response from', () => {
              expect(client.host)
                .to.be.equal(state.address)
            })

            it('returns connected host', () => {
              expect(client.host)
                .to.be.equal(host)
              if (provider === 'socketio')
                expect(client[$$feathers].io.connected).to.be.equal(true)
            })

            it('throws if host cannot be found', () => {
              const badPort = state.api.listener.address().port + 1

              const client = new ClientStateTree({
                provider: provider === 'express'
                  ? 'rest'
                  : 'socketio',
                hosts: [
                  'http://localhost:' + badPort
                ]
              })

              return client.connect()::expectReject('Host could not be resolved.')
            })
          })

          describe('login action', () => {

            if (!auth)
              it('should throw error', () =>
                expect(::client.login).to.throw('auth is not enabled')
              )

            if (auth) it('sets auth.userId if successful', () => {
              expect(authStateHistory.some(auth => is.defined(auth.userId)))
                .to.be.equal(true)
            })

            if (auth) it('returns logged in user id', () => {
              expect(is.defined(userId)).to.be.equal(true)
            })

            if (auth) it('sets auth.status to \'authenticating\' until response has been received',
              () => {
                expect(authStateHistory.some(auth => auth.status === 'authenticating'))
                  .to.be.equal(true)
              })

            if (auth) it('sets auth.status with error object if login failed',
              () => {
                expect(authStateHistory.some(auth => auth.status?.message === 'Invalid login'))
                  .to.be.equal(true)
              })

            if (auth) it('clears auth.status if successful', () => {
              expect(
                authStateHistory
                  .some(auth => is.defined(auth.userId) && auth.status === null)
              ).to.be.equal(true)
            })

            if (auth) it('throws if host not resolved', () => {
              const notConnected = new ClientStateTree({
                hosts: [ 'http://some-other-host', state.address ],
                provider: provider === 'express' ? 'rest' : 'socketio',
                auth
              })
              expect(() => notConnected.login('whats@up.com', 'fail'))
                .to.throw(provider === 'express'
                  ? 'Host not resolved'
                  : 'Not connected to host')
            })
          })

          describe('logout action', () => {
            if (!auth)
              it('should throw error', () =>
                expect(::client.logout).to.throw('auth is not enabled')
              )

            if (auth) it('sets auth.userId to null', () => {
              expect(client.auth.userId).to.be.equal(null)
            })

            if (auth) it('sets auth.status to null', () => {
              expect(client.auth.status).to.be.equal(null)
            })

            if (auth) it('throws if host not resolved', () => {
              const notConnected = new ClientStateTree({
                hosts: [ 'http://some-other-host', state.address ],
                provider: provider === 'express' ? 'rest' : 'socketio',
                auth
              })
              expect(() => notConnected.logout())
                .to.throw(provider === 'express'
                  ? 'Host not resolved'
                  : 'Not connected to host')
            })
          })
        })
      })
})
