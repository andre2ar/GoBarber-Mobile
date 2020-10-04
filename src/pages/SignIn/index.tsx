import React, {useCallback, useRef} from 'react';
import {Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert} from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as Yup from "yup";
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
import {Form} from "@unform/mobile";
import {FormHandles} from "@unform/core";
import getValidationError from "../../utils/getValidationError";
import {useAuth} from "../../hooks/auth";

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();
    const {signIn} = useAuth();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail is required')
                    .email('Type a valid e-mail'),
                password: Yup.string()
                    .required('Password is required'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await signIn({
                email: data.email,
                password: data.password,
            });
        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const errors = getValidationError(err);
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert(
                "Authentication error",
                "Wrong e-mail or password, try again"
            );
        }
    }, []);

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

                        <Form ref={formRef} onSubmit={handleSubmit}>
                            <Input
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
                                placeholder='Password'/>
                        </Form>

                        <Button onPress={() => {
                            formRef.current?.submitForm();
                        }}>
                            Sign-in
                        </Button>

                        <ForgotPassword onPress={() => {}}>
                            <ForgotPasswordText>
                                Forgot password
                            </ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </KeyboardAvoidingView>
            </ScrollView>

            <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
                <Icon name={"log-in"} size={20} color={"#ff9000"}/>
                <CreateAccountButtonText>
                    Sign-up
                </CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
}

export default SignIn;
