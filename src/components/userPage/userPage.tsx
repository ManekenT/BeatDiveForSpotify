import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const spotifyApi = new SpotifyWebApi();

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
    error: (error: SpotifyWebApi.ErrorObject) => void
}

interface State {
    user?: SpotifyApi.UserObjectPublic
}

class UserPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { user: undefined };
    }

    componentDidMount() {
        spotifyApi.getUser(this.props.match.params.id, {}, (error, user) => {
            if (error) {
                this.props.error(error);
                return;
            }
            this.setState({
                user: user
            });
        });
    }

    render() {
        if (this.state.user === undefined) {
            return null;
        }
        let imageUrl = undefined;
        if (this.state.user.images !== undefined) {
            imageUrl = this.state.user.images[0].url;
        }
        return <div className="contentContainer">
            <ContentHeader title={this.state.user.display_name} imageUrl={imageUrl} contentType="User" />
        </div >;
    }
}

export default withRouter(UserPage);