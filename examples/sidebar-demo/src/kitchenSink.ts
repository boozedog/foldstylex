import { Schema as S } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { Tabs as UiTabs } from '@foldkit/ui'

import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  Field,
  Input,
  Separator,
  Switch,
  Tabs,
  Toast,
  elAttrs,
  sxAttrs,
} from '@foldstylex/foldkit'
import { cardStyles } from '@foldstylex/styles'

import type { Message, Model } from './main.js'

export const KitchenTabs = Tabs.create<'Account' | 'Password' | 'Notifications'>()
export const KitchenToast = Toast.create()

export const UpdatedEmailValue = m('UpdatedEmailValue', { value: S.String })

export const ClickedOpenKitchenDialog = m('ClickedOpenKitchenDialog')
export const GotKitchenDialogMessage = m('GotKitchenDialogMessage', {
  message: Dialog.Message,
})
export const GotTermsCheckboxMessage = m('GotTermsCheckboxMessage', {
  message: Checkbox.Message,
})
export const GotMarketingCheckboxMessage = m('GotMarketingCheckboxMessage', {
  message: Checkbox.Message,
})
export const GotNotificationsSwitchMessage = m('GotNotificationsSwitchMessage', {
  message: Switch.Message,
})
export const GotKitchenTabsMessage = m('GotKitchenTabsMessage', {
  message: UiTabs.Message,
})
export const GotKitchenToastMessage = m('GotKitchenToastMessage', {
  message: KitchenToast.Message,
})
export const ClickedShowInfoToast = m('ClickedShowInfoToast')
export const ClickedShowSuccessToast = m('ClickedShowSuccessToast')

const kitchenTabPanels = (tab: 'Account' | 'Password' | 'Notifications'): Html => {
  const h = html<Message>()

  switch (tab) {
    case 'Account':
      return h.p(
        elAttrs<Message>(sxAttrs(h, cardStyles.description)),
        ['Make changes to your account here. Click save when you are done.'],
      )
    case 'Password':
      return h.p(
        elAttrs<Message>(sxAttrs(h, cardStyles.description)),
        ['Change your password here. After saving, you will be logged out.'],
      )
    case 'Notifications':
      return h.p(
        elAttrs<Message>(sxAttrs(h, cardStyles.description)),
        ['Configure how you receive notifications.'],
      )
  }
}

export const view = (model: Model): Html => {
  const h = html<Message>()

  return h.div(
    elAttrs<Message>(sxAttrs(h, cardStyles.page)),
    [
      h.div(
        elAttrs<Message>(sxAttrs(h, cardStyles.pageInner)),
        [
          h.header(
            elAttrs<Message>(sxAttrs(h, cardStyles.pageHeader)),
            [
              h.h1(
                elAttrs<Message>(sxAttrs(h, cardStyles.pageTitle)),
                ['Components'],
              ),
              h.p(
                elAttrs<Message>(sxAttrs(h, cardStyles.pageDescription)),
                [
                  'A kitchen sink of foldstylex primitives styled to match shadcn radix-nova.',
                ],
              ),
            ],
          ),
          h.div(
            elAttrs<Message>(sxAttrs(h, cardStyles.sectionStack)),
            [
              buttonsCard(h),
              badgesCard(h),
              formCard(h, model),
              controlsCard(h, model),
              dialogCard(h, model),
              tabsCard(h, model),
              toastCard(h, model),
              displayCard(h),
            ],
          ),
        ],
      ),
      h.submodel({
        slotId: model.kitchenToast.id,
        model: model.kitchenToast,
        view: KitchenToast.view,
        viewInputs: KitchenToast.styledViewInputs({ ariaLabel: 'Notifications' }),
        toParentMessage: message => GotKitchenToastMessage({ message }),
      }),
    ],
  )
}

const buttonsCard = (h: ReturnType<typeof html<Message>>): Html =>
  Card.root([
    Card.header([
      Card.title('Buttons'),
      Card.description('Variant and size combinations from foldstylex.'),
    ]),
    Card.content([
      h.div(
        elAttrs<Message>(sxAttrs(h, cardStyles.row)),
        [
          Button.view<Message>({ label: 'Default' }),
          Button.view<Message>({ label: 'Secondary', variant: 'secondary' }),
          Button.view<Message>({ label: 'Destructive', variant: 'destructive' }),
          Button.view<Message>({ label: 'Outline', variant: 'outline' }),
          Button.view<Message>({ label: 'Ghost', variant: 'ghost' }),
          Button.view<Message>({ label: 'Link', variant: 'link' }),
        ],
      ),
      h.div(
        elAttrs<Message>(sxAttrs(h, cardStyles.row)),
        [
          Button.view<Message>({ label: 'Small', size: 'sm' }),
          Button.view<Message>({
            label: 'Small outline',
            size: 'sm',
            variant: 'outline',
          }),
          Button.view<Message>({
            label: 'Disabled',
            isDisabled: true,
          }),
        ],
      ),
    ]),
  ])

const badgesCard = (h: ReturnType<typeof html<Message>>): Html =>
  Card.root([
    Card.header([
      Card.title('Badges'),
      Card.description('Status and metadata chips.'),
    ]),
    Card.content([
      h.div(
        elAttrs<Message>(sxAttrs(h, cardStyles.row)),
        [
          Badge.view({ label: 'Default' }),
          Badge.view({ label: 'Secondary', variant: 'secondary' }),
          Badge.view({ label: 'Destructive', variant: 'destructive' }),
          Badge.view({ label: 'Outline', variant: 'outline' }),
        ],
      ),
    ]),
  ])

const formCard = (
  h: ReturnType<typeof html<Message>>,
  model: Model,
): Html =>
  Card.root([
    Card.header([
      Card.title('Form'),
      Card.description('Labeled inputs wired through Foldkit MVU.'),
    ]),
    Card.content([
      Input.view<Message>({
        id: 'kitchen-sink-email',
        label: 'Email',
        value: model.emailValue,
        onInput: value => UpdatedEmailValue({ value }),
        placeholder: 'm@example.com',
        description: 'We will never share your email with anyone.',
      }),
      Input.view<Message>({
        id: 'kitchen-sink-disabled',
        label: 'Disabled',
        value: 'Read only',
        isDisabled: true,
        description: 'This field cannot be edited.',
      }),
    ]),
  ])

const controlsCard = (h: ReturnType<typeof html<Message>>, model: Model): Html =>
  Card.root([
    Card.header([
      Card.title('Controls'),
      Card.description('Checkbox and switch fields using the shared Field layout.'),
    ]),
    Card.content([
      h.submodel({
        slotId: model.termsCheckbox.id,
        model: model.termsCheckbox,
        view: Checkbox.view,
        viewInputs: Checkbox.styledViewInputs(model.termsCheckbox, {
          label: 'Accept terms and conditions',
          description:
            'You agree to our Terms of Service and Privacy Policy.',
        }),
        toParentMessage: message => GotTermsCheckboxMessage({ message }),
      }),
      h.submodel({
        slotId: model.marketingCheckbox.id,
        model: model.marketingCheckbox,
        view: Checkbox.view,
        viewInputs: Checkbox.styledViewInputs(model.marketingCheckbox, {
          label: 'Marketing emails',
          description: 'Receive emails about new products and features.',
        }),
        toParentMessage: message => GotMarketingCheckboxMessage({ message }),
      }),
      h.submodel({
        slotId: model.notificationsSwitch.id,
        model: model.notificationsSwitch,
        view: Switch.view,
        viewInputs: Switch.styledViewInputs(model.notificationsSwitch, {
          label: 'Push notifications',
          description: 'Send notifications to your device.',
        }),
        toParentMessage: message => GotNotificationsSwitchMessage({ message }),
      }),
    ]),
  ])

const dialogCard = (h: ReturnType<typeof html<Message>>, model: Model): Html =>
  Card.root([
    Card.header([
      Card.title('Dialog'),
      Card.description('Modal overlay with title, description, and actions.'),
    ]),
    Card.content([
      Button.view<Message>({
        label: 'Open dialog',
        variant: 'outline',
        onClick: ClickedOpenKitchenDialog(),
      }),
      h.submodel({
        slotId: model.kitchenDialog.id,
        model: model.kitchenDialog,
        view: Dialog.view,
        viewInputs: Dialog.styledViewInputs({
          id: model.kitchenDialog.id,
          title: 'Edit profile',
          description:
            'Make changes to your profile here. Click save when you are done.',
          panelSize: 'sm',
          showClose: true,
          footer: [
            Button.view<Message>({
              label: 'Cancel',
              variant: 'outline',
              onClick: GotKitchenDialogMessage({
                message: Dialog.RequestedClose(),
              }),
            }),
            Button.view<Message>({
              label: 'Save changes',
              onClick: GotKitchenDialogMessage({
                message: Dialog.RequestedClose(),
              }),
            }),
          ],
        }),
        toParentMessage: message => GotKitchenDialogMessage({ message }),
      }),
    ]),
  ])

const tabsCard = (h: ReturnType<typeof html<Message>>, model: Model): Html =>
  Card.root([
    Card.header([
      Card.title('Tabs'),
      Card.description('Segmented navigation for related panel content.'),
    ]),
    Card.content([
      h.submodel({
        slotId: model.kitchenTabs.id,
        model: model.kitchenTabs,
        view: KitchenTabs.view,
        viewInputs: KitchenTabs.styledViewInputs({
          tabs: ['Account', 'Password', 'Notifications'],
          ariaLabel: 'Account settings',
          renderPanel: kitchenTabPanels,
        }),
        toParentMessage: message => GotKitchenTabsMessage({ message }),
      }),
    ]),
  ])

const toastCard = (h: ReturnType<typeof html<Message>>, _model: Model): Html =>
  Card.root([
    Card.header([
      Card.title('Toast'),
      Card.description('Transient notifications that auto-dismiss.'),
    ]),
    Card.content([
      h.div(
        elAttrs<Message>(sxAttrs(h, cardStyles.row)),
        [
          Button.view<Message>({
            label: 'Show info',
            variant: 'outline',
            onClick: ClickedShowInfoToast(),
          }),
          Button.view<Message>({
            label: 'Show success',
            variant: 'outline',
            onClick: ClickedShowSuccessToast(),
          }),
        ],
      ),
    ]),
  ])

const displayCard = (h: ReturnType<typeof html<Message>>): Html =>
  Card.root([
    Card.header([
      Card.title('Display'),
      Card.description('Avatar, separator, and other static elements.'),
    ]),
    Card.content([
      h.div(
        elAttrs<Message>(sxAttrs(h, cardStyles.row)),
        [
          Avatar.view({
            fallback: 'CN',
            imageSrc: 'https://ui.shadcn.com/avatars/shadcn.jpg',
            imageAlt: 'shadcn',
            shape: 'lg',
          }),
          Avatar.view({ fallback: 'AB', size: 'sm' }),
          Avatar.view({ fallback: 'XL', size: 'lg' }),
        ],
      ),
      Separator.view(),
      h.p(
        elAttrs<Message>(sxAttrs(h, cardStyles.description)),
        ['Content below a horizontal separator.'],
      ),
      Field.group<Message>({
        children: [
          Field.label('Standalone field label'),
        ],
      }),
    ]),
  ])