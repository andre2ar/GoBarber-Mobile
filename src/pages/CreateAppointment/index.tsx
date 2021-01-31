import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigation, useRoute} from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from 'date-fns';
import {
    Container,
    Header,
    BackButton,
    HeaderTitle,
    UserAvatar,
    Content,
    ProvidersList,
    ProvidersListContainer,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
} from "./styles";
import Icon from "react-native-vector-icons/Feather";
import {useAuth} from "../../hooks/auth";
import api from "../../services/api";
import {Provider} from "../Dashboard";
import {Platform} from "react-native";

interface RouteParams {
    providerId: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const { user } = useAuth();
    const route = useRoute();

    const [availability, setAvailability] = useState<AvailabilityItem[]>([])
    const [providers, setProviders] = useState<Provider[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const { goBack } = useNavigation();
    const routeParams = route.params as RouteParams;
    const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);

    useEffect(() => {
        api.get(`providers`).then(response => {
            setProviders(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
        setSelectedHour(0);
    }, []);

    const navigateBack = useCallback(() => {
        goBack();
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(showDatePicker => !showDatePicker);
    }, []);

    const handleDateChange = useCallback((event: any, date: Date|undefined) => {
        if(Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if(date) {
            setSelectedDate(date);
            setSelectedHour(0);
        }
    }, []);

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const morningAvailability = useMemo(() => {
        return availability.filter(({ hour }) => hour < 12)
            .map(({ hour, available}) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00')
                }
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability.filter(({ hour }) => hour >= 12)
            .map(({ hour, available}) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00')
                }
            });
    }, [availability]);

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

            <Content>
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

                <Calendar>
                    <Title>
                        Pick a date
                    </Title>

                    <OpenDatePickerButton onPress={handleToggleDatePicker} >
                        <OpenDatePickerButtonText>
                            Pick another date
                        </OpenDatePickerButtonText>
                    </OpenDatePickerButton>
                    {showDatePicker && <DateTimePicker
                        mode={"date"}
                        display={"calendar"}
                        textColor={"#f4ede8"}
                        value={selectedDate}
                        onChange={handleDateChange}
                    />}
                </Calendar>

                <Schedule>
                    <Title>
                        Pick a time
                    </Title>

                    <Section>
                        <SectionTitle>Morning</SectionTitle>
                        <SectionContent>
                            {morningAvailability.map(
                                ({
                                     hourFormatted,
                                     available,
                                     hour
                                }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        onPress={() => handleSelectHour(hour)}
                                        available={available}
                                        key={hourFormatted}
                                    >
                                        <HourText selected={selectedHour === hour}>
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                            ))}
                        </SectionContent>
                    </Section>

                    <Section>
                        <SectionTitle>Afternoon</SectionTitle>
                        <SectionContent>
                            {afternoonAvailability.map(
                                ({
                                     hourFormatted,
                                     available,
                                     hour
                                }) => (
                                    <Hour
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        onPress={() => handleSelectHour(hour)}
                                        available={available}
                                        key={hourFormatted}
                                    >
                                        <HourText selected={selectedHour === hour}>
                                            {hourFormatted}
                                        </HourText>
                                    </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                </Schedule>
            </Content>
        </Container>
    );
}

export default CreateAppointment;
