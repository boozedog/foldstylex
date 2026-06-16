import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { Schema as S } from 'effect'
import { m } from 'foldkit/message'

import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Separator,
  elAttrs,
  sxAttrs,
} from '@foldstylex/foldkit'
import { cardStyles } from '@foldstylex/styles'

import type { Message, Model } from './main.js'

export const UpdatedEmailValue = m('UpdatedEmailValue', { value: S.String })

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
              displayCard(h),
            ],
          ),
        ],
      ),
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
    ]),
  ])