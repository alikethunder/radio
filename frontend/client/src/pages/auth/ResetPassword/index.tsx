import { FC, useRef, } from "react"

import {
  useNavigate,
} from "react-router-dom"

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

import { IconField } from 'primereact/iconfield'

import { InputIcon } from 'primereact/inputicon'

import {
  QueryLink
} from "@/components"

import { classNames } from 'primereact/utils'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  store,
  actions,
  useStore,
} from "@/store"

import {
  app_routes,
} from '@/constants/router'

import {
  User
} from '@/types'

import { icon_classes } from "@/constants/icon_classes"

import {
  useTranslations,
  useTranslationsSkeleton,
} from "@/hooks"

import { Helmet } from "react-helmet"
import { useDebounceCallback } from "usehooks-ts"
import { reset_password } from "@/API/auth/reset_password"
import { get_api_origin } from "@/functions"

type ResetPasswordUser = (Pick<User, 'email'>)

export const ResetPassword: FC = () => {

  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)

  const language = useStore().translations.language()

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError } = useForm<ResetPasswordUser>({
    defaultValues: {
      email: '',
    }
  })

  const [translations] = useTranslations([
    'error_email_with_@',
    'signin',
    'reset_password',
    'sitename',
    'we_have_sent_otp',
    'user_not_exist',
    'something_went_wrong_try_again',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    'reset_password': ['w-8',],
    'send': ['w-2'],
    "verification_code": ['w-6'],
    'remember_password': ['w-4'],
    'login': ['w-2', 'font-semibold'],
    'dont_have_account': ['w-4'],
    'create_today': ['w-3', 'font-semibold'],
  }, true)

  const onSubmit: SubmitHandler<ResetPasswordUser> = useDebounceCallback(async (form) => {
    //console.log('form submit : ', form)

    let res = await reset_password(form.email)

    switch (res.status) {

      case 200:
        actions.user.email(form.email)
        //show VerificationToast
        store.toast['bottom-center']().show({
          severity: 'info',
          summary: 'Verification code',
          detail: translations.we_have_sent_otp,
          closable: true,
          life: 10000
        })

        console.log('[ResetPassword] navigate')
        navigate(app_routes.verification)
        break;

      case 403:

        setError('email', { type: 'custom', message: translations.user_not_exist })
        emailRef.current?.focus()
        break;

      default:

        store.toast['center']().show({
          severity: 'error',
          summary: 'Error',
          detail: translations.something_went_wrong_try_again,
          closable: true,
          life: 1500
        })
        break
    }

  }, 50)

  return (
    <>
      <Helmet>
        <title>{translations.sitename} - {translations.reset_password}</title>

        <link rel="canonical" href={`${get_api_origin()}/reset-password?language=${language}`} />

      </Helmet>

      <div className="sm:px-3 md:px-5 min-h-screen flex justify-content-center align-items-center">

        <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round py-5 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

          <div className="text-900 text-xl font-bold mb-5 flex justify-content-center">{translations_skl.reset_password}</div>

          <div className="flex flex-column">

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Please, enter your e-mail',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please, enter your real e-mail",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left">
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

                      onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Enter an email that contains "@" Example: info@roshni.nl')}

                    />
                  </IconField>

                  <small className={`p-error ml-2 pl-1 mb-2`}>{errors?.[field.name]?.message ?? ' '}</small>
                </>
              )}
            />

            <Button
              type="submit"
              label={<div className="flex flex-row gap-1 justify-content-center text-sm sm:text-base">{translations_skl.send}{translations_skl.verification_code}</div> as unknown as string}
              outlined
              raised
              icon={`${icon_classes} ${isSubmitting ? 'pi-spin pi-sync' : 'pi-key'}`}
              className="w-full mb-4 shadow_on_hover"
              iconPos="right"
            />

            <QueryLink to={app_routes.signin} className="font-medium no-underline text-blue-500 cursor-pointer justify-content-center mb-4 flex flex-row gap-1">
              {translations_skl.remember_password}
              {translations_skl.login}
            </QueryLink>

            <QueryLink to={app_routes.signup} className="font-medium no-underline text-blue-500 justify-content-center flex flex-row gap-1">
              {translations_skl.dont_have_account}
              {translations_skl.create_today}
            </QueryLink>

          </div>
        </form>
      </div>
    </>
  )
}