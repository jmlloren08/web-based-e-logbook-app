import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logos/arta-logo.png"
            alt="ARTA Logo"
            {...props}
        />
    );
}

