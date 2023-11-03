import { ReactNode, useEffect } from 'react'
import ReactLoading from 'react-loading'
import { useLocation, useNavigate } from 'react-router-dom'

interface ILoadingPageProps {
  label?: ReactNode
  path?: string
  isComponent?: boolean
  component?: ReactNode
}

const LoadingPage = ({ label, path, isComponent }: ILoadingPageProps) => {
  const navigate = useNavigate()

  const { search } = useLocation()
  useEffect(() => {
    const goTo = new URLSearchParams(search).get('goTo')
    const delay = new URLSearchParams(search).get('delay')
    const params = new URLSearchParams(search)
      .toString()
      .replace('goTo=', '')
      .split('&')
    const _params = params.slice(1, params.length).join('&')

    if (!isComponent)
      setTimeout(
        () => {
          navigate(`/${goTo ? goTo + '?' + _params : ''}`)
        },
        delay ? Number(delay) : 1500,
      )
  }, [search, path])

  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-6">
      <ReactLoading type={'spin'} color={'#3D70FF'} height={100} width={100} />
      <div className="text-2xl tracking-wide">
        {label ? label : 'Loading...'}
      </div>
    </div>
  )
}

export default LoadingPage
