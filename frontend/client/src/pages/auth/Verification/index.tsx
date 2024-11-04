import { FC, useEffect, useState, useRef, } from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  QueryLink
} from "@/components"

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Password } from "primereact/password"
import { Divider } from 'primereact/divider'

import { IconField } from 'primereact/iconfield'

import { InputIcon } from 'primereact/inputicon'

import { classNames } from 'primereact/utils'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  store,
  actions,
  useTrackedStore,
  useStore,
} from "@/store"

import './index.sass'

import {
  User,
  FrontUser,
} from '@/types'

import {
  app_routes,
} from '@/constants/router'

import {
  useTranslations,
  useTranslationsSkeleton,
} from "@/hooks"

import { icon_classes } from "@/constants/icon_classes"

import { Helmet } from "react-helmet"
import { useDebounceCallback } from "usehooks-ts"

export const Verification: FC = () => {

  const navigate = useNavigate()

  const verification_codeRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<Password>(null)

  const language = useStore().translations.language()

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError } = useForm<User>({
    defaultValues: {
      verification_code: '',
      password: '',
      rememberme: store.persistedApp.rememberme(),
    }
  })

  const [translations] = useTranslations([
    'verification_code',
    'password',
    'create_password',
    'sitename',
    'wrong_otp',
    'we_have_sent_otp',
    'something_went_wrong_try_again',
  ] as const, true)

  const translations_skl = useTranslationsSkeleton({
    'create_password': ['w-7',],
    "verification_code": ['w-6'],
    'remember_me': ['w-7rem'],
    'login': ['w-2', 'font-semibold'],
    'strong_password_consits_of': ['w-5'],
    'at_least_one_lowercase_letter': ['w-5'],
    'at_least_one_uppercase_letter': ['w-5'],
    'at_least_one_numeric': ['w-5'],
    'minimum_8_characters': ['w-5'],
    'password_strength': ['w-4'],
    'confirm_and_signin': ['w-5'],
    'resend_verification_code': ['w-5'],
    'already_have_account': ['w-5'],
    'please_create_password': ['w-6'],
    'please_create_strong_password': ['w-6'],
    'please_enter': ['w-3'],
    'from_email': ['w-2'],
    'weak': ['w-2'],
    'medium': ['w-3'],
    'strong': ['w-3'],
  }, true)

  const onSubmit: SubmitHandler<User> = useDebounceCallback(async (form) => {
    //console.log('form submit : ', form)

    let res = await fetch('/api/v1/auth/verification', {
      method: 'POST',
      body: JSON.stringify({ ...form, email: store.user.email() }),
      headers: {
        'Content-Type': 'arrayBuffer'
      },
    })

    if (res.status == 200) {
      const user = await res.json() as FrontUser
      //console.log('[signup] user : ', user)

      actions.user.update_user_data(user)

      actions.auth.signedin(true)

      navigate(store.session.prev_pathname())

      return
    }

    setError('verification_code', { type: 'custom', message: translations.wrong_otp })

    passwordRef.current?.getOverlay()?.blur()

    verification_codeRef.current?.focus()

  }, 50)

  const [sendingVC, setSendingVC] = useState(false)

  const resendVC = useDebounceCallback(async () => {
    setSendingVC(true)

    let res = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: store.user.email() }),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    switch (res.status) {

      case 200:
        //show VerificationToast
        store.toast['bottom-center']().show({
          severity: 'info',
          summary: 'Verification code',
          detail: translations.we_have_sent_otp,
          closable: true,
          life: 10000
        })

        navigate(app_routes.verification)
        break;

      default:

        store.toast['center']().show({
          severity: 'error',
          summary: 'Error',
          detail: translations.something_went_wrong_try_again,
          closable: true,
          life: 1500
        })
        break;
    }

    setSendingVC(false)
  }, 50)

  useEffect(() => {
    if (!store.user.email()) {
      navigate(app_routes.signin, { replace: true })
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{translations.sitename} - {translations.create_password}</title>

        <link rel="canonical" href={`${window.location.origin}/verification?language=${language}`} />

      </Helmet>
      <div className="sm:px-3 md:px-5 min-h-screen flex justify-content-center align-items-center">

        <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round py-5 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

          <div className="text-900 text-xl font-bold mb-3 flex justify-content-center">{translations_skl.create_password}</div>

          <div className="text-600 font-medium mb-5 flex justify-content-center flex-row gap-1">
            {translations_skl.please_enter}
            {translations_skl.verification_code}
            {translations_skl.from_email}
          </div>

          <div className="flex flex-column">

            <Controller
              name="verification_code"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: <div className="flex flex-row gap-1">{translations_skl.please_enter}{translations_skl.verification_code}</div> as unknown as string
                }
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left">
                    <InputIcon className="pi pi-key"></InputIcon>

                    <InputText
                      type="text"
                      id={field.name}
                      //@ts-ignore
                      value={field.value}
                      placeholder={translations.verification_code}
                      className={classNames("w-full mb-1", { 'p-invalid': fieldState.error })}
                      onInput={() => clearErrors('verification_code')}
                      onChange={(e) => field.onChange(e.target.value)}
                      autoComplete="name"
                      ref={verification_codeRef}
                      keyfilter="pnum"
                    />
                  </IconField>

                  <small className={`p-error ml-2 pl-1 mb-2`}>{errors?.[field.name]?.message ?? ' '}</small>
                </>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations_skl.please_create_password,
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                  message: translations_skl.please_create_strong_password,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left">
                    <InputIcon className="pi pi-lock z-2"></InputIcon>

                    <Password
                      ref={passwordRef}
                      inputId={field.name}
                      value={field.value}
                      placeholder={translations.password}

                      onChange={(e) => field.onChange(e.target.value)}

                      toggleMask

                      pt={{
                        root: {
                          className: classNames("w-full mb-1", { 'p-invalid': fieldState.error })
                        },
                        iconField: {
                          root: {
                            className: classNames('w-full'),
                          }
                        },
                        input: (state) => ({
                          style: {
                            paddingLeft: '2.5rem',
                            ...state?.state.overlayVisible ? { boxShadow: 'none' } : {}
                          },
                          autoComplete: 'login-password',
                          className: classNames({
                            'border-noround-top border-top-none': state?.state.overlayVisible,
                            'p-invalid': fieldState.error,
                          }, "w-full")
                        }),
                        panel: () => ({
                          className: 'above px-0 pt-3 pb-0 border-noround-bottom border-primary border-1 border-bottom-none shadow-none'
                        }),
                        meter: () => ({
                          className: 'mt-2 mb-0'
                        }),
                        info: () => ({
                          className: 'px-4'
                        }),
                        showIcon: () => ({
                          className: 'cursor-pointer'
                        }),
                        hideIcon: () => ({
                          className: 'cursor-pointer'
                        })
                      }}

                      footer={
                        <div className="px-4">
                          <div className="mt-0">{translations_skl.strong_password_consits_of}:</div>
                          <ul className="pl-3 ml-3 mt-1 line-height-3">
                            <li>{translations_skl.at_least_one_lowercase_letter}</li>
                            <li>{translations_skl.at_least_one_uppercase_letter}</li>
                            <li>{translations_skl.at_least_one_numeric}</li>
                            <li>{translations_skl.minimum_8_characters}</li>
                          </ul>
                          <Divider className="mb-3 mt-0" />
                        </div>
                      }

                      weakLabel={translations_skl.weak}
                      mediumLabel={translations_skl.medium}
                      strongLabel={translations_skl.strong}

                      promptLabel={translations_skl.password_strength}

                      panelStyle={{ top: 'auto!important', bottom: '0!important' }}
                      appendTo='self'
                    />

                  </IconField>

                  <small className={`p-error ml-2 pl-1 mb-2`}>{errors?.[field.name]?.message ?? ' '}</small>
                </>
              )}
            />

            <div className="flex align-items-center mb-4">
              {
                useTrackedStore().app.isClient()
                  ?

                  <Controller
                    name="rememberme"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Checkbox
                          inputId={field.name}
                          checked={field.value}
                          inputRef={field.ref}
                          className="mr-2"
                          onChange={(e) => {
                            actions.persistedApp.rememberme(!!e.checked)
                            field.onChange(e.checked)
                          }} />
                        <label htmlFor={field.name} className="cursor-pointer">{translations_skl.remember_me}</label>
                      </>
                    )}
                  />
                  : ''
              }
            </div>

            <Button
              type="submit"
              label={translations_skl.confirm_and_signin}
              outlined
              raised
              icon={`${icon_classes} ${isSubmitting ? 'pi-spin pi-sync' : 'pi-sign-in'}`}
              className="w-full mb-4 shadow_on_hover"
              iconPos="right"
              disabled={isSubmitting}
            />

            <Button
              label={translations_skl.resend_verification_code}
              outlined
              raised
              icon={`${icon_classes} ${sendingVC ? 'pi-spin pi-sync' : 'pi-key'}`}
              className="w-full mb-4 shadow_on_hover"
              iconPos="right"
              onClick={resendVC}
              disabled={sendingVC}
            />

            <QueryLink to={app_routes.signin} className="font-medium no-underline text-blue-500 justify-content-center flex flex-row gap-1">
              {translations_skl.already_have_account}
              {translations_skl.login}
            </QueryLink>

          </div>
        </form>
      </div>
    </>
  )
}