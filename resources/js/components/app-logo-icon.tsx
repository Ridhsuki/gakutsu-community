import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path
                className="fill-current"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 0.9L4 9.9V31.1L20 40.1L36 31.1V9.9L20 0.9ZM20 4.9L7.5 11.9V29.1L20 36.1L32.5 29.1V11.9L20 4.9ZM20 10A2.2 2.2 0 1 0 20 14.4A2.2 2.2 0 1 0 20 10ZM12.6 25.6A2.2 2.2 0 1 0 12.6 30A2.2 2.2 0 1 0 12.6 25.6ZM27.4 25.6A2.2 2.2 0 1 0 27.4 30A2.2 2.2 0 1 0 27.4 25.6ZM19.15 14.4H20.85V20.25H19.15V14.4ZM19.43 19.83L20.57 20.97L15.37 26.17L14.23 25.03L19.43 19.83ZM20.57 19.83L25.77 25.03L24.63 26.17L19.43 20.97L20.57 19.83Z"
            />
        </svg>
    );
}
