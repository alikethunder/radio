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

import { classNames } from 'primereact/utils'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  store,
  actions,
  useTrackedStore,
} from "@/store"

import {
  app_routes,
} from '@/constants/router'

import './index.sass'

import {
  User,
  FrontUser,
} from '@/types'

export const Signup: FC = () => {
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)

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
      //@ts-ignore
      (Object.entries(user)).forEach(entry => (actions.user[entry[0]])(entry[1]));

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

  return (
    <div className="sm:px-3 md:px-5 min-h-screen flex justify-content-center align-items-center">

      <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round py-5 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

        <div className="text-900 text-xl font-bold mb-5 flex justify-content-center">Registration</div>

        <div className="flex flex-column">

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Please, enter your name' }}
            render={({ field, fieldState }) => (
              <>
                <span className="p-input-icon-left w-full mb-1">
                  <i className="pi pi-user"></i>

                  <InputText
                    type="text"
                    id={field.name}
                    value={field.value}
                    placeholder="User name"
                    className={classNames("w-full", { 'p-invalid': fieldState.error })}
                    onChange={(e) => field.onChange(e.target.value)}
                    autoComplete="name"
                  />
                </span>

                <small className={`p-error ml-2 pl-1 mb-${errors?.[field.name]?.message ? '2' : '4'}`}>{errors?.[field.name]?.message ?? ' '}</small>
              </>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Please, enter an e-mail',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please, enter your real e-mail",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <span className="p-input-icon-left w-full mb-1">
                  <i className="pi pi-envelope"></i>

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
                  />
                </span>

                <small className={`p-error ml-2 pl-1 mb-${errors?.[field.name]?.message ? '2' : '4'}`}>{errors?.[field.name]?.message ?? ' '}</small>
              </>
            )}
          />

          <div className="flex align-items-center justify-content-between mb-6">
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
            label="Sign Up"
              outlined
              raised
            icon={`pi ${isSubmitting ? 'pi-spin pi-sync' : 'pi-send'}`}
            className="w-full mb-4 shadow_on_hover"
            iconPos="right"
            disabled={isSubmitting}
          />

          <GoogleOAuth rememberme={watch('rememberme')} />

          <QueryLink to={app_routes.signin} className="font-medium no-underline ml-2 text-blue-500 align-self-center">
            Already have an account? <span className="font-semibold">
              Log in
            </span>
          </QueryLink>

        </div>
      </form>
    </div>
  )
}