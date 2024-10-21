import { FC, useRef } from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  QueryLink,
  GoogleOAuth,
} from "@/components"

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'

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

import {
  app_routes,
} from '@/constants/router'

import './index.sass'

import {
  User,
  FrontUser,
} from '@/types'

import { icon_classes } from "@/constants/icon_classes"

import {
  useTranslations,
  useTranslationsSkeleton,
} from "@/hooks"

import { Helmet } from "react-helmet"

export const Signup: FC = () => {
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)

  const language = useStore().persistedApp.language()

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError, watch } = useForm<User>({
    defaultValues: {
      name: '',
      email: '',
    }
  })

  const onSubmit: SubmitHandler<User> = async (form) => {
    //console.log('form submit : ', form)

    let res = await fetch('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (res.status == 200) {
      const user = await res.json() as FrontUser
      //console.log('[signup] user : ', user)

      actions.user.update_user_data(user)

      //show VerificationToast
      store.toast['bottom-center']().show({
        severity: 'info',
        summary: 'Verification code',
        detail: 'We\'ve sent the 8-digit verification code to your email',
        closable: true,
        life: 10000
      })

      navigate(app_routes.verification)
      return
    }

    setError('email', { type: 'custom', message: 'User with this email already exists' })

    emailRef.current?.focus()

  }

  const [translations] = useTranslations([
    'error_email_with_@',
    'name',
    'name_cannot_be_empty',
    'registration',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    'registration': ['w-5'],
    'error_email_required': ['w-8'],
    'error_not_real_email': ['w-8'],
    'remember_me': ['w-6rem'],
    'forgot_your_password': ['w-8rem'],
    'signup': ['w-6'],
    'already_have_account': ['w-5'],
    'login': ['w-2', 'font-semibold'],
  }, true)

  return (
    <>
      <Helmet>
        <title>RadioWorld - {translations.registration}</title>

        <link rel="canonical" href={`${window.location.origin}/signin?language=${language}`} />

      </Helmet>

      <div className="sm:px-3 md:px-5 flex justify-content-center align-items-center flex-grow-1">

        <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round pb-5 pt-6 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

          <div className="text-900 text-xl font-bold mb-5 flex justify-content-center">{translations_skl.registration}</div>

          <div className="flex flex-column">

            <Controller
              name="name"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations.name_cannot_be_empty,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left" className="mb-1">
                    <InputIcon className="pi pi-user"></InputIcon>

                    <InputText
                      type="text"
                      id={field.name}
                      value={field.value}
                      placeholder={translations.name}
                      className={classNames("w-full", { 'p-invalid': fieldState.error })}
                      onChange={(e) => field.onChange(e.target.value)}
                      autoComplete="name"
                    />
                  </IconField>

                  <small className={`p-error ml-2 pl-1 mb-2`}>{errors?.[field.name]?.message ?? ' '}</small>
                </>
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations_skl.error_email_required,
                },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: translations_skl.error_not_real_email,
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left" className="mb-1">
                    <InputIcon className="pi pi-envelope"></InputIcon>

                    <InputText
                      ref={emailRef}
                      type="email"
                      id={field.name}
                      value={field.value}
                      placeholder="Email"
                      className={classNames("w-full", { 'p-invalid': fieldState.error })}
                      onInput={() => clearErrors('email')}
                      onChange={(e) => field.onChange(e.target.value)}
                      autoComplete="email"

                      onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(translations['error_email_with_@'])}
                    />
                  </IconField>

                  <small className={`p-error ml-2 pl-1 mb-2`}>{errors?.[field.name]?.message ?? ' '}</small>
                </>
              )}
            />

            <div className="flex align-items-center justify-content-between mb-5">
              <div className="flex align-items-center">

                {
                  useTrackedStore().app.isClient()
                    ?

                    <Controller
                      name="rememberme"
                      control={control}
                      render={({ field }) => (
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
              <QueryLink to={app_routes.reset_password} className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">{translations_skl.forgot_your_password}</QueryLink>
            </div>

            <Button
              type="submit"
              label={translations_skl.signup}
              outlined
              raised
              icon={`${icon_classes} ${isSubmitting ? 'pi-spin pi-sync' : 'pi-address-book'}`}
              className="w-full mb-4 shadow_on_hover"
              iconPos="right"
              disabled={isSubmitting}
            />

            <GoogleOAuth rememberme={watch('rememberme')} />

            <QueryLink to={app_routes.signin} className="font-medium no-underline ml-2 text-blue-500 justify-content-center flex flex-row gap-1">
              {translations_skl.already_have_account}
              {translations_skl.login}
            </QueryLink>

          </div>
        </form>
      </div>
    </>
  )
}