interface Props {
    header: string,
    label: string
}

export default function Header({header, label}: Props) {
    return (
        <div className="pb-8">
            <h1 className="text-3xl font-bold">{header}</h1>
            <p className="text-base text-muted-foreground">
                {label}
            </p>
        </div>
    )
}