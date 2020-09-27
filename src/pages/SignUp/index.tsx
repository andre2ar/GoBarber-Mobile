import React from 'react';

import { Container } from './styles';
import {Image, KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";
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

const SignUp: React.FC = () => {
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

                        <Input name={"name"} icon='user' placeholder='Name'/>
                        <Input name={"email"} icon='mail' placeholder='E-mail'/>
                        <Input name={"password"} icon='lock' placeholder='Password'/>

                        <Button onPress={() => {console.log('pressed');}}>Sign-up</Button>
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
