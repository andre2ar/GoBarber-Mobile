import React, {useCallback, useRef} from 'react';

import { Container } from './styles';
import {Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, View} from "react-native";
import logoImg from "../../assets/logo.png";
import {
    BackToSignIn,
    BackToSignInText,
    Title
} from "./styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/Feather";
import {useNavigation} from "@react-navigation/native";
import {Form} from "@unform/mobile";
import {FormHandles} from "@unform/core";

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);

    const handleSignIn = useCallback((data: object) => {
        console.log(data);
    }, []);
    const navigation = useNavigation();

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
                                Sign-up
                            </Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input
                                autoCapitalize={"words"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                                name={"name"}
                                icon='user'
                                placeholder='Name'/>

                            <Input
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize={"none"}
                                keyboardType={"email-address"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                                name={"email"}
                                icon='mail'
                                placeholder='E-mail'/>

                            <Input
                                ref={passwordInputRef}
                                secureTextEntry
                                returnKeyType={"send"}
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                                name={"password"}
                                icon='lock'
                                textContentType={"newPassword"}
                                placeholder='Password'/>
                        </Form>

                        <Button onPress={() => {
                            formRef.current?.submitForm();
                        }}>
                            Sign-up
                        </Button>
                    </Container>
                </KeyboardAvoidingView>
            </ScrollView>

            <BackToSignIn onPress={() => navigation.goBack()}>
                <Icon name={"arrow-left"} size={20} color={"#fff"}/>
                <BackToSignInText>
                    Back to Sign-in
                </BackToSignInText>
            </BackToSignIn>
        </>
    );
}

export default SignUp;
