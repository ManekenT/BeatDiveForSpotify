interface Props {
    title: string
}

export function Seperator(props: Props) {
    return <div className='flex items-center space-x-4'>
        <div className='border-2 w-16 h-0' />
        <div className='text-4xl font-semibold'>{props.title}</div>
        <div className='border-2 w-16 h-0' />
    </div>
}