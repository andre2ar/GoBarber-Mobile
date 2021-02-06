import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

interface ButtonProps {
    danger?: boolean;
}

interface ButtonTextProps {
    danger?: boolean;
}

export const Container = styled(RectButton)<ButtonProps>`
  width: 100%;
  height: 60px;
  background: ${(props: ButtonProps) => props.danger ? "red" : "#ff9000"};
  border-radius: 10px;
  margin-top: 8px;
  
  justify-content: center;
  align-items: center;  
`;

export const ButtonText = styled.Text<ButtonTextProps>`
  font-family: 'RobotoSlab-Medium';
  color: ${(props: ButtonTextProps) => props.danger ? "#fff" : "#312e38"};
  font-size: 18px;
`;
