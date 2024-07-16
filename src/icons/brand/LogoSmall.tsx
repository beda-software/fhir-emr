import { useTheme } from 'styled-components';

export function LogoSmall(props: React.SVGProps<SVGSVGElement>) {
    const theme = useTheme();
    const color = props.color;
    const plusColor = color ? color : theme.mode === 'dark' ? 'rgba(255,255,255,0.85)' : theme.primary;
    const bottomColor = color ? color : theme.mode === 'dark' ? 'rgba(255,255,255,0.85)' : theme.secondaryPalette.bcs_6;

    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.88889 18C9.88889 21.3751 12.6249 24.1111 16 24.1111C19.3751 24.1111 22.1111 21.3751 22.1111 18H27C27 24.0751 22.0751 29 16 29C9.92487 29 5 24.0751 5 18H9.88889Z"
                fill={plusColor}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 4H14V8.94118H9V13H14V18H18V13H23V8.94118H18V4Z"
                fill={bottomColor}
            />
        </svg>
    );
}
