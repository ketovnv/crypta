export function Etherium({width = '2em', height = '2em', color1, color2, isDark = true, animate,...props}) {
    const dx = isDark ? 0.3 : 0.5;

    const animations = {
        dark: {
            "--shadow-color-1": "#FF0000", // Example colors
            "--shadow-opacity-1": 0.8,
            "--shadow-color-2": "#FFFF00",
            "--shadow-opacity-2": 0.1,
            "--shadow-color-3": "#FF0000",
            "--shadow-opacity-3": 0.3,
        },
        light: {
            "--shadow-color-1": "#FFFF00",
            "--shadow-opacity-1": 0.4,
            "--shadow-color-2": "#FF0000",
            "--shadow-opacity-2": 0.4,
            "--shadow-color-3": "#000000",
            "--shadow-opacity-3": 1,
        },
    };

    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.3699951171875 1277.3800048828125"
                 width={width}
                 height={height}
                 {...props}
        >
        <g xmlns="http://www.w3.org/2000/svg" id="_1421394342400">
            <g>
                <polygon fill="#343434" fillRule="nonzero"
                         points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
                <polygon fill="#3C3C3B" fillRule="nonzero"
                         points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
                <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
                <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
            </g>
        </g>
    </svg>)
}
