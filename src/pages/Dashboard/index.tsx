import React, {useCallback} from "react";

import {useAuth} from "../../hooks/auth";
import {
    Container,
    Header,
    HeaderTitle,
    UserName,
    ProfileButton,
    UserAvatar
} from './styles';
import {useNavigation} from "@react-navigation/native";

const Dashboard: React.FC = () => {
    const {user, signOut} = useAuth();
    const { navigate } = useNavigation();

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
        </Container>
    );
}

export default Dashboard;
