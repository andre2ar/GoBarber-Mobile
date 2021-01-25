import React, {useCallback, useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import api from "../../services/api";
import {useAuth} from "../../hooks/auth";
import Icon from 'react-native-vector-icons/Feather';

import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderName,
    ProviderMeta,
    ProviderMetaText,
    ProvidersListTitle,
} from './styles';

export interface Provider {
    id: string;
    name: string;
    avatar_ur: string;
}

const Dashboard: React.FC = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const {user, signOut} = useAuth();
    const { navigate } = useNavigation();

    useEffect(() => {
        api.get(`providers`).then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, []);

    const navigateToCreateAppointment = useCallback((providerId: string) => {
        navigate('CreateAppointment', { providerId });
    }, []);

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Welcome, {"\n"}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{
                        uri: user.avatar_url ?? `https://ui-avatars.com/api/?name=${user.name}`
                    }} />
                </ProfileButton>
            </Header>

            <ProvidersList
                data={providers}
                keyExtractor={(provider: Provider) => provider.id}
                ListHeaderComponent={
                    <ProvidersListTitle>
                        Barbers
                    </ProvidersListTitle>
                }
                renderItem={({item: provider}) => (
                    <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
                        <ProviderAvatar source={{
                            uri: provider.avatar_url
                                ?? `https://ui-avatars.com/api/?name=${provider.name}`
                        }}/>

                        <ProviderInfo>
                            <ProviderName>
                                {provider.name}
                            </ProviderName>

                            <ProviderMeta>
                                <Icon name={'calendar'} size={14} color={"#ff9000"}/>
                                <ProviderMetaText>Monday to friday</ProviderMetaText>
                            </ProviderMeta>

                            <ProviderMeta>
                                <Icon name={'clock'} size={14} color={"#ff9000"}/>
                                <ProviderMetaText>8am to 6pm</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    );
}

export default Dashboard;
