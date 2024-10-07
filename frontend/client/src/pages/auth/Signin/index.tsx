import { FC, useEffect, useRef } from "react"

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

import { Translation } from "@/layout parts"

type SigninUser = (Pick<User, 'password' | 'name' | 'email' | 'rememberme'>)

export const Signin: FC = () => {

  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<Password>(null)

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError, watch } = useForm<SigninUser>({
    defaultValues: {
      password: '',
      email: '',
      rememberme: store.persistedApp.rememberme(),
    }
  })

  const onSubmit: SubmitHandler<SigninUser> = async (form) => {
    //console.log('form submit : ', form)

    let res = await fetch('/api/v1/auth/signin', {
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

        navigate(store.app.prev_pathname())
        break;

      case 401: //wrong password

        setError('password', { type: 'custom', message: 'Wrong password' })
        passwordRef.current?.focus()
        break;

      case 403: //user not exist

        setError('email', { type: 'custom', message: 'User with such email doesn\'t exist' })
        emailRef.current?.focus()
        break;

      default:

        store.toast['center']().show({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong, please try again later',
          closable: true,
          life: 1500
        })
        break;
    }

  }

  return (
    <>
      <div className="sm:px-3 md:px-5 flex justify-content-center align-items-center flex-grow-1">

        <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round pb-5 pt-6 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

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
                      placeholder="E-mail"
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

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Please, enter your password',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                  message: 'Please enter the correct password'
                }
              }}
              render={({ field, fieldState }) => (
                <>
                  <IconField iconPosition="left">
                    <InputIcon className="pi pi-lock z-2"></InputIcon>

                    <Password
                      ref={passwordRef}
                      inputId={field.name}
                      value={field.value}
                      /* type={`${showPass ? 'text' : 'password'}`}  */
                      placeholder="Password"

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
                          autoComplete: 'current-password',
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
                          <label htmlFor={field.name} className="cursor-pointer">Remember me</label>
                        </>
                      )}
                    />
                    : ''
                }

              </div>
              <QueryLink to={app_routes.reset_password} className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</QueryLink>
            </div>

            <Button
              type="submit"
              label={<Translation field="login" className="w-6"/>}
              outlined
              raised
              icon={`${icon_classes} ${isSubmitting ? 'pi-spin pi-sync' : route_attributes[app_routes.signin].icon}`}
              className="w-full mb-4 shadow_on_hover"
              iconPos="right"
            />

            <GoogleOAuth rememberme={watch('rememberme')} />

            <QueryLink to={app_routes.signup} className="font-medium no-underline ml-2 text-blue-500 align-self-center">Don't have an account? <span className="font-semibold">Create today!</span></QueryLink>

          </div>
        </form>
      </div>
    </>
  )
}