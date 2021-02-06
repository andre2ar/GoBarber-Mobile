import React from "react";
import { RectButtonProperties } from "react-native-gesture-handler";

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
    children: string;
    danger?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, danger, ...rest }) => {
    return (
        <Container danger={danger}  {...rest}>
            <ButtonText danger={danger}>
                {children}
            </ButtonText>
        </Container>
    );
};

export default Button;
