interface props {
    children?: React.ReactNode,
    width?: number,
    times?: number
}

export default function Indent({children, width = 18, times = 1}: props) {
    return (
        <div style={{marginLeft: `${width*times}px`}}>
            {children}
        </div>
    )
}