import React from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
    Container,
    Title,
    ForgotPassword,
    ForgotPasswordText,
    CreateAccountButton,
    CreateAccountButtonText,
} from './styles';

import logoImg from '../../assets/logo.png';

const SignIn: React.FC = () => {
    return (
        <>
            <ScrollView
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{flex: 1}}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'undefined'}
                    enabled
                >
                    <Container>
                        <Image source={logoImg}/>
                        <View>
                            <Title>
                                Sign-in
                            </Title>
                        </View>

                        <Input name={"email"} icon='mail' placeholder='E-mail'/>
                        <Input name={"password"} icon='lock' placeholder='Password'/>

                        <Button onPress={() => {console.log('pressed');}}>Sign-in</Button>

                        <ForgotPassword onPress={() => {}}>
                            <ForgotPasswordText>
                                Forgot password
                            </ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </KeyboardAvoidingView>
            </ScrollView>

            <CreateAccountButton onPress={() => {}}>
                <Icon name={"log-in"} size={20} color={"#ff9000"}/>
                <CreateAccountButtonText>
                    Sign-up
                </CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
}

export default SignIn;
