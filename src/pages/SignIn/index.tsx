import React from 'react';
import { Image } from "react-native";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Title } from './styles';

import logoImg from '../../assets/logo.png';

const SignIn: React.FC = () => {
    return (
        <Container>
            <Image source={logoImg}/>
            <Title>
                Sign-in
            </Title>

            <Input name={"email"} icon='mail' placeholder='E-mail'/>
            <Input name={"password"} icon='lock' placeholder='Password'/>

            <Button onPress={() => {console.log('pressed');}}>Sign-in</Button>
        </Container>
    )
}

export default SignIn;
