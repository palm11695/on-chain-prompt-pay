export interface IUsePrepareWriteParams<C> {
  calldata: C | undefined
  onConfirm?: () => void
  onReject?: () => void
  onSuccess?: () => void
  onFail?: () => void
  enabled?: boolean
}

export interface IUsePreparedWrite {
  write: (() => void) | undefined
  isLoading: boolean
}
