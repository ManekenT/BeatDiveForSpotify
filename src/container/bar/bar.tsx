interface Props {
    title: string
    value: number
}

function Bar(props: Props) {

    return <div className='flex flex-col items-center space-y-2 flex-grow relative group'>
        <div className="w-12 h-full relative border-4">
            <div className='bg-text-color bottom-0 absolute w-full transition-height duration-500' style={{ height: `${props.value}%` }}></div>
        </div>
        <div>{props.title}</div>
        <div className='transition-opacity opacity-0 group-hover:opacity-100 absolute -top-10 font-medium'>{Math.round(props.value)}</div>
    </div>
}

export default Bar;