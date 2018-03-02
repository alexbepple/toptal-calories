import * as r from 'ramda'
import { input } from 'util/react-inputs'

import * as http from 'flakes/http'
import { createRegisteredValueSignal } from 'flakes/signals'

import * as logic from './logic'

const dailyLimit$ = createRegisteredValueSignal(0)

export const exceedsLimit = x => logic.exceeds(x, dailyLimit$())

export const DailyLimitEditor = () =>
  input({
    style: { width: '5em' },
    type: 'number',
    value: dailyLimit$(),
    onChange: e => dailyLimit$(r.defaultTo(0, e.target.valueAsNumber))
  })

export const refreshDailyLimit = () =>
  http.get('/daily-limit').then(dailyLimit$)
