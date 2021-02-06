import React, {useCallback, useRef} from "react";
import {Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, View} from "react-native";
import {FormHandles} from "@unform/core";
import {useNavigation} from "@react-navigation/native";
import * as Yup from "yup";
import api from "../../services/api";
import getValidationError from "../../utils/getValidationError";
import {Container, Title, UserAvatar, UserAvatarButton, BackButton} from "./styles";
import {Form} from "@unform/mobile";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {useAuth} from "../../hooks/auth";
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const {user, updateUser, signOut} = useAuth();
    const navigation = useNavigation();

    const formRef = useRef<FormHandles>(null);

    const emailInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, []);

    const handleSubmit = useCallback(async (data: ProfileFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required('Name is required'),
                email: Yup.string()
                    .required('E-mail is required')
                    .email('Type a valid e-mail'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Mandatory field'),
                    otherwise: Yup.string(),
                }),
                password_confirmation: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Mandatory field'),
                    otherwise: Yup.string(),
                }).oneOf([Yup.ref('password'), undefined], 'Password must match'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            const response = await api.put('profile', data);
            await updateUser(response.data);
            Alert.alert(
                "Profile updated",
                "Your profile has been successfully updated"
            );

            navigation.goBack();
        } catch (err) {
            if(err instanceof Yup.ValidationError){
                const errors = getValidationError(err);
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert(
                "Profile update error",
                "Try again in some minutes"
            );
        }
    }, [navigation]);

    const handleUpdateAvatar = useCallback(() => {
        launchImageLibrary({
            mediaType: 'photo',
            includeBase64: false,
        }, image => {
            if(!image.uri) {
                return;
            }

            const data = new FormData();
            data.append('avatar', {
                type: image.type,
                name: image.fileName,
                uri: image.uri
            });

            api.patch('/users/avatar', data).then(async response => {
                await updateUser(response.data);
            }).catch(response => {
                Alert.alert('Error', "Try again in some minutes");
            });
        });
    }, []);

    return (
        <>
            <ScrollView keyboardShouldPersistTaps={"handled"}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'undefined'}
                    enabled
                >
                    <Container>
                        <BackButton onPress={handleGoBack}>
                            <Icon name={"chevron-left"} size={24} color={"#999591"}/>
                        </BackButton>
                        <UserAvatarButton onPress={handleUpdateAvatar}>
                            <UserAvatar source={{uri: user.avatar_url ??
                                    `https://ui-avatars.com/api/?name=${user.name}`}} />
                        </UserAvatarButton>
                        <View>
                            <Title>
                                My profile
                            </Title>
                        </View>

                        <Form
                            ref={formRef}
                            initialData={user}
                            onSubmit={handleSubmit}
                        >
                            <Input
                                autoCapitalize={"words"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                                name="name"
                                icon='user'
                                placeholder='Name'
                            />

                            <Input
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize={"none"}
                                keyboardType={"email-address"}
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    oldPasswordInputRef.current?.focus();
                                }}
                                name="email"
                                icon='mail'
                                placeholder='E-mail'
                            />

                            <Input
                                ref={oldPasswordInputRef}
                                secureTextEntry
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                                name={"old_password"}
                                containerStyle={{marginTop: 16}}
                                icon='lock'
                                textContentType={"newPassword"}
                                placeholder='Current password'/>

                            <Input
                                ref={passwordInputRef}
                                secureTextEntry
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    confirmPasswordInputRef.current?.focus();
                                }}
                                name={"password"}
                                icon='lock'
                                textContentType={"newPassword"}
                                placeholder='New password'/>

                            <Input
                                ref={confirmPasswordInputRef}
                                secureTextEntry
                                returnKeyType={"send"}
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                                name={"password"}
                                icon='lock'
                                textContentType={"newPassword"}
                                placeholder='Password confirmation'/>
                        </Form>

                        <Button onPress={() => {
                            formRef.current?.submitForm();
                        }}>
                            Confirm changes
                        </Button>

                        <Button danger={true} onPress={signOut}>
                            Log out
                        </Button>
                    </Container>
                </KeyboardAvoidingView>
            </ScrollView>
        </>
    );
}

export default Profile;
