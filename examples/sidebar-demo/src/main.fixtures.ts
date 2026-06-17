import { AppMenu } from '@foldstylex/foldkit'

import { init, type Model } from './main.js'

export const demoModel: Model = init()[0]

export const withOpenAppMenu = (model: Model): Model => {
  const [appMenu] = AppMenu.open(model.appMenu)
  return { ...model, appMenu }
}