/**
 * Load lib/client.js outside DSH with stub modules and assert the contract the
 * Web client relies on: the skin contributes its font row to the Plugins page
 * (`plugins.bundle.config`, keyed by the npm package name) and nothing to the
 * Settings dialog; the selection still persists in localStorage.
 *
 * Run: npm test   (or: node test/smoke-client.mjs)
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/* ---------------------------------------------------------------- DOM stubs */

const storage = new Map()
const localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
}

const headChildren = []
const document = {
  title: 'DSH',
  body: {
    attrs: new Map(),
    setAttribute(name, value) {
      this.attrs.set(name, value)
    },
    removeAttribute(name) {
      this.attrs.delete(name)
    },
    getAttribute(name) {
      return this.attrs.has(name) ? this.attrs.get(name) : null
    }
  },
  head: {
    appendChild(element) {
      headChildren.push(element)
    }
  },
  createElement(tagName) {
    return {
      tagName,
      dataset: {},
      id: '',
      textContent: '',
      remove() {
        const index = headChildren.indexOf(this)
        if (index !== -1) headChildren.splice(index, 1)
      }
    }
  },
  getElementById(id) {
    return headChildren.find((element) => element.id === id) ?? null
  }
}

/* ------------------------------------------------------- module resolution */

const stubs = {
  'react/jsx-runtime': {
    jsx: (type, props) => ({ type, props }),
    jsxs: (type, props) => ({ type, props })
  },
  react: {
    useState: (value) => [value, () => {}]
  },
  '@deepseek-ai/dsh-client-store': {
    defineStore: (definition) => ({ definition })
  },
  '@deepseek-ai/dsh-client-ui-primitives': {
    Menu: function Menu() {},
    IconChevronDownOutlineRegular: function IconChevronDown() {}
  }
}

const requireStub = (specifier) => {
  if (!(specifier in stubs)) throw new Error(`unexpected require: ${specifier}`)
  return stubs[specifier]
}

let client
const window = {
  localStorage,
  __ModuleLoader__: {
    load(spec) {
      assert.equal(spec.id, 'dsh-claude-skin')
      client = spec.factory(requireStub)
    }
  }
}

globalThis.window = window
globalThis.document = document

const source = readFileSync(join(root, 'lib/client.js'), 'utf8')
new Function('window', 'document', source)(window, document)

/* ---------------------------------------------------------------- fake ctx */

const registrations = []
const locales = new Map()
const effects = []

const ctx = {
  effect(run) {
    const dispose = run()
    effects.push(dispose)
    return dispose
  },
  slots: {
    inject(name, register) {
      assert.equal(name, 'plugins.bundle.config', 'only the Plugins page slot is used')
      register()
    },
    register(options, component) {
      registrations.push({ options, component })
      return () => {}
    }
  },
  locale: {
    register(namespace, dictionary) {
      locales.set(namespace, dictionary)
    }
  }
}

assert.deepEqual(client.inject, ['slots', 'locale'])
client.apply(ctx)

/* --------------------------------------------------------------- the skin */

assert.equal(document.body.getAttribute('data-dsh-claude'), '')
assert.equal(document.body.getAttribute('data-dsh-font'), 'anthropic')
assert.equal(document.title, 'Claude · DeepSeek Harness')

const style = document.getElementById('dsh-skin-claude-style')
assert.ok(style, 'the skin injects its stylesheet')
assert.ok(style.textContent.includes('[data-plugin-config] .dsh-skin-font-row'))
/* dsh 0.2.2-alpha.2 illustration aliases: rewritten once per colour scheme */
assert.equal(
  style.textContent.split('--dsw-alias-illustration-surface:').length - 1,
  2,
  'both the light and the dark palette warm the illustration aliases'
)

/* ------------------------------------------------------ slot registration */

assert.equal(registrations.length, 1, 'exactly one contribution')
const [{ options, component }] = registrations

assert.equal(options.name, 'plugins.bundle.config')
assert.equal(options.key, 'dsh-claude-skin', 'the key is the npm package name the page looks up')
assert.equal(options.locale, 'plugin.claudeSkin')
assert.equal('id' in options, false, 'id is list-only')
assert.equal('order' in options, false, 'order is list-only')
assert.ok(locales.has('plugin.claudeSkin'), 'the dictionary namespace is registered')
assert.equal(locales.get('plugin.claudeSkin').zh['font.title'], 'Claude 字体风格')

/* ------------------------------------------------------------ font modes */

const actions = {
  calls: 0,
  sync() {
    this.calls += 1
  }
}
const face = options.inject(actions)
assert.equal(actions.calls, 1, 'the entry syncs its store when bound')

face.setMode('system')
assert.equal(document.body.getAttribute('data-dsh-font'), 'system')
assert.equal(storage.get('dsh-claude-skin:fontMode'), 'system')

face.setMode('skin')
assert.equal(storage.get('dsh-claude-skin:fontMode'), 'skin')

face.setMode('not-a-mode')
assert.equal(document.body.getAttribute('data-dsh-font'), 'anthropic', 'unknown ids fall back')
assert.equal(storage.has('dsh-claude-skin:fontMode'), false, 'the default is not persisted')

/* ------------------------------------------------------------ render check */

const tree = component({
  t: (key) => key,
  setMode: face.setMode,
  useStore: (selector) => selector({ mode: 'anthropic' }),
  view: 'page'
})
assert.equal(tree.props.className, 'dsh-skin-font-row')
assert.equal(tree.props.children[1].props.items.length, 3)

/* --------------------------------------------------------------- teardown */

const disposeChrome = effects[0]
assert.equal(typeof disposeChrome, 'function')
disposeChrome()
assert.equal(document.body.getAttribute('data-dsh-claude'), null)
assert.equal(document.body.getAttribute('data-dsh-font'), null)
assert.equal(document.getElementById('dsh-skin-claude-style'), null)
assert.equal(document.title, 'DSH')

/* ------------------------------------------------------------- the manifest */

const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
assert.equal(manifest.dsh.client.platform, 'web', 'the client row declares the web platform')
assert.equal(manifest.exports['./client'], './lib/client.js')
assert.ok(existsSync(join(root, 'lib/client.js')), 'the client bundle export exists')
assert.ok(existsSync(join(root, manifest.dsh.bundle.patch)), 'the bundle patch exists')
assert.ok(manifest.files.includes('lib'), 'the npm tarball ships lib/')
assert.equal(
  manifest.dsh.compatibility.dsh,
  manifest.engines.dsh,
  'the advisory and enforced dsh ranges agree'
)
for (const release of ['0.2.1-rc.2', '0.2.1-rc.3', '0.2.1-rc.4', '0.2.2-alpha.2']) {
  assert.equal(
    manifest.dsh.compatibility.dshReleases[release],
    'compatible',
    `${release} is declared compatible`
  )
}

console.log('smoke-client: ok — Plugins page slot, font modes, teardown and manifest all behave')
