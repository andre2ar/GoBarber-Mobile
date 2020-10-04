import React, {useCallback, useRef} from 'react';

import { Container } from './styles';
import {Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, View} from "react-native";
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
import * as Yup from "yup";
import {Form} from "@unform/mobile";
import {FormHandles} from "@unform/core";
import api from "../../services/api";
import getValidationError from "../../utils/getValidationError";

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const handleSubmit = useCallback(async (data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required('Name is required'),
                email: Yup.string()
                    .required('E-mail is required')
                    .email('Type a valid e-mail'),
                password: Yup.string()
                    .min(6, 'Password must have at least 6 digits'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await api.post('/users', data);
            Alert.alert(
                "Successfully signed-up",
                "Now you can sign in"
            );

            navigation.navigate('SignIn');
        } catch (err) {
            if(err instanceof Yup.ValidationError){
                const errors = getValidationError(err);
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert(
                "Sign-up error",
                "Try again in some minutes"
            );
        }
    }, [navigation]);

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

                        <Form ref={formRef} onSubmit={handleSubmit}>
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
