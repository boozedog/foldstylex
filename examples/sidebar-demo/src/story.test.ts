import { Menu } from '@foldkit/ui'
import { AppMenu } from '@foldstylex/foldkit'
import * as Story from 'foldkit/story'
import { describe, expect, it } from '@effect/vitest'

import {
  ClickedInertSubItem,
  ClickedOpenMobileMenu,
  ClickedPlaygroundSub,
  ClickedProject,
  ClickedSidebarTrigger,
  GotAppMenuMessage,
  GotTeamMenuMessage,
  update,
} from './main.js'
import { demoModel, withOpenAppMenu } from './main.fixtures.js'

describe('sidebar-demo update', () => {
  it('closes the app menu and sets the active project on nav click', () => {
    Story.story(
      update,
      Story.with(withOpenAppMenu(demoModel)),
      Story.message(ClickedProject({ id: 'design-engineering' })),
      Story.model(model => {
        expect(model.appMenu.isOpen).toBe(false)
        expect(model.activeProject).toBe('design-engineering')
      }),
      Story.Command.expectNone(),
    )
  })

  it('closes the app menu when a playground sub-item is selected', () => {
    Story.story(
      update,
      Story.with(withOpenAppMenu(demoModel)),
      Story.message(ClickedPlaygroundSub({ id: 'history' })),
      Story.model(model => {
        expect(model.appMenu.isOpen).toBe(false)
        expect(model.activePlaygroundSub).toBe('history')
      }),
      Story.Command.expectNone(),
    )
  })

  it('closes the app menu from inert sub-item clicks', () => {
    Story.story(
      update,
      Story.with(withOpenAppMenu(demoModel)),
      Story.message(ClickedInertSubItem()),
      Story.model(model => {
        expect(model.appMenu.isOpen).toBe(false)
      }),
      Story.Command.expectNone(),
    )
  })

  it('opens the mobile app menu from the header trigger', () => {
    Story.story(
      update,
      Story.with(demoModel),
      Story.message(ClickedOpenMobileMenu()),
      Story.model(model => {
        expect(model.appMenu.isOpen).toBe(true)
      }),
      Story.Command.expectNone(),
    )
  })

  it('updates the active team when a team menu item is selected', () => {
    Story.story(
      update,
      Story.with(demoModel),
      Story.message(
        GotTeamMenuMessage({
          message: Menu.SelectedItem({ index: 1, item: 'acme-corp' }),
        }),
      ),
      Story.Command.resolve(
        Menu.FocusButton,
        Menu.CompletedFocusButton(),
        message => GotTeamMenuMessage({ message }),
      ),
      Story.model(model => {
        expect(model.activeTeam).toBe('acme-corp')
      }),
      Story.Command.expectNone(),
    )
  })

  it('keeps the active team when add-team is selected', () => {
    Story.story(
      update,
      Story.with(demoModel),
      Story.message(
        GotTeamMenuMessage({
          message: Menu.SelectedItem({ index: 3, item: 'add-team' }),
        }),
      ),
      Story.Command.resolve(
        Menu.FocusButton,
        Menu.CompletedFocusButton(),
        message => GotTeamMenuMessage({ message }),
      ),
      Story.model(model => {
        expect(model.activeTeam).toBe('acme-inc')
      }),
      Story.Command.expectNone(),
    )
  })

  it('toggles desktop sidebar visibility', () => {
    Story.story(
      update,
      Story.with(demoModel),
      Story.message(ClickedSidebarTrigger()),
      Story.model(model => {
        expect(model.sidebarOpen).toBe(false)
      }),
      Story.message(ClickedSidebarTrigger()),
      Story.model(model => {
        expect(model.sidebarOpen).toBe(true)
      }),
      Story.Command.expectNone(),
    )
  })

  it('forwards app menu close messages into the submodel', () => {
    Story.story(
      update,
      Story.with(withOpenAppMenu(demoModel)),
      Story.message(
        GotAppMenuMessage({
          message: AppMenu.RequestedClose({ role: 'backdrop' }),
        }),
      ),
      Story.model(model => {
        expect(model.appMenu.isOpen).toBe(false)
      }),
      Story.Command.expectNone(),
    )
  })
})