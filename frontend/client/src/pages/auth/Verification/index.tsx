import { FC, useMemo, useEffect, createRef, useState, useRef, InputHTMLAttributes } from "react"

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

import { classNames } from 'primereact/utils'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  store,
  actions,
  useTrackedStore,
} from "@/store"

import './index.sass'

import {
  User,
  FrontUser,
} from '@/types'

export const Verification: FC = () => {

  const navigate = useNavigate()

  const verification_codeRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<Password>(null)

  const { handleSubmit, formState: { errors, isSubmitting }, control, clearErrors, setError } = useForm<User>({
    defaultValues: {
      verification_code: '',
      password: '',
      rememberme: store.persistedApp.rememberme(),
    }
  })

  const onSubmit: SubmitHandler<User> = async (form) => {
    //console.log('form submit : ', form)

    let res = await fetch('/auth/verification', {
      method: 'POST',
      body: JSON.stringify({ ...form, email: store.user.email() }),
      headers: {
        'Content-Type': 'arrayBuffer'
      },
    })

    if (res.status == 200) {
      const user = await res.json() as FrontUser
      //console.log('[signup] user : ', user)
      //@ts-ignore
      (Object.entries(user)).forEach(entry => (actions.user[entry[0]])(entry[1]));
      actions.auth.signedin(true)
      navigate('/home')
      return
    }

    setError('verification_code', { type: 'custom', message: 'Wrong verification code' })

    passwordRef.current?.getOverlay()?.blur()

    verification_codeRef.current?.focus()

  }

  const [sendingVC, setSendingVC] = useState(false)

  const resendVC = async () => {
    setSendingVC(true)

    let res = await fetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: store.user.email() }),
      headers: {
        'Content-Type': 'arrayBuffer'
      },
    })

    switch (res.status) {

      case 200:
        //show VerificationToast
        store.toast['bottom-center']().show({
          severity: 'info',
          summary: 'Verification code',
          detail: 'We\'ve sent the 8-digit verification code to your email',
          closable: true,
          life: 10000
        })

        navigate('/verification')
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

    setSendingVC(false)
  }

  useEffect(() => {
    if (!store.user.email()){
      navigate('/signin', {replace: true})
    }
  }, [store.user.email()])

  return (
    <div className="sm:px-3 md:px-5 min-h-screen flex justify-content-center align-items-center">

      <form onSubmit={handleSubmit(onSubmit)} className="sm:border-1 surface-border sm:surface-card border-round py-5 px-4 md:px-5 z-1 sm:shadow-2 w-full md:w-30rem">

        <div className="text-900 text-xl font-bold mb-3 flex justify-content-center">Create password</div>

        <div className="text-600 font-medium mb-5 flex justify-content-center">Please enter 8-digit verification code from e-mail</div>

        <div className="flex flex-column">

          <Controller
            name="verification_code"
            control={control}
            rules={{ required: 'Please, enter verification code' }}
            render={({ field, fieldState }) => (
              <>
                <span className="p-input-icon-left w-full mb-1">
                  <i className="pi pi-key"></i>

                  <InputText
                    type="text"
                    id={field.name}
                    //@ts-ignore
                    value={field.value}
                    placeholder="8-digit verification code"
                    className={classNames("w-full", { 'p-invalid': fieldState.error })}
                    onInput={() => clearErrors('verification_code')}
                    onChange={(e) => field.onChange(e.target.value)}
                    autoComplete="name"
                    ref={verification_codeRef}
                    keyfilter="pnum"
                  />
                </span>

                <small className={`p-error ml-2 pl-1 mb-${errors?.[field.name]?.message ? '2' : '4'}`}>{errors?.[field.name]?.message ?? ' '}</small>
              </>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Please, create a password',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                message: 'Please, create a strong password'
              }
            }}
            render={({ field, fieldState }) => (
              <>
                <span className={`p-input-icon-left w-full mb-1`}>

                  <i className="pi pi-lock z-2"></i>

                  <Password
                    ref={passwordRef}
                    inputId={field.name}
                    value={field.value}
                    placeholder="Password"

                    className={classNames("w-full", { 'p-invalid': fieldState.error })}

                    onChange={(e) => field.onChange(e.target.value)}

                    toggleMask
                    inputClassName={classNames("w-full", { 'p-invalid': fieldState.error })}

                    pt={{
                      input: (state) => ({
                        style: {
                          paddingLeft: '2.5rem',
                          ...state?.state.overlayVisible ? { boxShadow: 'none' } : {}
                        },
                        autoComplete: 'new-password',
                        className: classNames({
                          'border-noround-top border-top-none': state?.state.overlayVisible
                        })
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
                        <div className="mt-0">Strong password consits of:</div>
                        <ul className="pl-3 ml-3 mt-1 line-height-3">
                          <li>At least one lowercase</li>
                          <li>At least one uppercase</li>
                          <li>At least one numeric</li>
                          <li>Minimum 8 characters</li>
                        </ul>
                        <Divider className="mb-3 mt-0" />
                      </div>
                    }

                    weakLabel="Weak"
                    mediumLabel={'Medium'}
                    strongLabel="Strong"

                    promptLabel='Password strength'

                    panelStyle={{ top: 'auto!important', bottom: '0!important' }}
                    appendTo='self'
                  />

                </span>

                <small className={`p-error ml-2 pl-1 mb-${errors?.[field.name]?.message ? '2' : '4'}`}>{errors?.[field.name]?.message ?? ' '}</small>
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
                      <label htmlFor={field.name} className="cursor-pointer">Remember me</label>
                    </>
                  )}
                />
                : ''
            }
          </div>

          <Button
            label="Resend verification code"
            icon={`pi ${sendingVC ? 'pi-spin pi-sync' : 'pi-key'}`}
            className="w-full mb-4"
            iconPos="right"
            onClick={resendVC}
            disabled={sendingVC}
          />

          <Button
            type="submit"
            label="Confirm and sign in"
            icon={`pi ${isSubmitting ? 'pi-spin pi-sync' : 'pi-send'}`}
            className="w-full mb-4"
            iconPos="right"
            disabled={isSubmitting}
          />

          <QueryLink to='/signin' className="font-medium no-underline text-blue-500 align-self-center">Already have an account? <span className="font-semibold">Log in</span></QueryLink>

        </div>
      </form>
    </div>
  )
}