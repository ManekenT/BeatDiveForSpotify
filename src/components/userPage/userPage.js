import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from "../../container/contentHeader/contentHeader";

const spotifyApi = new SpotifyWebApi();

class UserPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { user: '' };
    }

    componentDidMount() {
        spotifyApi.getUser(this.props.userId, {}, (error, user) => {
            if (error) {
                this.props.error(error)
                return;
            }
            this.setState({
                user: user
            });
        });
    }

    render() {
        if (this.state.user === '') {
            return null;
        }
        return <ContentHeader title={this.state.user.display_name} images={this.state.user.images} contentType="User" />
    }
}

export default UserPage;