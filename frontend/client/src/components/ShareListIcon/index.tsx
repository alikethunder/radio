import { FC, memo, } from "react"

type Props = {
  background: string; //color of background button
}

export const ShareListIcon: FC<Props> = memo(({ background }) =>
  <div className="relative w-full h-full">
    {/* Share list */}
    <svg className="absolute top-0 left-0 bottom-0 right-0 m-auto h-auto" style={{
      width: '80%',
    }} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em"
      xmlns="http://www.w3.org/2000/svg">
      <g id="View_List">
        <g>
          <path
            d="M18.436,20.937H5.562a2.5,2.5,0,0,1-2.5-2.5V5.563a2.5,2.5,0,0,1,2.5-2.5H18.436a2.5,2.5,0,0,1,2.5,2.5V18.437A2.5,2.5,0,0,1,18.436,20.937ZM5.562,4.063a1.5,1.5,0,0,0-1.5,1.5V18.437a1.5,1.5,0,0,0,1.5,1.5H18.436a1.5,1.5,0,0,0,1.5-1.5V5.563a1.5,1.5,0,0,0-1.5-1.5Z">
          </path>
          <path
            d="M6.544,8.283h0a.519.519,0,0,1-.353-.147.5.5,0,0,1,0-.707.512.512,0,0,1,.353-.146H7.55a.516.516,0,0,1,.353.146.5.5,0,0,1,.147.354.5.5,0,0,1-.5.5Z">
          </path>
          <path
            d="M6.544,12.5h0a.523.523,0,0,1-.353-.146.5.5,0,0,1,0-.708.516.516,0,0,1,.353-.146H7.55a.521.521,0,0,1,.353.146.5.5,0,0,1,0,.708.516.516,0,0,1-.353.146Z">
          </path>
          <path
            d="M6.544,16.72h0a.519.519,0,0,1-.353-.147.5.5,0,0,1,0-.707.516.516,0,0,1,.353-.146H7.55a.516.516,0,0,1,.353.146.5.5,0,0,1,.147.354.5.5,0,0,1-.5.5Z">
          </path>
          <path d="M10.554,8.281h0a.5.5,0,0,1,0-1h6.9a.5.5,0,0,1,0,1Z"></path>
          <path d="M10.554,12.5h0a.5.5,0,0,1,0-1h6.9a.5.5,0,0,1,0,1Z"></path>
          <path d="M10.554,16.718h0a.5.5,0,0,1,0-1h6.9a.5.5,0,0,1,0,1Z"></path>
        </g>
      </g>
    </svg>
    {/* Share arrow */}
    <svg className="absolute h-auto" style={{
      width: '55%',
      right: '6%',
      bottom: '8%',
      background: `linear-gradient(135deg, transparent, 30%, transparent,30%, ${background}, ${background})`,
      filter: 'none',
    }}
      stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z">
      </path>
    </svg>
  </div>
)
