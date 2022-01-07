export const defaultTextBoxStyle = {
    background: 'rgba(255, 255, 255, 1)',
    color: 'rgba(20,20,20,1)',
    fontSize: '18px',
    borderRadius: '0px',
    fontFamily: 'Comic-2'
};

export const defaultCordinate = {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
};

export type Cordinate = typeof defaultCordinate;

export type TextBoxData = {
    id: string,
    style: React.CSSProperties,
    coordinates: Cordinate
}
