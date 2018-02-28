import * as React from 'react'
import { render } from 'react-dom'
import s from 's-js'
import * as r from 'ramda'
import * as _ from 'lodash'
import { ProgressBar } from 'reprogressbars'

import * as z from 'util/s-js'

import {
  NewCaloriesEntry,
  CaloriesEntries,
  fetchEntries,
  persistEntries
} from 'flakes/calories'
import {
  createRegisteredValueSignal,
  getRegisteredSignals
} from 'flakes/signals'

const searchParams = new URLSearchParams(window.location.search.substr(1))
if (searchParams.has('access_token')) {
  fetch('/api/greeting', {
    headers: new Headers({
      Authorization: 'Bearer ' + searchParams.get('access_token')
    })
  })
    .then(x => x.json())
    .then(console.log.bind(console)) // eslint-disable-line
  window.history.pushState({}, '', '/')
}

const entries$ = createRegisteredValueSignal([])
const loading$ = createRegisteredValueSignal(false)

loading$(true)
fetchEntries()
  .then(entries$)
  .finally(() => loading$(false))

const persistEntriesDebounced = _.debounce(persistEntries, 500)
s.root(() =>
  s.on(entries$, () => {
    if (!loading$()) persistEntriesDebounced(entries$())
  })
)

const App = () => (
  <React.Fragment>
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100%' }}>
      <ProgressBar isLoading={loading$()} />
    </div>
    <section>
      <h2>Add Entry</h2>
      <NewCaloriesEntry onAdd={x => z.evolve(r.append(x), entries$)} />
    </section>
    <section>
      <h2>Entries</h2>
      <CaloriesEntries entries$={entries$} />
    </section>
  </React.Fragment>
)

s.root(() =>
  s.on(getRegisteredSignals(), () =>
    render(<App />, document.getElementById('root'))
  )
)
