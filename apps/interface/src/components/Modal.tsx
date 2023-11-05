import { ReactNode } from 'react'
import closeButton from './../assets/close.png'
interface IModalProps {
  label: string
  content: ReactNode
  isOpen: boolean
  onClose?: () => void
}

export const Modal = ({ label, content, isOpen, onClose }: IModalProps) => {
  return (
    <>
      {isOpen ? (
        <div className="fixed z-50 h-full w-full overflow-hidden backdrop-blur-[2px]">
          <div className="flex h-full w-full items-center justify-center">
            <div className="z-50 flex h-fit w-[80%] flex-col gap-4 rounded-2xl border-2 border-stone-200 bg-neutral-50 p-5">
              <div className="flex justify-between">
                <p className="text-xl">{label}</p>
                <button onClick={onClose} className="w-fit">
                  <img src={closeButton} className="w-4" />
                </button>
              </div>
              {content}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
