import './bar.css';

interface Props {
    title: string
    value: number
}

function Bar(props: Props) {

    return <div className='flex flex-col items-center space-y-2 flex-grow'>
        <div className="w-12 h-full relative bar-container">
            <div className='bar bottom-0 absolute w-full transition-height duration-500' style={{ height: `${props.value}%` }}></div>
        </div>
        <div>{props.title}</div>
    </div>
}

export default Bar;