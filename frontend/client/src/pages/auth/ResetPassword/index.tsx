import { FC, useRef, useEffect, createRef, useState } from "react"

import {
  useNavigate,
} from "react-router-dom"

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Password } from "primereact/password"
import { Toast, ToastMessage } from 'primereact/toast'

import {
  QueryLink
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
} from '@/constants/router'

import {
  User
} from '@/types'

type SigninUser = { [Property in keyof User as Exclude<Property, "name" | "id">]: User[Property] }

export const ResetPassword: FC = () => {

  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError } = useForm<SigninUser>({
    defaultValues: {
      email: '',
    }
  })

  const onSubmit: SubmitHandler<SigninUser> = async (form) => {
    //console.log('form submit : ', form)

    let res = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    switch (res.status) {

      case 200:
        actions.user.email(form.email)
        //show VerificationToast
        store.toast['bottom-center']().show({
          severity: 'info',
          summary: 'Verification code',
          detail: 'We\'ve sent the 8-digit verification code to your email',
          closable: true,
          life: 10000
        })

        navigate(app_routes.verification)
        break;

      case 403:

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
      <div className="sm:px-3 md:px-5 min-h-screen flex justify-content-center align-items-center">

        <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round py-5 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

          <div className="text-900 text-xl font-bold mb-5 flex justify-content-center">Reset password</div>

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

                      onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Enter an email that contains "@" Example: info@roshni.nl')}

                    />
                  </span>

                  <small className={`p-error ml-2 pl-1 mb-${errors?.[field.name]?.message ? '2' : '4'}`}>{errors?.[field.name]?.message ?? ' '}</small>
                </>
              )}
            />

            <Button
              type="submit"
              label="Send 8-digit verification code"
              icon={`pi ${isSubmitting ? 'pi-spin pi-sync' : 'pi-send'}`}
              className="w-full mb-4"
              iconPos="right"
            />

            <QueryLink to={app_routes.signin} className="font-medium no-underline text-blue-500 text-right cursor-pointer align-self-center mb-4">Remember your password? <span className="font-semibold">Log in</span></QueryLink>

            <QueryLink to={app_routes.signup} className="font-medium no-underline  text-blue-500 align-self-center">Don't have an account? <span className="font-semibold">Create today!</span></QueryLink>

          </div>
        </form>
      </div>
    </>
  )
}