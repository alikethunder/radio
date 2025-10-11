import { FC, useRef } from "react"

import {
  useNavigate,
} from "react-router-dom"

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Password } from "primereact/password"

import { IconField } from 'primereact/iconfield'

import { InputIcon } from 'primereact/inputicon'

import {
  QueryLink,
  GoogleOAuth,
} from "@/components"

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
  route_attributes,
} from '@/constants/router'

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
import { useDebounceCallback } from "usehooks-ts"
import { get_api_origin } from "@/functions"

type SigninUser = (Pick<User, 'password' | 'name' | 'email' | 'rememberme'>)

export const Signin: FC = () => {

  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<Password>(null)

  const language = useStore().translations.language()

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError, watch } = useForm<SigninUser>({
    defaultValues: {
      password: '',
      email: '',
      rememberme: store.persistedApp.rememberme(),
    }
  })

  const [translations] = useTranslations([
    'error_email_with_@',
    'signin',
    'password',
    'sitename',
    'wrong_password',
    'user_not_exist',
    'something_went_wrong_try_again',
  ], true)

  const translations_skl = useTranslationsSkeleton({
    'error_email_required': ['w-8'],
    'error_not_real_email': ['w-8'],
    'error_password_required': ['w-8'],
    'error_password_incorrect': ['w-8'],
    'remember_me': ['w-6rem'],
    'forgot_your_password': ['w-8rem'],
    'login': ['w-5'],
    'dont_have_account': ['w-5'],
    'create_today': ['w-3', 'font-semibold'],
    'signin': ['w-4'],
  }, true)

  const onSubmit: SubmitHandler<SigninUser> = useDebounceCallback(async (form) => {
    console.log('form submit : ', form)

    let res = await fetch(`${get_api_origin()}/api/v1/auth/signin`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    switch (res.status) {
      case 200:
        const user = await res.json() as FrontUser
        //console.log('[signin] user : ', user)

        actions.user.update_user_data(user)

        actions.user.email(form.email)

        actions.auth.signedin(true)

        console.log('[Signin] navigate')
        navigate(store.session.prev_pathname())
        break;

      case 401: //wrong password

        setError('password', { type: 'custom', message: translations.wrong_password })
        passwordRef.current?.focus()
        break;

      case 403: //user not exist

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
        break;
    }

  }, 50)

  return (
    <>
      <Helmet>
        <title>{translations.sitename} - {translations.signin}</title>

        <link rel="canonical" href={`${get_api_origin()}/signin?language=${language}`} />

      </Helmet>

      <div className="sm:px-3 md:px-5 flex justify-content-center align-items-center flex-grow-1">

        <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round pb-5 pt-6 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

          <div className="text-900 text-xl font-bold mb-5 flex justify-content-center">{translations_skl.signin}</div>

          <div className="flex flex-column">

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

            <Controller
              name="password"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: translations_skl.error_password_required,
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                  message: translations_skl.error_password_incorrect,
                }
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left" className="mb-1">
                    <InputIcon className="pi pi-lock z-2"></InputIcon>

                    <Password
                      ref={passwordRef}
                      inputId={field.name}
                      value={field.value}
                      /* type={`${showPass ? 'text' : 'password'}`}  */
                      placeholder={translations.password}

                      onChange={(e) => field.onChange(e.target.value)}

                      toggleMask

                      pt={{
                        root: {
                          className: classNames("w-full", { 'p-invalid': fieldState.error })
                        },
                        iconField: {
                          root: {
                            className: classNames('w-full'),
                          }
                        },
                        input: {
                          style: {
                            paddingLeft: '2.2rem',
                          },
                          autoComplete: 'login-password',
                          className: classNames("w-full", { 'p-invalid': fieldState.error })
                        },
                        showIcon: {
                          className: 'cursor-pointer'
                        },
                        hideIcon: {
                          className: 'cursor-pointer'
                        }
                      }}

                      feedback={false}

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
              label={translations_skl.login}
              outlined
              raised
              icon={`${icon_classes} ${isSubmitting ? 'pi-spin pi-sync' : route_attributes[app_routes.signin].icon}`}
              className="w-full mb-4 shadow_on_hover"
              iconPos="right"
            />

            <GoogleOAuth rememberme={watch('rememberme')} />

            <QueryLink to={app_routes.signup} className="font-medium no-underline ml-2 text-blue-500 justify-content-center flex flex-row gap-1">
              {translations_skl.dont_have_account}
              {translations_skl.create_today}
            </QueryLink>

          </div>
        </form>
      </div>
    </>
  )
}