export const defaultTextBoxStyle = {
    background: 'rgba(255, 255, 255, 1)',
    color: 'rgba(20,20,20,1)',
    fontSize: '18px',
    borderRadius: '0px',
    fontFamily: 'Astro-City'
};

export const defaultCordinate = {
    x: 100,
    y: 100,
    width: 150,
    height: 150,
};

export type Cordinate = typeof defaultCordinate;

export type TextBoxData = {
    id: string,
    style: React.CSSProperties,
    coordinates: Cordinate
    page: number
    text: string,
    tooltip?: string
}
