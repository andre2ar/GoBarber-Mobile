import React, {useCallback, useEffect, useState} from "react";
import {useNavigation, useRoute} from '@react-navigation/native';
import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    ProvidersList,
    ProvidersListContainer,
    ProviderContainer,
    ProviderAvatar,
    ProviderName
} from "./styles";
import Icon from "react-native-vector-icons/Feather";
import {useAuth} from "../../hooks/auth";
import api from "../../services/api";
import {Provider} from "../Dashboard";

interface RouteParams {
    providerId: string;
}

const CreateAppointment: React.FC = () => {
    const { user } = useAuth();
    const route = useRoute();
    const [providers, setProviders] = useState<Provider[]>([]);
    const { goBack } = useNavigation();
    const routeParams = route.params as RouteParams;
    const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);

    useEffect(() => {
        api.get(`providers`).then(response => {
            setProviders(response.data);
        });
    }, []);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const navigateBack = useCallback(() => {
        goBack();
    }, []);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name={'chevron-left'} size={24} color={"#999551"} />
                </BackButton>

                <HeaderTitle>
                    Barbers
                </HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url
                        ?? `https://ui-avatars.com/api/?name=${user.name}` }} />
            </Header>

            <ProvidersListContainer>
                <ProvidersList
                    horizontal
                    showHorizontalScrollIndicator={false}
                    data={providers}
                    keyExtractor={(provider: Provider) => provider.id}
                    renderItem={({item: provider}) => (
                        <ProviderContainer
                            selected={selectedProvider === provider.id}
                            onPress={() => handleSelectProvider(provider.id)}
                        >
                            <ProviderAvatar source={{ uri: provider.avatar_url
                                    ?? `https://ui-avatars.com/api/?name=${provider.name}` }} />
                            <ProviderName
                                selected={selectedProvider === provider.id}
                            >
                                {provider.name}
                            </ProviderName>
                        </ProviderContainer>
                    )}
                />
            </ProvidersListContainer>
        </Container>
    );
}

export default CreateAppointment;
