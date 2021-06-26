import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';

const spotifyApi = new SpotifyWebApi();

interface Props {
    loadUser: () => void
    authorize: () => void
    error: (error: SpotifyWebApi.ErrorObject) => void
}

interface State {
    me?: SpotifyApi.UserObjectPrivate
}

export class AccountLabel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { me: undefined };
    }

    componentDidMount() {
        spotifyApi.getMe({},
            (error, me) => {
                if (error) {
                    this.props.error(error);
                } else {
                    this.setState({
                        me: me
                    });
                }
            }
        );
    }

    render() {
        if (this.state.me === undefined) {
            return <button className="item" onClick={this.props.authorize}>Authorize</button>;
        }
        if (this.state.me.images !== undefined) {
            var image: any = <img id="accountImage" src={this.state.me.images[0].url} alt="profile" />
        }
        return <button id="accountLabel" onClick={this.props.loadUser}>
            {image}
            <div id="accountName">{this.state.me.display_name}</div>
        </button>;
    }
}

export default AccountLabel;