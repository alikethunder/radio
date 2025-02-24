import { FC, memo, } from "react"

import { ReactComponent as Share_list } from '@/assets/svg/share_list.svg'
import { ReactComponent as Share_arrow } from '@/assets/svg/share_arrow.svg'

type Props = {
  background: string; //color of background button
}

export const ShareListIcon: FC<Props> = memo(({ background }) =>
  <div className="relative w-full h-full">
    <Share_list className="absolute top-0 left-0 bottom-0 right-0 m-auto" style={{
      width: '80%',
      height: 'auto',
    }} />
    <Share_arrow className="absolute" style={{
      width: '55%',
      height: 'auto',
      right: '6%',
      bottom: '8%',
      background: `linear-gradient(135deg, transparent, 30%, transparent,30%, ${background}, ${background})`,
      filter: 'none',
    }} />
  </div>
)
