import {isArray,isEmpty} from"lodash"

/* eslint-disable @typescript-eslint/no-explicit-any */
type RepsonseOk = {
  data: {
    [name: string]: any
    meta: any
  }
}

type ResponseKo = {
  err: {
    status: number
    code: string
    description: string
  }
}

export function success(resource: any, meta: any = {}): RepsonseOk {
  
  const name = (isArray(resource)) && !isEmpty(resource) ? resource[0].constructor.name : resource.constructor.name 


 return isArray(resource) ? { data: { [name.toLowerCase()]: resource, meta } } : { data: { [name.toLowerCase()]: resource.toJSON(), meta } }
}

export function error({ status, code }: { status: number; code: string }, err: any): ResponseKo {
  const description = err.detail ? err.detail : err.message

  return {
    err: {
      status,
      code,
      description,
    },
  }
}
