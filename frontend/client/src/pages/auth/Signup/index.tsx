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

import { classNames } from 'primereact/utils'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  store,
  actions,
} from "@/store"

import './index.sass'

import {
  User,
  FrontUser,
} from '@/types'

export const Signup: FC = () => {
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError } = useForm<User>({
    defaultValues: {
      name: '',
      email: '',
    }
  })

  const onSubmit: SubmitHandler<User> = async (form) => {
    //console.log('form submit : ', form)

    const text = JSON.stringify(form)

    const encodedText = new TextEncoder().encode(text)

    const body = await crypto.subtle.encrypt(
      {
        name: store.auth.name(),
        iv: store.auth.iv() as Uint8Array
      },
      store.auth.importedKey() as CryptoKey,
      encodedText
    )

    let res = await fetch('/auth/signup', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'arrayBuffer'
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
      
      navigate('/verification')
      return
    }

    setError('email', { type: 'custom', message: 'User with this email already exists' })

    emailRef.current?.focus()

  }

  return (
    <div className="sm:px-3 md:px-5 min-h-screen flex justify-content-center align-items-center">

      <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round py-5 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

        <div className="text-900 text-xl font-bold mb-5 flex justify-content-center">Registration1</div>

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

          <Button
            type="submit"
            label="Sign Up"
            icon={`pi ${isSubmitting ? 'pi-spin pi-sync' : 'pi-send'}`}
            className="w-full mb-4"
            iconPos="right"
            disabled={isSubmitting}
          />

          <GoogleOAuth />

          <div className="flex align-items-center justify-content-between mt-1">
            <QueryLink to='/signin' className="font-medium no-underline ml-2 text-blue-500">
              Already have an account? <span className="font-semibold">
                Log in
              </span>
            </QueryLink>

            <QueryLink to='/reset-password' className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</QueryLink>
          </div>

        </div>
      </form>
    </div>
  )
}