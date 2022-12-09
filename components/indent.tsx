interface props {
    children?: React.ReactNode,
    width?: number,
}

export default function Indent({children, width = 18}: props) {
    return (
        <div style={{marginLeft: `${width}px`}}>
            {children}
        </div>
    )
}