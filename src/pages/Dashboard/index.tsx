import React, {useCallback, useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import api from "../../services/api";
import {useAuth} from "../../hooks/auth";
import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar,
    ProvidersList,
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
                renderItem={({item}) => (
                    <UserName>{item.name}</UserName>
                )}
            />
        </Container>
    );
}

export default Dashboard;
