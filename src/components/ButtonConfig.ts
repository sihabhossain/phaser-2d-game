export interface ButtonStyle {
    color: string;
    backgroundColor: string;
    top: string;
    left: string;
    width: string;
    height: string;
    borderRadius: string;
    fontSize: string;
    position: 'absolute';
    transform: string;
  }
  
  export const buttonConfig = {
    buttonText: 'Start Game',
    buttonStyle: {
      color: '#FFFFFF',
      backgroundColor: '#A953FF',
      top: '75%',
      left: '50%',
      width: '70%',
      height: '48px',
      borderRadius: '8px',
      fontSize: '24px',
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
    } as ButtonStyle,
  };
  